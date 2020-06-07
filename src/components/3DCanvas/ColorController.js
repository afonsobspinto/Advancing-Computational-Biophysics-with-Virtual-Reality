export default class ColorController {
  constructor(engine) {
    this.engine = engine;
    this.litUpInstances = [];
  }

  /**
   * Modulates the color of an instance given a color function.
   * The color function should receive the value of the watched node and output [r,g,b].
   *
   * @param {Instance} instance - The instance to be lit
   * @param {Instance} modulation - Variable which modulates the color
   * @param {Function} colorfn - Converts time-series value to [r,g,b]
   */
  addColorFunction(instances, colorfn) {
    // Check if instance is instance + visualObjects or instance (hhcell.hhpop[0].soma or hhcell.hhpop[0])
    for (let i = 0; i < instances.length; ++i) {
      this.litUpInstances.push(instances[i]);
    }
    const compositeToLit = {};
    const visualObjectsToLit = {};
    const variables = {};
    let currentCompositePath;

    for (let j = 0; j < instances.length; j++) {
      let composite;
      let multicompartment = false;

      composite = instances[j].getParent();

      while (
        composite.getMetaType() !=
        GEPPETTO.Resources.ARRAY_ELEMENT_INSTANCE_NODE
      ) {
        if (composite.getParent() == null) {
          // eslint-disable-next-line no-throw-literal
          throw 'Unsupported model to use this function';
        } else {
          composite = composite.getParent();
          multicompartment = true;
        }
      }

      currentCompositePath = composite.getInstancePath();
      if (
        !Object.prototype.hasOwnProperty.call(
          compositeToLit,
          currentCompositePath
        )
      ) {
        compositeToLit[currentCompositePath] = composite;
        visualObjectsToLit[currentCompositePath] = [];
        variables[currentCompositePath] = [];
      }

      if (multicompartment) {
        for (let k = 0; k < composite.getChildren().length; ++k) {
          const id = composite.getChildren()[k].getId();
          if (visualObjectsToLit[currentCompositePath].indexOf(id) < 0) {
            visualObjectsToLit[currentCompositePath].push(id);
          }
        }
      }
      variables[currentCompositePath].push(instances[j]);
    }

    for (const l in Object.keys(compositeToLit)) {
      const path = Object.keys(compositeToLit)[l];
      this.addColorFunctionBulk(
        compositeToLit[path],
        visualObjectsToLit[path],
        variables[path],
        colorfn
      );
    }
  }

  /**
   * Modulates the color of an aspect visualization, given a watched node
   * and a color function. The color function should receive
   * the value of the watched node and output [r,g,b].
   *
   * @param {Instance} instance - The instance to be lit
   * @param {Instance} modulation - Variable which modulates the color
   * @param {Function} colorfn - Converts time-series value to [r,g,b]
   */
  addColorFunctionBulk(
    instance,
    visualObjects
    // stateVariableInstances,
    // colorfn
  ) {
    const modulations = [];
    if (visualObjects != null) {
      if (visualObjects.length > 0) {
        const elements = {};
        for (const voIndex in visualObjects) {
          elements[visualObjects[voIndex]] = '';
          const path = `${instance.getInstancePath()}.${
            visualObjects[voIndex]
          }`;
          if (modulations.indexOf(path) < 0) {
            modulations.push(path);
          }
        }
        this.engine.splitGroups(instance, elements);
      } else if (modulations.indexOf(instance.getInstancePath()) < 0) {
        modulations.push(instance.getInstancePath());
      }
    }

    // const matchedMap = [];
    // modulations.map(function (e, i) {
    //   matchedMap[e] = stateVariableInstances[i];
    // });

    // for (const index in matchedMap) {
    //   this.litUpInstances.push(matchedMap[index]);
    //   this.addColorListener(index, matchedMap[index], colorfn);
    // }

    // // update flag
    // this.colorFunctionSet = true;
  }

  /**
   * Light up the entity
   *
   * @param {Instance}
   *            instance - the instance to be lit
   * @param {Float}
   *            intensity - the lighting intensity from 0 (no illumination) to 1 (full illumination)
   */
  colorInstance(instance, colorfn, intensity) {
    let threeObject;
    if (
      instance in this.engine.meshes &&
      this.engine.meshes[instance].visible
    ) {
      threeObject = this.engine.meshes[instance];
    } else {
      threeObject = this.engine.splitMeshes[instance];
    }

    const [r, g, b] = colorfn(intensity);
    if (threeObject != undefined) {
      threeObject.material.color.setRGB(r, g, b);
    }
  }
}
