import React, { Component } from 'react';
import 'aframe';
import 'aframe-template-component';
import 'aframe-layout-component';
import './aframe/menu_interactable';

class ShowcaseGallery extends Component {
  render() {
    return (
      <a-entity
        id="entity_showcaseGallery"
        position="-9 -2.5 -3"
        rotation="0 50 0"
      >
        <a-link position="1.5 1.5 -3.0" image="#auditory_cortex" />
        <a-link position="3.5 1.5 -3.0" image="#vfb" />
      </a-entity>
    );
  }
}

ShowcaseGallery.defaultProps = {};

ShowcaseGallery.propTypes = {};

export default ShowcaseGallery;
