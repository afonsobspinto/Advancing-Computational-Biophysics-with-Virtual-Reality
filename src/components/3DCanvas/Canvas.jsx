/* eslint-disable no-template-curly-in-string */
/* eslint-disable import/no-unresolved */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Instance from '@geppettoengine/geppetto-client/js/geppettoModel/model/Instance';
import ArrayInstance from '@geppettoengine/geppetto-client/js/geppettoModel/model/ArrayInstance';
import Type from '@geppettoengine/geppetto-client/js/geppettoModel/model/Type';
import Variable from '@geppettoengine/geppetto-client/js/geppettoModel/model/Variable';
import 'aframe';
import 'aframe-environment-component';
import GeppettoThree from './GeppettoThree';
import LaserControls from '../LaserControls';
import VFB from '../../../assets/showcase-gallery/vfb.png';
import CA1 from '../../../assets/showcase-gallery/ca1_cell.png';
import AuditoryCortex from '../../../assets/showcase-gallery/auditory_cortex.png';
import '../aframe/interactable';
import '../aframe/rotatable';
import '../aframe/thumbstick-controls';
import '../aframe/scroll-movement';

const HOVER_COLOR = { r: 0.67, g: 0.84, b: 0.9 };
const SELECTED_COLOR = { r: 1, g: 1, b: 0 };

class Canvas extends Component {
  constructor(props) {
    super(props);
    const { threshold } = this.props;
    this.state = {
      loadedTextures: false,
      visualGroups: false,
    };
    this.geppettoThree = new GeppettoThree(threshold);
    this.canvasRef = React.createRef();
    this.sceneRef = React.createRef();
    this.handleLoadedTextures = this.handleLoadedTextures.bind(this);
    this.handleHover = this.handleHover.bind(this);
    this.handleHoverLeave = this.handleHoverLeave.bind(this);
    this.handleClick = this.handleClick.bind(this);
    // TODO: remove this workaround
    this.showVisualGroups = this.showVisualGroups.bind(this);
    this.threeMeshes = {};
    this.selectedMeshes = {};
    this.hoveredMeshes = {};
    this.geppettoThree.initTextures(this.handleLoadedTextures);
  }

  componentDidMount() {
    this.sceneRef.current.addEventListener('mesh_hover', this.handleHover);
    this.sceneRef.current.addEventListener(
      'mesh_hover_leave',
      this.handleHoverLeave
    );
    this.sceneRef.current.addEventListener('mesh_click', this.handleClick);
    // TODO: remove this workaround
    this.sceneRef.current.addEventListener('visual_groups', (evt) =>
      this.showVisualGroups(
        evt.detail.groups,
        evt.detail.mode,
        evt.detail.instances
      )
    );

    const { colorMap, opacityMap } = this.props;
    if (colorMap !== {}) {
      for (const path in colorMap) {
        this.setColor(path, colorMap[path]);
      }
    }
    if (opacityMap !== {}) {
      for (const path in opacityMap) {
        this.setOpacity(path, opacityMap[path]);
      }
    }
    this.setEntityMeshes();
  }

  shouldComponentUpdate(nextProps) {
    const { instances } = this.props;
    if (instances !== nextProps.instances) {
      this.geppettoThree.init(nextProps.instances);
    }
    return true;
  }

  componentDidUpdate() {
    const { colorMap, opacityMap } = this.props;
    const { visualGroups } = this.state;
    if (!visualGroups) {
      if (colorMap !== {}) {
        for (const path in colorMap) {
          this.setColor(path, colorMap[path]);
        }
      }
      if (opacityMap !== {}) {
        for (const path in opacityMap) {
          this.setOpacity(path, opacityMap[path]);
        }
      }
    }
    this.setEntityMeshes();
  }

  setColor(path, color) {
    // eslint-disable-next-line no-eval
    const entity = eval(path);
    if (entity.hasCapability('VisualCapability')) {
      if (entity instanceof Instance || entity instanceof ArrayInstance) {
        this.geppettoThree.setColor(path, color);

        if (typeof entity.getChildren === 'function') {
          const children = entity.getChildren();
          for (let i = 0; i < children.length; i++) {
            this.setColor(children[i].getInstancePath(), color);
          }
        }
      } else if (entity instanceof Type || entity instanceof Variable) {
        // fetch all instances for the given type or variable and call hide on each
        // TODO: Pass ModelFactory to prop?
        const instances = GEPPETTO.ModelFactory.getAllInstancesOf(entity);
        for (let j = 0; j < instances.length; j++) {
          this.setColor(instances[j].getInstancePath(), color);
        }
      }
    }
    return this;
  }

  /**
   *
   * @param instancePath
   * @param opacity
   * @returns {Canvas}
   */
  setOpacity(instancePath, opacity) {
    // eslint-disable-next-line no-eval
    const entity = eval(instancePath);
    if (entity.hasCapability('VisualCapability')) {
      if (entity instanceof Instance || entity instanceof ArrayInstance) {
        this.geppettoThree.setOpacity(instancePath, opacity);

        if (typeof entity.getChildren === 'function') {
          const children = entity.getChildren();
          for (let i = 0; i < children.length; i++) {
            this.setOpacity(children[i].getInstancePath(), opacity, true);
          }
        }
      } else if (entity instanceof Type || entity instanceof Variable) {
        // fetch all instances for the given type or variable and call hide on each
        const instances = GEPPETTO.ModelFactory.getAllInstancesOf(entity);
        for (let j = 0; j < instances.length; j++) {
          this.setOpacity(instancePath, opacity, true);
        }
      }
    }

    return this;
  }

