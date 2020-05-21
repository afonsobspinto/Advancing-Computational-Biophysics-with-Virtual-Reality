/* eslint-disable no-template-curly-in-string */
/* eslint-disable import/no-unresolved */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Instance from '@geppettoengine/geppetto-client/js/geppettoModel/model/Instance';
import ArrayInstance from '@geppettoengine/geppetto-client/js/geppettoModel/model/ArrayInstance';
import Type from '@geppettoengine/geppetto-client/js/geppettoModel/model/Type';
import Variable from '@geppettoengine/geppetto-client/js/geppettoModel/model/Variable';
import 'aframe';
import GeppettoThree from './GeppettoThree';
import ShowcaseGallery from '../ShowcaseGallery';
import LaserControls from '../LaserControls';
import VFB from '../../../assets/showcase-gallery/vfb.png';
import AuditoryCortex from '../../../assets/showcase-gallery/auditory_cortex.png';
import '../aframe/interactable';

const HOVER_COLOR = { r: 0.67, g: 0.84, b: 0.9 };
const SELECTED_COLOR = { r: 1, g: 1, b: 0 };

class Canvas extends Component {
  constructor(props) {
    super(props);
    const { threshold } = this.props;
    this.geppettoThree = new GeppettoThree(threshold);
    this.canvasRef = React.createRef();
    this.sceneRef = React.createRef();
    this.handleHover = this.handleHover.bind(this);
    this.handleHoverLeave = this.handleHoverLeave.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.selectedMeshs = {};
    this.lastHover = null;
  }

  componentDidMount() {
    this.sceneRef.current.addEventListener('mesh_hover', this.handleHover);
    this.sceneRef.current.addEventListener(
      'mesh_hover_leave',
      this.handleHoverLeave
    );
    this.sceneRef.current.addEventListener('mesh_click', this.handleClick);

    const { colorMap } = this.props;
    if (colorMap !== {}) {
      for (const path in colorMap) {
        this.setColor(path, colorMap[path]);
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

  setEntityMeshes() {
    const canvasEntity = this.canvasRef.current;

    const sceneMeshes = [];
    const keysThreeMeshes = Object.keys(this.threeMeshes);
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

  handleHover(evt) {
    const { handleHover } = this.props;
    this.lastHover = {
      ...evt.detail.getObject3D('mesh').material.color,
    };
    evt.detail
      .getObject3D('mesh')
      .material.color.setRGB(HOVER_COLOR.r, HOVER_COLOR.g, HOVER_COLOR.b);
    handleHover(evt, false);
  }

  handleHoverLeave(evt) {
    const { handleHoverLeave } = this.props;
    evt.detail
      .getObject3D('mesh')
      .material.color.setRGB(
        this.lastHover.r,
        this.lastHover.g,
        this.lastHover.b
      );
    this.lastHover = null;
    handleHoverLeave(evt, false);
  }

  handleClick(evt) {
    const { handleClick } = this.props;
    if (Object.keys(this.selectedMeshs).includes(evt.detail.id)) {
      const color = this.selectedMeshs[evt.detail.id];
      evt.detail.getObject3D('mesh').material.color.set(color);
      delete this.selectedMeshs[evt.detail.id];
      this.lastHover = {
        ...evt.detail.getObject3D('mesh').material.color,
      };
      handleClick(evt, true);
    } else {
      const meshCopy = evt.detail.getObject3D('mesh').material.defaultColor;
      this.selectedMeshs[evt.detail.id] = meshCopy;

      evt.detail
        .getObject3D('mesh')
        .material.color.setRGB(
          SELECTED_COLOR.r,
          SELECTED_COLOR.g,
          SELECTED_COLOR.b
        );

      this.lastHover = {
        ...evt.detail.getObject3D('mesh').material.color,
      };
      handleClick(evt, false);
    }
  }

  render() {
    const { sceneBackground, model, instances } = this.props;
    this.threeMeshes = this.geppettoThree.getThreeMeshes(instances);

    return (
      <a-scene class="scene" ref={this.sceneRef} background={sceneBackground}>
        <a-assets>
          <img id="vfb" src={VFB} alt="vfb thumbnail" />
          <img
            id="auditory_cortex"
            src={AuditoryCortex}
            alt="auditory cortex thumbnail"
          />
        </a-assets>
        <a-entity
          position="0 0 0"
          camera
          look-controls
          cursor="rayOrigin: mouse"
          raycaster="objects: .collidable"
          wasd-controls
        />
        <ShowcaseGallery model={model} />
        <LaserControls />
        <a-entity
          ref={this.canvasRef}
          position="-20 -20 -80"
          scale="0.1, 0.1 0.1"
        >
          {Object.keys(this.threeMeshes).map((key) => (
            // eslint-disable-next-line react/no-array-index-key
            <a-entity
              class="collidable"
              key={`a-entity${key}`}
              id={`a-entity${key}`}
              interactable
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
  sceneBackground: 'color: #ECECEC',
  handleHover: () => {},
  handleClick: () => {},
  handleHoverLeave: () => {},
};

Canvas.propTypes = {
  instances: PropTypes.arrayOf(PropTypes.object).isRequired,
  model: PropTypes.string.isRequired,
  threshold: PropTypes.number,
  colorMap: PropTypes.object,
  sceneBackground: PropTypes.string,
  handleHover: PropTypes.func,
  handleClick: PropTypes.func,
  handleHoverLeave: PropTypes.func,
};

export default Canvas;
