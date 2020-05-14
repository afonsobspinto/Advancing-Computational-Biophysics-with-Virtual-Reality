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

class Canvas extends Component {
  constructor(props) {
    super(props);
    const { threshold, instances } = this.props;
    this.geppettoThree = new GeppettoThree(threshold);
    this.state = {
      threeMeshes: this.geppettoThree.getThreeMeshes(instances),
    };
  }

  componentDidMount() {
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
    const { threeMeshes } = this.state;
    const canvasEntity = document.getElementById('entity_canvas');

    const sceneMeshes = [];
    const keysThreeMeshes = Object.keys(threeMeshes);
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
      const mesh = threeMeshes[meshKey];
      entity.setObject3D('mesh', mesh);
      i++;
    }
  }

  render() {
    const { threeMeshes } = this.state;
    const { sceneBackground } = this.props;

    return (
      <a-scene background={sceneBackground}>
        <a-assets>
          <img id="vfb-thumb" src={VFB} alt="vfb thumbnail" />
          <img
            id="auditory_cortex-thumb"
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
        <ShowcaseGallery position="-5 -5 -5" />
        <LaserControls />
        <a-entity
          id="entity_canvas"
          position="-20 -20 -80"
          scale="0.1, 0.1 0.1"
        >
          {Object.keys(threeMeshes).map((key) => (
            // eslint-disable-next-line react/no-array-index-key
            <a-entity key={`a-entity${key}`} id={`a-entity${key}`} />
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
};

Canvas.propTypes = {
  instances: PropTypes.arrayOf(PropTypes.object).isRequired,
  threshold: PropTypes.number,
  colorMap: PropTypes.object,
  sceneBackground: PropTypes.string,
};

export default Canvas;
