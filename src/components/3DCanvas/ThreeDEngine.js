/* eslint-disable no-param-reassign */
/* eslint-disable eqeqeq */
export default class ThreeDEngine {
  constructor(scene, threshold = 2000) {
    this.scene = scene;
    this.threshold = threshold;
    this.threeObjects = [];
    this.complexity = 0;
  }

  getThreeObjects(instances) {
    this.traverseInstances(instances);
    return this.threeObjects;
  }

  traverseInstances(instances) {
    for (const instance of instances) {
      this.checkVisualInstance(instance);
    }
  }

  checkVisualInstance(instance) {
    if (instance.hasCapability(GEPPETTO.Resources.VISUAL_CAPABILITY)) {
      // since the visualcapability propagates up through the parents we can avoid visiting things that don't have it
      if (
        instance.getType().getMetaType() !==
          GEPPETTO.Resources.ARRAY_TYPE_NODE &&
        instance.getVisualType()
      ) {
        this.buildVisualInstance(instance);
      }
      // this block keeps traversing the instances
      if (instance.getMetaType() === GEPPETTO.Resources.INSTANCE_NODE) {
        this.traverseInstances(instance.getChildren());
      } else if (
        instance.getMetaType() === GEPPETTO.Resources.ARRAY_INSTANCE_NODE
      ) {
        this.traverseInstances(instance);
      }
    }
  }

  buildVisualInstance(instance) {
    this.generate3DObjects(instance);

    // Todo: add init3DObject
  }

  generate3DObjects(instance) {
    // TODO add previous3DObject
    // TODO: This can be optimised, no need to create both
    const materials = {
      mesh: this.getMeshPhongMaterial(),
      line: this.getLineMaterial(),
    };

    this.walkVisTreeGen3DObjs(instance, materials);

    // TODO: MergeObjects
  }

  getMeshPhongMaterial(color) {
    if (color == undefined) {
      color = GEPPETTO.Resources.COLORS.DEFAULT;
    }
    const material = new THREE.MeshPhongMaterial({
      opacity: 1,
      shininess: 10,
      flatShading: false,
    });

    this.setThreeColor(material.color, color);
    material.defaultColor = color;
    material.defaultOpacity = GEPPETTO.Resources.OPACITY.DEFAULT;
    material.nowireframe = true;
    return material;
  }

  getLineMaterial(color) {
    if (color == undefined) {
      color = GEPPETTO.Resources.COLORS.DEFAULT;
    }
    const material = new THREE.LineBasicMaterial();
    this.setThreeColor(material.color, color);
    material.defaultColor = color;
    material.defaultOpacity = GEPPETTO.Resources.OPACITY.DEFAULT;
    return material;
  }

  setThreeColor(threeColor, color) {
    // eslint-disable-next-line no-restricted-globals
    if (!isNaN(color % 1)) {
      // we have an integer (hex) value
      threeColor.setHex(color);
    } else if (
      Object.prototype.hasOwnProperty.call(color, 'r') &&
      Object.prototype.hasOwnProperty.call(color, 'g') &&
      Object.prototype.hasOwnProperty.call(color, 'b')
    ) {
      threeColor.r = color.r;
      threeColor.g = color.g;
      threeColor.b = color.b;
    } else {
      threeColor.set(color);
    }
  }

  walkVisTreeGen3DObjs(instance, materials) {
    let threeDeeObj = null;
    const threeDeeObjList = [];
    let visualType = instance.getVisualType();
    if (visualType == undefined) {
      return threeDeeObjList;
    }
    if (visualType.isArray) {
      // TODO if there is more than one visual type we need to display all of them
      visualType = visualType[0];
    }
    if (
      visualType.getMetaType() == GEPPETTO.Resources.COMPOSITE_VISUAL_TYPE_NODE
    ) {
      // eslint-disable-next-line guard-for-in
      for (const v in visualType.getVariables()) {
        const visualValue = visualType.getVariables()[v].getWrappedObj()
          .initialValues[0].value;
        threeDeeObj = this.create3DObjectFromInstance(
          instance,
          visualValue,
          visualType.getVariables()[v].getId(),
          materials
        );
        if (threeDeeObj) {
          threeDeeObjList.push(threeDeeObj);
        }
      }
    } else if (
      visualType.getMetaType() == GEPPETTO.Resources.VISUAL_TYPE_NODE &&
      visualType.getId() == 'particles'
    ) {
      const visualValue = instance.getVariable().getWrappedObj()
        .initialValues[0].value;
      threeDeeObj = this.create3DObjectFromInstance(
        instance,
        visualValue,
        instance.getVariable().getId(),
        materials
      );
      if (threeDeeObj) {
        threeDeeObjList.push(threeDeeObj);
      }
    } else {
      const visualValue = visualType.getWrappedObj().defaultValue;
      threeDeeObj = this.create3DObjectFromInstance(
        instance,
        visualValue,
        visualType.getId(),
        materials
      );
      if (threeDeeObj) {
        threeDeeObjList.push(threeDeeObj);
      }
    }

    return threeDeeObjList;
  }

