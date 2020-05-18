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
        position="-7 -2.5 -3"
        rotation="0 50 0"
      >
        <a-link
          href="sunrise.html"
          position="0 1.5 -1.0"
          image="#thumbSunrise"
        />
        <a-link
          href="mountains.html"
          position="3.5 1.5 -1.0"
          image="#thumbMountains"
        />
      </a-entity>
    );
  }
}

ShowcaseGallery.defaultProps = {};

ShowcaseGallery.propTypes = {};

export default ShowcaseGallery;
