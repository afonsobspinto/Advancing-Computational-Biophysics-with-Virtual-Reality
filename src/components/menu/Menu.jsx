import React, { Component } from 'react';
import PropTypes from 'prop-types';
import 'aframe';
import 'aframe-template-component';
import 'aframe-layout-component';
import 'aframe-slice9-component';

import '../aframe/menu-interactable';

class Menu extends Component {
  render() {
    const { buttons, menuTitle, id } = this.props;

    const buttonsMap = [];

    let yPos = 0;
    for (const b of buttons) {
      buttonsMap.push({
        ...b,
        position: `0 ${yPos} 0.01`,
      });
      yPos -= 0.5;
    }

    return (
      <a-entity id="entity_menu" position="4 1.6 -3" rotation="0 0 0">
        <a-entity
          id="menuBackground"
          mixin="slice"
          slice9="height: 5; width: 2; color: #171717"
        />

        <a-entity
          id="title"
          text={`value: ${menuTitle}; color: #FAFAFA; width: 4; align: center`}
          position="0 1.2 0.01"
        />

        {buttonsMap.map((button) => (
          <a-entity
            key={button.evtDetail}
            class="collidable"
            mixin="button"
            text={`value: ${button.text}; color: ${button.color}`}
            position={button.position}
            slice9="width: 1.3; height: 0.3; color: #030303"
            menu-interactable={`id: ${id}; event: ${button.event}; evtDetail: ${button.evtDetail}`}
          />
        ))}
      </a-entity>
    );
  }
}

Menu.defaultProps = {};

Menu.propTypes = {
  id: PropTypes.string.isRequired,
  buttons: PropTypes.array.isRequired,
  menuTitle: PropTypes.string.isRequired,
};

export default Menu;