  create3DObjectFromInstance(instance, node, id, materials) {
    let threeObject = null;

    const lines = this.getDefaultGeometryType() == 'lines';

    const material = lines ? materials.line : materials.mesh;

    // eslint-disable-next-line default-case
    switch (node.eClass) {
      case GEPPETTO.Resources.PARTICLES:
        threeObject = this.createParticles(node);
        break;

      case GEPPETTO.Resources.CYLINDER:
        if (lines) {
          threeObject = this.create3DLineFromNode(node, material);
        } else {
          threeObject = this.create3DCylinderFromNode(node, material);
        }
        this.complexity++;
        break;

      case GEPPETTO.Resources.SPHERE:
        if (lines) {
          threeObject = this.create3DLineFromNode(node, material);
        } else {
          threeObject = this.create3DSphereFromNode(node, material);
        }
        this.complexity++;
        break;

      // TODO: Add collada and OBJ loaders
    }

    if (threeObject) {
      this.threeObjects.push(threeObject);
      // TODO: shouldn't that be the vistree? why is it also done at the loadEntity level??
      // TODO: Add visuamModelMap
    }
    return threeObject;
  }

  getDefaultGeometryType() {
    // TODO: Add user interaction
    const aboveLinesThreshold = this.complexity > this.linesThreshold;
    return aboveLinesThreshold ? 'lines' : 'cylinders';
  }

  createParticles(node) {
    const geometry = new THREE.Geometry();
    const threeColor = new THREE.Color();
    const color = `0x${Math.floor(Math.random() * 16777215).toString(16)}`;
    threeColor.setHex(color);

    const textureLoader = new THREE.TextureLoader();
    const material = new THREE.PointsMaterial({
      size: 2,
      map: textureLoader.load('../../../assets/3dparticle.png'),
      blending: THREE.NormalBlending,
      depthTest: true,
      transparent: true,
      color: threeColor,
    });

    for (let p = 0; p < node.particles.length; p++) {
      geometry.vertices.push(
        new THREE.Vector3(
          node.particles[p].x,
          node.particles[p].y,
          node.particles[p].z
        )
      );
    }

    material.defaultColor = color;
    material.defaultOpacity = 1;
    const threeObject = new THREE.Points(geometry, material);
    threeObject.visible = true;
    threeObject.instancePath = node.instancePath;
    threeObject.highlighted = false;
    return threeObject;
  }

  create3DLineFromNode(node, material) {
    let threeObject = null;
    if (node.eClass == GEPPETTO.Resources.CYLINDER) {
      const bottomBasePos = new THREE.Vector3(
        node.position.x,
        node.position.y,
        node.position.z
      );
      const topBasePos = new THREE.Vector3(
        node.distal.x,
        node.distal.y,
        node.distal.z
      );

      const axis = new THREE.Vector3();
      axis.subVectors(topBasePos, bottomBasePos);
      const midPoint = new THREE.Vector3();
      midPoint.addVectors(bottomBasePos, topBasePos).multiplyScalar(0.5);

      const geometry = new THREE.Geometry();
      geometry.vertices.push(bottomBasePos);
      geometry.vertices.push(topBasePos);
      threeObject = new THREE.Line(geometry, material);
      threeObject.applyMatrix(
        new THREE.Matrix4().makeTranslation(0, axis.length() / 2, 0)
      );
      threeObject.applyMatrix(new THREE.Matrix4().makeRotationY(Math.PI / 2));
      threeObject.lookAt(axis);
      threeObject.position.fromArray(bottomBasePos.toArray());
      threeObject.applyMatrix(new THREE.Matrix4().makeRotationY(-Math.PI / 2));

      threeObject.geometry.verticesNeedUpdate = true;
    } else if (node.eClass == GEPPETTO.Resources.SPHERE) {
      const sphere = new THREE.SphereGeometry(node.radius, 20, 20);
      threeObject = new THREE.Mesh(sphere, material);
      threeObject.position.set(
        node.position.x,
        node.position.y,
        node.position.z
      );
      threeObject.geometry.verticesNeedUpdate = true;
    }
    return threeObject;
  }

  create3DCylinderFromNode(cylNode, material) {
    const bottomBasePos = new THREE.Vector3(
      cylNode.position.x,
      cylNode.position.y,
      cylNode.position.z
    );
    const topBasePos = new THREE.Vector3(
      cylNode.distal.x,
      cylNode.distal.y,
      cylNode.distal.z
    );

    const axis = new THREE.Vector3();
    axis.subVectors(topBasePos, bottomBasePos);

    const c = new THREE.CylinderGeometry(
      cylNode.topRadius,
      cylNode.bottomRadius,
      axis.length(),
      20,
      1,
      false
    );

    // shift it so one end rests on the origin
    c.applyMatrix(new THREE.Matrix4().makeTranslation(0, axis.length() / 2, 0));
    // rotate it the right way for lookAt to work
    c.applyMatrix(new THREE.Matrix4().makeRotationX(Math.PI / 2));
    // make a mesh with the geometry
    const threeObject = new THREE.Mesh(c, material);
    // make it point to where we want
    threeObject.lookAt(axis);
    // move base
    threeObject.position.fromArray(bottomBasePos.toArray());
    threeObject.geometry.verticesNeedUpdate = true;

    return threeObject;
  }

  create3DSphereFromNode(sphereNode, material) {
    const sphere = new THREE.SphereGeometry(sphereNode.radius, 20, 20);
    // sphere.applyMatrix(new THREE.Matrix4().makeScale(-1,1,1));
    const threeObject = new THREE.Mesh(sphere, material);
    threeObject.position.set(
      sphereNode.position.x,
      sphereNode.position.y,
      sphereNode.position.z
    );

    return threeObject;
  }
}
