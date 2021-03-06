/* eslint-disable no-param-reassign */
/* eslint-disable eqeqeq */
import particle from '../../../assets/particle.png';

require('./OBJLoader');

export default class GeppettoThree {
  constructor(threshold = 2000) {
    this.threshold = threshold;
    this.complexity = 0;
    // TODO: Meshes duplicated of visualModeMap
    this.meshes = {};
    this.splitMeshes = {};
    this.visualModelMap = {};
  }

  getThreeMeshes() {
    // TODO: set geometry type
    // TODO: Make sure this is correct:
    return { ...this.meshes, ...this.splitMeshes };
  }

  initTextures(callback) {
    const textureLoader = new THREE.TextureLoader();
    textureLoader.load(particle, (texture) => {
      this.particleTexture = texture;
      callback();
    });
  }

  init(instances) {
    this.meshes = {};
    this.splitMeshes = {};
    this.visualModelMap = {};
    this.traverseInstances(instances);
  }

  traverseInstances(instances) {
    for (let j = 0; j < instances.length; j++) {
      this.checkVisualInstance(instances[j]);
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
    const meshes = this.generate3DObjects(instance);
    this.init3DObject(meshes, instance);
  }

  init3DObject(meshes, instance) {
    const instancePath = instance.getInstancePath();
    const position = instance.getPosition();
    for (const m in meshes) {
      const mesh = meshes[m];

      mesh.instancePath = instancePath;
      // if the model file is specifying a position for the loaded meshes then we translate them here
      if (position != null) {
        mesh.position.set(position.x, position.y, position.z);
        mesh.geometry.verticesNeedUpdate = true;
        mesh.updateMatrix();
      }
      this.meshes[instancePath] = mesh;
      this.meshes[instancePath].visible = true;
      this.meshes[instancePath].ghosted = false;
      this.meshes[instancePath].defaultOpacity = 1;
      this.meshes[instancePath].selected = false;
      this.meshes[instancePath].input = false;
      this.meshes[instancePath].output = false;

      // Split anything that was splitted before
      if (instancePath in this.splitMeshes) {
        const { splitMeshes } = this;
        const elements = {};
        for (const splitMesh in splitMeshes) {
          if (
            splitMeshes[splitMesh].instancePath == instancePath &&
            splitMesh != instancePath
          ) {
            const visualObject = splitMesh.substring(instancePath.length + 1);
            elements[visualObject] = '';
          }
        }
        if (Object.keys(elements).length > 0) {
          this.splitGroups(instance, elements);
        }
      }
      // TODO: Add scalculateSceneMaxRadius
    }
  }

  /**
   * Split merged mesh into individual meshes
   *
   * @param {String}
   *            instancePath - Path of aspect, corresponds to original merged mesh
   * @param {AspectSubTreeNode}
   *            visualizationTree - Aspect Visualization Tree with groups info for visual objects
   * @param {object}
   *            groups - The groups that we need to split mesh into
   */
  splitGroups(instance, groupElements) {
    if (!this.hasInstance(instance)) {
      return;
    }
    const instancePath = instance.getInstancePath();

    // retrieve the merged mesh
    const mergedMesh = this.meshes[instancePath];
    // create object to hold geometries used for merging objects in groups
    const geometryGroups = {};

    /*
     * reset the aspect instance path group mesh, this is used to group visual objects that don't belong to any of the groups passed as parameter
     */
    this.splitMeshes[instancePath] = null;
    geometryGroups[instancePath] = new THREE.Geometry();

    // create map of geometry groups for groups
    for (const groupElement in groupElements) {
      const groupName = `${instancePath}.${groupElement}`;

      const geometry = new THREE.Geometry();
      geometry.groupMerge = true;

      geometryGroups[groupName] = geometry;
    }

    // get map of all meshes that merged mesh was merging
    const map = mergedMesh.mergedMeshesPaths;

    /*
     * flag for keep track what visual objects were added to group
     * meshes already
     */
    let added = false;
    /*
     * loop through individual meshes, add them to group, set new
     * material to them
     */

    for (const v in map) {
      if (v != undefined) {
        const m = this.visualModelMap[map[v]];

        // eslint-disable-next-line no-eval
        eval(map[v].substring(0, map[v].lastIndexOf('.')));
        const object = instance.getVisualType()[
          map[v].replace(`${instancePath}.`, '')
        ];

        // If it is a segment compare to the id otherwise check in the visual groups
        if (object.getId() in groupElements) {
          // true means don't add to mesh with non-groups visual objects
          added = this.addMeshToGeometryGroup(
            instance,
            object.getId(),
            geometryGroups,
            m
          );
        } else {
          // get group elements list for object
          const groupElementsReference = object.getInitialValue().value
            .groupElements;
          for (let i = 0; i < groupElementsReference.length; i++) {
            const objectGroup = GEPPETTO.ModelFactory.resolve(
              groupElementsReference[i].$ref
            ).getId();
            if (objectGroup in groupElements) {
              // true means don't add to mesh with non-groups visual objects
              added = this.addMeshToGeometryGroup(
                instance,
                objectGroup,
                geometryGroups,
                m
              );
            }
          }
        }

        /*
         * if visual object didn't belong to group, add it to mesh
         * with remainder of them
         */
        if (!added) {
          const geometry = geometryGroups[instancePath];
          if (m instanceof THREE.Line) {
            geometry.vertices.push(m.geometry.vertices[0]);
            geometry.vertices.push(m.geometry.vertices[1]);
          } else {
            // merged mesh into corresponding geometry
            geometry.merge(m.geometry, m.matrix);
          }
        }
        // reset flag for next visual object
        added = false;
      }
    }

    groupElements[instancePath] = {};
    groupElements[instancePath].color = GEPPETTO.Resources.COLORS.SPLIT;
    this.createGroupMeshes(instancePath, geometryGroups, groupElements);
  }

  /**
   * Create group meshes for given groups, retrieves from map if already present
   * @param instancePath
   * @param geometryGroups
   * @param groups
   */
  createGroupMeshes(instancePath, geometryGroups, groups) {
    if (!this.hasInstance(instancePath)) {
      return;
    }
    const mergedMesh = this.meshes[instancePath];
    // switch visible flag to false for merged mesh and remove from scene
    mergedMesh.visible = false;

    for (const g in groups) {
      let groupName = g;
      if (groupName.indexOf(instancePath) <= -1) {
        groupName = `${instancePath}.${g}`;
      }

      let groupMesh = this.splitMeshes[groupName];
      const geometryGroup = geometryGroups[groupName];

      if (mergedMesh instanceof THREE.Line) {
        const material = this.getLineMaterial();
        groupMesh = new THREE.LineSegments(geometryGroup, material);
      } else {
        const material = this.getMeshPhongMaterial();
        groupMesh = new THREE.Mesh(geometryGroup, material);
      }
      groupMesh.instancePath = instancePath;
      groupMesh.geometryIdentifier = g;
      groupMesh.geometry.dynamic = false;
      groupMesh.position.copy(mergedMesh.position);

      this.splitMeshes[groupName] = groupMesh;

      // Update visualization feature for a mesh
      if (mergedMesh.ghosted) {
        this.unselectedTransparent([groupMesh], true);
      }
      if (mergedMesh.selected) {
        this.selectInstance(groupName);
      }
      groupMesh.selected = mergedMesh.selected;

      // add split mesh to scenne and set flag to visible
      groupMesh.visible = true;
    }
  }

  /**
   * Make unselected instances transparent or not
   *
   * @param {boolean}
   *            apply - Turn on or off the transparency
   */
  unselectedTransparent(apply) {
    // TODO: Add this feature
    console.log('unselectedTransparent');
    // GEPPETTO.SceneController.unselectedTransparent(this.meshes, apply);
    // GEPPETTO.SceneController.unselectedTransparent(this.splitMeshes, apply);
  }

  /**
   * Selects an aspect given the path of it. Color changes to yellow, and opacity become 100%.
   *
   * @param {String}
   *            instancePath - Path of aspect of mesh to select
   */
  selectInstance(instancePath, geometryIdentifier) {
    // TODO: Add this feature
    console.log('selectInstance');
    // if (!this.hasInstance(instancePath)) {
    //   return;
    // }
    // var that = this;
    // if (geometryIdentifier != undefined && geometryIdentifier != '') {
    //   instancePath = instancePath + '.' + geometryIdentifier;
    // }
    // var meshes = this.getRealMeshesForInstancePath(instancePath);
    // if (meshes.length > 0) {
    //   for (var meshesIndex in meshes) {
    //     var mesh = meshes[meshesIndex];

    //     if (!mesh.visible) {
    //       this.merge(instancePath, true);
    //     }
    //     if (mesh.selected == false) {
    //       if (mesh instanceof THREE.Object3D) {
    //         mesh.traverse(function (child) {
    //           if (Object.prototype.hasOwnProperty.call(child, 'material')) {
    //             that.setThreeColor(
    //               child.material.color,
    //               GEPPETTO.Resources.COLORS.SELECTED
    //             );
    //             child.material.opacity = Math.max(
    //               0.5,
    //               child.material.defaultOpacity
    //             );

    //             if (GEPPETTO.isKeyPressed('c')) {
    //               child.geometry.computeBoundingBox();
    //               that.controls.target.copy(child.position);
    //               that.controls.target.add(
    //                 child.geometry.boundingBox.getCenter()
    //               );
    //             }
    //           }
    //         });
    //       } else {
    //         this.setThreeColor(
    //           mesh.material.color,
    //           GEPPETTO.Resources.COLORS.SELECTED
    //         );
    //         mesh.material.opacity = Math.max(0.5, mesh.material.defaultOpacity);
    //         if (GEPPETTO.isKeyPressed('c')) {
    //           mesh.geometry.computeBoundingBox();
    //           // let's set the center of rotation to the selected mesh
    //           this.controls.target.copy(mesh.position);
    //           this.controls.target.add(mesh.geometry.boundingBox.getCenter());
    //         }
    //       }
    //       mesh.selected = true;
    //       mesh.ghosted = false;

    //       this.camera.updateProjectionMatrix();
    //     }
    //     if (GEPPETTO.isKeyPressed('z')) {
    //       this.zoomTo([eval(instancePath)]);
    //     }
    //   }
    // }

    // var instance = eval(instancePath);

    // // Behaviour: help exploration of networks by ghosting and not highlighting non connected or selected
    // if (instance !== undefined && instance.getConnections().length > 0) {
    //   // allOtherMeshes will contain a list of all the non connected entities in the scene
    //   var allOtherMeshes = $.extend({}, this.meshes);
    //   // look on the simulation selection options and perform necessary operations
    //   if (
    //     G.getSelectionOptions().show_inputs &&
    //     G.getSelectionOptions().show_outputs
    //   ) {
    //     var meshes = this.highlightInstances(instancePath, true);
    //     for (var i in meshes) {
    //       delete allOtherMeshes[meshes[i]];
    //     }
    //   } else if (G.getSelectionOptions().show_inputs) {
    //     var inputs = this.highlightInstances(true, GEPPETTO.Resources.INPUT);
    //     for (var i in inputs) {
    //       delete allOtherMeshes[inputs[i]];
    //     }
    //   } else if (G.getSelectionOptions().show_outputs) {
    //     var outputs = this.highlightInstances(true, GEPPETTO.Resources.OUTPUT);
    //     for (var o in outputs) {
    //       delete allOtherMeshes[outputs[o]];
    //     }
    //   }
    //   if (G.getSelectionOptions().draw_connection_lines) {
    //     this.showConnectionLines(instancePath, true);
    //   }
    //   if (G.getSelectionOptions().unselected_transparent) {
    //     this.unselectedTransparent(allOtherMeshes, true);
    //   }
    // }
  }

  /**
   * Add mesh to geometry groups
   *
   * @param {String}
   *            instancePath - Path of aspect, corresponds to original merged mesh
   * @param {String}
   *            id - local path to the group
   * @param {object}
   *            groups - The groups that we need to split mesh into
   * @param {object}
   *            m - current mesh
   */
  addMeshToGeometryGroup(instance, id, geometryGroups, m) {
    if (!this.hasInstance(instance)) {
      return;
    }
    // name of group, mix of aspect path and group name
    const groupName = `${instance.getInstancePath()}.${id}`;
    // retrieve corresponding geometry for this group
    const geometry = geometryGroups[groupName];
    // only merge if flag is set to true
    if (m instanceof THREE.Line) {
      geometry.vertices.push(m.geometry.vertices[0]);
      geometry.vertices.push(m.geometry.vertices[1]);
    } else {
      // merged mesh into corresponding geometry
      geometry.merge(m.geometry, m.matrix);
    }
    // eslint-disable-next-line consistent-return
    return true;
  }

  generate3DObjects(instance) {
    const previous3DObject = this.meshes[instance.getInstancePath()];
    let color;
    if (previous3DObject) {
      color = previous3DObject.material.defaultColor;
      // TODO: Remove preivous meshes from scene
      const { splitMeshes } = this;
      for (const m in splitMeshes) {
        if (m.indexOf(instance.getInstancePath()) != -1) {
          // TODO: Remove split meshes from scene
        }
      }
    }

    // TODO: This can be optimised, no need to create both
    const materials = {
      mesh: this.getMeshPhongMaterial(color),
      line: this.getLineMaterial(color),
    };

    const instanceObjects = [];
    const threeDeeObjList = this.walkVisTreeGen3DObjs(instance, materials);
    if (threeDeeObjList.length > 1) {
      const mergedObjs = this.merge3DObjects(threeDeeObjList, materials);
      // investigate need to obj.dispose for obj in threeDeeObjList
      if (mergedObjs != null) {
        mergedObjs.instancePath = instance.getInstancePath();
        instanceObjects.push(mergedObjs);
      } else {
        for (const obj in threeDeeObjList) {
          threeDeeObjList[obj].instancePath = instance.getInstancePath();
          instanceObjects.push(threeDeeObjList[obj]);
        }
      }
    } else if (threeDeeObjList.length == 1) {
      // only one object in list, add it to local array and set
      instanceObjects.push(threeDeeObjList[0]);
      instanceObjects[0].instancePath = instance.getInstancePath();
    }
    return instanceObjects;
  }

  merge3DObjects(objArray, materials) {
    const mergedMeshesPaths = [];
    let ret = null;
    let mergedLines;
    let mergedMeshes;
    objArray.forEach(function (obj) {
      if (obj instanceof THREE.Line) {
        if (mergedLines === undefined) {
          mergedLines = new THREE.Geometry();
        }
        mergedLines.vertices.push(obj.geometry.vertices[0]);
        mergedLines.vertices.push(obj.geometry.vertices[1]);
      } else if (obj.geometry.type == 'Geometry') {
        // This catches both Collada an OBJ
        if (objArray.length > 1) {
          throw Error('Merging of multiple OBJs or Colladas not supported');
        } else {
          ret = obj;
        }
      } else {
        if (mergedMeshes === undefined) {
          mergedMeshes = new THREE.Geometry();
        }
        obj.geometry.dynamic = true;
        obj.geometry.verticesNeedUpdate = true;
        obj.updateMatrix();
        mergedMeshes.merge(obj.geometry, obj.matrix);
      }
      mergedMeshesPaths.push(obj.instancePath);
    });

    if (mergedLines === undefined) {
      /*
       * There are no line geometries, we just create a mesh for the merge of the solid geometries
       * and apply the mesh material
       */
      ret = new THREE.Mesh(mergedMeshes, materials.mesh);
    } else {
      ret = new THREE.LineSegments(mergedLines, materials.line);
      if (mergedMeshes != undefined) {
        // we merge into a single mesh both types of geometries (from lines and 3D objects)
        const tempmesh = new THREE.Mesh(mergedMeshes, materials.mesh);
        ret.geometry.merge(tempmesh.geometry, tempmesh.matrix);
      }
    }

    if (ret != null && !Array.isArray(ret)) {
      ret.mergedMeshesPaths = mergedMeshesPaths;
    }

    return ret;
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
      case GEPPETTO.Resources.COLLADA:
        threeObject = this.loadColladaModelFromNode(node);
        this.complexity++;
        break;
      case GEPPETTO.Resources.OBJ:
        threeObject = this.loadThreeOBJModelFromNode(node);
        this.complexity++;
        break;
    }

    if (threeObject) {
      // TODO: shouldn't that be the vistree? why is it also done at the loadEntity level??
      threeObject.visible = true;
      const instancePath = `${instance.getInstancePath()}.${id}`;
      threeObject.instancePath = instancePath;
      threeObject.highlighted = false;

      this.visualModelMap[instancePath] = threeObject;
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
      map: textureLoader.load('../../../assets/particle.png'),
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

  // TODO: test
  loadColladaModelFromNode(node) {
    const loader = new THREE.ColladaLoader();
    loader.options.convertUpAxis = true;
    let scene = null;
    const that = this;
    loader.parse(node.collada, function (collada) {
      // eslint-disable-next-line prefer-destructuring
      scene = collada.scene;
      scene.traverse(function (child) {
        if (child instanceof THREE.Mesh) {
          child.material.defaultColor = GEPPETTO.Resources.COLORS.DEFAULT;
          child.material.defaultOpacity = GEPPETTO.Resources.OPACITY.DEFAULT;
          child.material.wireframe = that.wireframe;
          child.material.opacity = GEPPETTO.Resources.OPACITY.DEFAULT;
          child.geometry.computeVertexNormals();
        }
        if (child instanceof THREE.SkinnedMesh) {
          child.material.skinning = true;
          child.material.defaultColor = GEPPETTO.Resources.COLORS.DEFAULT;
          child.material.defaultOpacity = GEPPETTO.Resources.OPACITY.DEFAULT;
          child.material.wireframe = that.wireframe;
          child.material.opacity = GEPPETTO.Resources.OPACITY.DEFAULT;
          child.geometry.computeVertexNormals();
        }
      });
    });
    return scene;
  }

  loadThreeOBJModelFromNode(node) {
    const manager = new THREE.LoadingManager();
    manager.onProgress = function (item, loaded, total) {
      console.log(item, loaded, total);
    };
    const loader = new THREE.OBJLoader(manager);
    const scene = loader.parse(node.obj, this.particleTexture);
    const that = this;
    scene.traverse(function (child) {
      if (child instanceof THREE.Mesh) {
        that.setThreeColor(
          child.material.color,
          GEPPETTO.Resources.COLORS.DEFAULT
        );
        child.material.wireframe = that.wireframe;
        child.material.defaultColor = GEPPETTO.Resources.COLORS.DEFAULT;
        child.material.defaultOpacity = GEPPETTO.Resources.OPACITY.DEFAULT;
        child.material.opacity = GEPPETTO.Resources.OPACITY.DEFAULT;
        child.geometry.computeVertexNormals();
      }
    });

    return scene;
  }

  setColor(instancePath, color) {
    if (!this.hasInstance(instancePath)) {
      return;
    }
    if (typeof color === 'string') {
      color = color.replace(/0X/i, '#');
    }
    const meshes = this.getRealMeshesForInstancePath(instancePath);
    if (meshes.length > 0) {
      for (let i = 0; i < meshes.length; i++) {
        const mesh = meshes[i];
        if (mesh) {
          const that = this;
          mesh.traverse(function (object) {
            if (Object.prototype.hasOwnProperty.call(object, 'material')) {
              that.setThreeColor(object.material.color, color);
              object.material.defaultColor = color;
            }
          });
        }
      }
    }
  }

  /**
   * Change the default opacity for a given aspect. The opacity set with this command API will be persisted across different workflows, e.g. selection.
   *
   * @param {String}
   *            instancePath - Instance path of aspect to change opacity for
   */
  setOpacity(instancePath, opacity) {
    if (!this.hasInstance(instancePath)) {
      return;
    }
    const mesh = this.meshes[instancePath];
    if (mesh != undefined) {
      mesh.defaultOpacity = opacity;
      if (opacity == 1) {
        mesh.traverse(function (object) {
          if (Object.prototype.hasOwnProperty.call(object, 'material')) {
            object.material.transparent = false;
            object.material.opacity = 1;
            object.material.defaultOpacity = 1;
          }
        });
      } else {
        mesh.traverse(function (object) {
          if (Object.prototype.hasOwnProperty.call(object, 'material')) {
            object.material.transparent = true;
            object.material.opacity = opacity;
            object.material.defaultOpacity = opacity;
          }
        });
      }
    }
  }

  /**
   * Shows a visual group
   * @param visualGroups
   * @param mode
   * @param instances
   */
  showVisualGroups(visualGroups, mode, instances) {
    for (let i = 0; i < instances.length; i++) {
      const instance = instances[i];
      const instancePath = instance.getInstancePath();
      this.merge(instancePath, true);
      if (mode) {
        const mergedMesh = this.meshes[instancePath];
        const map = mergedMesh.mergedMeshesPaths;
        // no mergedMeshesPaths means object hasn't been merged, single object
        if (map != undefined || null) {
          this.splitGroups(instance, visualGroups);
          this.showVisualGroupsRaw(visualGroups, instance, this.splitMeshes);
        } else {
          this.showVisualGroupsRaw(visualGroups, instance, this.meshes);
        }
      }
    }
  }

  /**
   *
   * @param visualGroups
   * @param instance
   * @param meshesContainer
   */
  showVisualGroupsRaw(visualGroups, instance, meshesContainer) {
    const instancePath = instance.getInstancePath();
    for (const g in visualGroups) {
      // retrieve visual group object
      const visualGroup = visualGroups[g];

      // get full group name to access group mesh
      let groupName = g;
      if (groupName.indexOf(instancePath) <= -1) {
        groupName = `${instancePath}.${g}`;
      }

      // get group mesh
      const groupMesh = meshesContainer[groupName];
      groupMesh.visible = true;
      this.setThreeColor(groupMesh.material.color, visualGroup.color);
    }
  }

  /**
   * Merge mesh that was split before
   *
   *            aspectPath - Path to aspect that points to mesh
   * @param instancePath
   * @param visible
   */
  merge(instancePath, visible) {
    // get mesh from map
    const mergedMesh = this.meshes[instancePath];

    // if merged mesh is not visible, turn it on and turn split one off
    if (!mergedMesh.visible) {
      for (const path in this.splitMeshes) {
        // retrieve split mesh that is on the scene
        const splitMesh = this.splitMeshes[path];
        if (splitMesh) {
          if (instancePath == splitMesh.instancePath) {
            splitMesh.visible = false;
          }
        }
      }
      if (visible) {
        // add merged mesh to scene and set flag to true
        mergedMesh.visible = true;
      }
    }
  }

  hasInstance(instance) {
    const instancePath =
      typeof instance == 'string' ? instance : instance.getInstancePath();
    return this.meshes[instancePath] != undefined;
  }

  /**
   * Get Meshes associated to an instance
   *
   * @param {String}
   *            instancePath - Path of the instance
   */
  getRealMeshesForInstancePath(instancePath) {
    const meshes = [];
    if (instancePath in this.splitMeshes) {
      for (const keySplitMeshes in this.splitMeshes) {
        if (keySplitMeshes.startsWith(instancePath)) {
          meshes.push(this.splitMeshes[keySplitMeshes]);
        }
      }
    } else if (instancePath in this.meshes) {
      meshes.push(this.meshes[instancePath]);
    }
    return meshes;
  }
}
