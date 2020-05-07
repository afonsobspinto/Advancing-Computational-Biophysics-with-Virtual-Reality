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
      threeObjects: this.geppettoThree.getThreeObjects(instances),
    };
  }

  componentDidMount() {
    const { threeObjects } = this.state;
    const scene = document.querySelector('a-scene');

    for (let i = 0; i < scene.children.length; i++) {
      const entity = scene.children[i];
      const object = threeObjects[i];
      entity.setObject3D('mesh', object);
    }
  }

  render() {
    const { threeObjects } = this.state;
    return (
      <a-scene>
        {threeObjects.map((i) => (
          // eslint-disable-next-line react/no-array-index-key
          <a-entity key={i}> </a-entity>
        ))}
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