  setEntityMeshes() {
    const canvasEntity = this.canvasRef.current;

    const sceneMeshes = [];
    const keysThreeMeshes = Object.keys(this.threeMeshes).filter(
      (key) => this.threeMeshes[key].visible
    );
    for (let i = 0; i < canvasEntity.children.length; i++) {
      const element = canvasEntity.children[i];
      if (element.id.startsWith('a-entity')) {
        sceneMeshes.push(element);
      }
    }
    if (sceneMeshes.length !== keysThreeMeshes.length) {
      throw new Error(
        'Meshes do not match. Possible illegal use of a-entity as id.'
      );
    }
    let i = 0;
    for (const meshKey of keysThreeMeshes) {
      const entity = sceneMeshes[i];
      const mesh = this.threeMeshes[meshKey];
      entity.setObject3D('mesh', mesh);
      i++;
    }
  }

  handleLoadedTextures() {
    this.setState({ loadedTextures: true });
  }

  handleHover(evt) {
    const { handleHover } = this.props;
    if (Object.keys(this.hoveredMeshes).includes(evt.detail.id)) {
      return;
    }
    if (evt.detail.getObject3D('mesh').material) {
      this.hoveredMeshes[evt.detail.id] = {
        ...evt.detail.getObject3D('mesh').material.color,
      };
      evt.detail
        .getObject3D('mesh')
        .material.color.setRGB(HOVER_COLOR.r, HOVER_COLOR.g, HOVER_COLOR.b);
      handleHover(evt, false);
    }
  }

  handleHoverLeave(evt) {
    const { handleHoverLeave } = this.props;
    if (Object.keys(this.hoveredMeshes).includes(evt.detail.id)) {
      const color = this.hoveredMeshes[evt.detail.id];
      evt.detail
        .getObject3D('mesh')
        .material.color.setRGB(color.r, color.g, color.b);

      delete this.hoveredMeshes[evt.detail.id];
    }
    handleHoverLeave(evt, false);
  }

  handleClick(evt) {
    const { handleClick } = this.props;
    if (Object.keys(this.selectedMeshes).includes(evt.detail.id)) {
      const color = this.selectedMeshes[evt.detail.id];
      evt.detail.getObject3D('mesh').material.color.set(color);
      delete this.selectedMeshes[evt.detail.id];
      this.hoveredMeshes = {
        ...evt.detail.getObject3D('mesh').material.color,
      };
      handleClick(evt, true);
    } else {
      const meshCopy = evt.detail.getObject3D('mesh').material.defaultColor;
      this.selectedMeshes[evt.detail.id] = meshCopy;

      evt.detail
        .getObject3D('mesh')
        .material.color.setRGB(
          SELECTED_COLOR.r,
          SELECTED_COLOR.g,
          SELECTED_COLOR.b
        );

      this.hoveredMeshes = {
        ...evt.detail.getObject3D('mesh').material.color,
      };
      handleClick(evt, false);
    }
  }

  /**
   * Activates a visual group
   * @param visualGroup
   * @param mode
   * @param instances
   */
  showVisualGroups(visualGroup, mode, instances) {
    this.geppettoThree.showVisualGroups(visualGroup, mode, instances);
    this.setState({
      visualGroups: true,
    });
  }

  render() {
    const {
      sceneBackground,
      model,
      instances,
      id,
      position,
      rotation,
    } = this.props;
    const { loadedTextures } = this.state;
    const sceneID = `${id}_scene`;
    const cameraID = `${id}_camera`;
    const modelID = `${id}_model`;

    if (loadedTextures) {
      this.geppettoThree.init(instances);
      this.threeMeshes = this.geppettoThree.getThreeMeshes(instances);
    }

    return (
      <a-scene
        stats
        id={sceneID}
        ref={this.sceneRef}
        background={sceneBackground}
      >
        <a-assets>
          <img id="vfb" src={VFB} alt="vfb thumbnail" />
          <img id="ca1" src={CA1} alt="ca1 thumbnail" />
          <img
            id="auditory_cortex"
            src={AuditoryCortex}
            alt="auditory cortex thumbnail"
          />
        </a-assets>

        <a-entity environment="preset: default" />

        <a-entity
          id={cameraID}
          position="0 5 0"
          thumbstick-controls
          scroll-movement
        >
          <a-camera
            cursor="rayOrigin: mouse"
            raycaster="objects: .collidable"
            acceleration="200"
          />
          <LaserControls id={id} />
          {/* <ShowcaseGallery model={model} /> */}
        </a-entity>

        <a-entity
          ref={this.canvasRef}
          position={position}
          rotation={rotation}
          scale="0.1, 0.1 0.1"
          id={modelID}
          rotatable={`id: ${id}`}
        >
          {Object.keys(this.threeMeshes)
            .filter((key) => this.threeMeshes[key].visible)
            .map((key) => (
              // eslint-disable-next-line react/no-array-index-key
              <a-entity
                class="collidable"
                key={`a-entity${key}_${id}`}
                id={`a-entity${key}_${id}`}
                interactable={`id: ${id}`}
              />
            ))}
        </a-entity>
      </a-scene>
    );
  }
}

Canvas.defaultProps = {
  threshold: 1000,
  colorMap: {},
  opacityMap: {},
  position: '-20 -20 -80',
  rotation: '0 0 0',
  sceneBackground: 'color: #ECECEC',
  handleHover: () => {},
  handleClick: () => {},
  handleHoverLeave: () => {},
};

Canvas.propTypes = {
  instances: PropTypes.arrayOf(PropTypes.object).isRequired,
  model: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  threshold: PropTypes.number,
  colorMap: PropTypes.object,
  opacityMap: PropTypes.object,
  position: PropTypes.string,
  rotation: PropTypes.string,
  sceneBackground: PropTypes.string,
  handleHover: PropTypes.func,
  handleClick: PropTypes.func,
  handleHoverLeave: PropTypes.func,
};

export default Canvas;
