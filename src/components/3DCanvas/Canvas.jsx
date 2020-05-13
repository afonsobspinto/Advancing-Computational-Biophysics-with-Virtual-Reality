import React, { Component } from 'react';
import PropTypes from 'prop-types';
import GeppettoThree from './GeppettoThree';
import 'aframe';

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
    this.setEntityMeshes();
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

    return (
      <a-scene background="color: #000000">
        <a-entity
          position="0 0 0"
          camera
          look-controls
          cursor="rayOrigin: mouse"
          raycaster="objects: .collidable"
          wasd-controls
        />
        <a-entity id="entity_canvas" position="0 1 -5">
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
};

Canvas.propTypes = {
  instances: PropTypes.arrayOf(PropTypes.object).isRequired,
  threshold: PropTypes.number,
};

export default Canvas;
