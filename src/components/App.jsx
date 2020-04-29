import React, { Component } from 'react';
import 'aframe';
import 'aframe-log-component';
import './aframe/three-js-object';
import './aframe/intersect-color-change';

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
        />
        <a-entity
          id="rightHand"
          laser-controls="hand: right"
          raycaster="objects: .collidable"
          line="color: blue"
        />
        <a-entity
          class="collidable"
          three-js-object="color: green"
          position="0 1 -5"
          intersect-color-change
        />
      </a-scene>
    );
  }
}
