import React, { Component } from 'react';
import 'aframe';
import 'aframe-template-component';
import 'aframe-layout-component';
import './aframe/interactable';

class ShowcaseGallery extends Component {
  render() {
    return (
      <a-entity id="entity_showcaseGallery" position="-7 -2.5 -3">
        <a-entity
          id="links"
          layout="type: line; margin: 1.5"
          position="-3 -1 -4"
        >
          <a-entity
            class="link"
            geometry="primitive: plane; height: 1; width: 1"
            material="src:#vfb-thumb"
            interactable
          />
          <a-entity
            class="link"
            geometry="primitive: plane; height: 1; width: 1"
            material="src:#auditory_cortex-thumb"
            interactable
          />
        </a-entity>
      </a-entity>
    );
  }
}

ShowcaseGallery.defaultProps = {};

ShowcaseGallery.propTypes = {};

export default ShowcaseGallery;
