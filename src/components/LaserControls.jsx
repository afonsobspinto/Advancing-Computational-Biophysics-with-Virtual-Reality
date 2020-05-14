import React, { Component } from 'react';
import 'aframe';
import './aframe/extended-laser-controls';

export default class LaserControls extends Component {
  render() {
    return (
      <a-entity id="entity_hands">
        <a-entity
          id="leftHand"
          laser-controls="hand: left"
          line="color: blue"
          raycaster="objects: .collidable"
          extended-laser-controls
        />
        <a-entity
          id="rightHand"
          laser-controls="hand: right"
          raycaster="objects: .collidable"
          line="color: blue"
          extended-laser-controls
        />
      </a-entity>
    );
  }
}
