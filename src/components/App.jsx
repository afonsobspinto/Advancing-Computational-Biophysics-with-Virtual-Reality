import React, { Component } from 'react';
import 'aframe';
import 'super-hands';
import 'aframe-event-set-component';
import './events/ChangeColorOnGrab';

export default class App extends Component {
  render() {
    return (
      <a-scene background="color: #FAFAFA">
        <a-assets>
          <a-mixin
            id="pointer"
            raycaster="showLine: true; objects: .cube"
            super-hands="colliderEvent: raycaster-intersection;
                               colliderEventProperty: els;
                               colliderEndEvent:raycaster-intersection-cleared;
                               colliderEndEventProperty: clearedEls;"
          />
          <a-mixin
            id="controller-right"
            mixin="pointer"
            vive-controls="hand: right"
            oculus-touch-controls="hand: right"
            windows-motion-controls="hand: right"
            gearvr-controls
            daydream-controls
            oculus-go-controls
          />
          <a-mixin
            id="controller-left"
            mixin="pointer"
            vive-controls="hand: left"
            oculus-touch-controls="hand: left"
            windows-motion-controls="hand: left"
          />
          <a-mixin
            id="cube"
            geometry="primitive: box; width: 0.5; height: 0.5; depth: 0.5"
            hoverable
            grabbable
            stretchable
            event-set__hoveron="_event: hover-start; material.opacity: 0.7; transparent: true"
            event-set__hoveroff="_event: hover-end; material.opacity: 1; transparent: false"
            change-color-on-grab="color: black"
          />
        </a-assets>
        <a-entity>
          <a-entity id="rhand" mixin="controller-right" />
          <a-entity id="lhand" mixin="controller-left" />
        </a-entity>
        <a-entity
          class="cube"
          mixin="cube"
          position="0 1.6 -1.5"
          material="color: red"
        />
        <a-entity
          class="cube"
          mixin="cube"
          position="-1 1.6 -1"
          material="color: blue"
        />
        <a-entity
          class="cube"
          mixin="cube"
          position="1 1.6 -1"
          material="color: green"
        />
      </a-scene>
    );
  }
}
