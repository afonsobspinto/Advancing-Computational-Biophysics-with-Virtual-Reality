import React, { Component } from 'react';
import 'aframe';
import 'aframe-log-component';
import './aframe/three-js-object';
import './aframe/interactable';
import './aframe/extended-laser-controls';

export default class App extends Component {
  render() {
    return (
      <a-scene background="color: #FAFAFA">
        <a-log position="-1 2 -2" />

        <a-entity
          position="0 1.6 0"
          camera
          look-controls
          cursor="rayOrigin: mouse"
          raycaster="objects: .collidable"
          wasd-controls
        />
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
        <a-entity
          class="collidable"
          three-js-object
          position="0 1 -5"
          interactable
        />
      </a-scene>
    );
  }
}
