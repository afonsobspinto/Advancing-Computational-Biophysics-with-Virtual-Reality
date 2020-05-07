import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ThreeDEngine from './ThreeDEngine';
import 'aframe';
import '../aframe/three-js-object';

class Canvas extends Component {
  constructor(props) {
    super(props);
    this.engine = null;
    this.threeObjects = [];
  }

  componentDidMount() {
    const { threshold, instances } = this.props;
    const scene = document.querySelector('a-scene');
    this.engine = new ThreeDEngine(scene, threshold);
    this.threeObjects = this.engine.getThreeObjects(instances);
  }

  render() {
    return (
      <a-scene>
        {this.threeObjects.map((object, i) => (
          // eslint-disable-next-line react/no-array-index-key
          <a-entity key={i} three-js-object={JSON.stringify(object)} />
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
