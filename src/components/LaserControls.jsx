import React, { Component } from 'react';
import PropTypes from 'prop-types';

import 'aframe';
import 'aframe-haptics-component';
import './aframe/extended-laser-controls';

class LaserControls extends Component {
  render() {
    const { id } = this.props;
    return (
      <a-entity id={`${id}_entity_hands`}>
        <a-entity
          id={`${id}_leftHand`}
          laser-controls="hand: left"
          line="color: blue"
          raycaster="objects: .collidable; interval:500"
          extended-laser-controls={`id: ${id}`}
          // haptics="events: triggerdown; dur: 500; force: 1.0"
        />
        <a-entity
          id={`${id}_rightHand`}
          laser-controls="hand: right"
          raycaster="objects: .collidable; interval:500"
          line="color: blue"
          extended-laser-controls={`id: ${id}`}
          // haptics="events: triggerdown; dur: 500; force: 1.0"
        />
      </a-entity>
    );
  }
}

LaserControls.propTypes = {
  id: PropTypes.string.isRequired,
};

export default LaserControls;
