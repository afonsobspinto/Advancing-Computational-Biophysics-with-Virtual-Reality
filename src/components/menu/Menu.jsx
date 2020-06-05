import React, { Component } from 'react';
import PropTypes from 'prop-types';
import 'aframe';
import 'aframe-template-component';
import 'aframe-layout-component';
import 'aframe-slice9-component';
import '../aframe/menu-interactable';
import { BACK_MENU } from '../Events';

class Menu extends Component {
  render() {
    const { buttons, menuTitle, id, back } = this.props;

    const buttonsMap = [];

    const shrink = buttons.length > 6;
    let yPos = shrink ? 1.4 : 0;
    for (const b of buttons) {
      buttonsMap.push({
        ...b,
        position: `0 ${yPos} 0.01`,
        width: b.text.length > 20 ? 1.9 : 1.3,
      });
      yPos -= shrink ? 0.4 : 0.5;
    }

    const titleYPos = shrink ? 1.8 : 1.2;

    // TODO: Add collapse, button controller to bring back?
    const arrowButton = back ? (
      <a-triangle
        color="#FFF"
        class="collidable"
        mixin="button"
        position="-0.8 2.15 0.02"
        rotation="0 0 90"
        scale="0.15 0.15 0.15"
        menu-interactable={`id: ${id}; event: ${BACK_MENU}; evtDetail: ${null}`}
      />
    ) : null;

    return (
      <a-entity id="entity_menu" position="4 1.6 -3" rotation="0 0 0">
        <a-entity
          id="menuBackground"
          mixin="slice"
          slice9="height: 5; width: 2; color: #171717"
        />

        {arrowButton}

        <a-entity
          id="title"
          text={`value: ${menuTitle}; color: #FAFAFA; width: 4; align: center`}
          position={`0 ${titleYPos} 0.01`}
        />

        {buttonsMap.map((button) => (
          <a-entity
            key={button.evtDetail}
            class="collidable"
            mixin="button"
            text={`value: ${button.text}; color: ${button.color}`}
            position={button.position}
            slice9={`width: ${button.width}; height: 0.3; color: #030303`}
            menu-interactable={`id: ${id}; event: ${button.event}; evtDetail: ${button.evtDetail}`}
          />
        ))}
      </a-entity>
    );
  }
}

Menu.defaultProps = {
  back: false,
};

Menu.propTypes = {
  id: PropTypes.string.isRequired,
  buttons: PropTypes.array.isRequired,
  menuTitle: PropTypes.string.isRequired,
  back: PropTypes.bool,
};

export default Menu;
