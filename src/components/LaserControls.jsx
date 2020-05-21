import React, { Component } from 'react';
import PropTypes from 'prop-types';

import 'aframe';
import './aframe/extended-laser-controls';

class LaserControls extends Component {
  render() {
    const { id, cameraID } = this.props;
    return (
      <a-entity id={`${id}_entity_hands`}>
        <a-entity
          id={`${id}_leftHand`}
          laser-controls="hand: left"
          line="color: blue"
          raycaster="objects: .collidable"
          extended-laser-controls={`cameraID: ${cameraID}`}
        />
        <a-entity
          id={`${id}_rightHand`}
          laser-controls="hand: right"
          raycaster="objects: .collidable"
          line="color: blue"
          extended-laser-controls={`cameraID: ${cameraID}`}
        />
      </a-entity>
    );
  }
}

LaserControls.propTypes = {
  id: PropTypes.string.isRequired,
  cameraID: PropTypes.string.isRequired,
};

export default LaserControls;
