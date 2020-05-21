import React, { Component } from 'react';
import PropTypes from 'prop-types';
import 'aframe';
import 'aframe-template-component';
import 'aframe-layout-component';
import './aframe/menu-interactable';
import models from '../models/models';

class ShowcaseGallery extends Component {
  render() {
    const { model } = this.props;
    const links = [];

    let xPos = 1.5;
    for (const m of models) {
      if (m.name !== model) {
        links.push({
          title: m.name,
          position: `${xPos} 1.5 -3.0`,
          image: m.imageID,
        });
        xPos += 2;
      }
    }

    return (
      <a-entity
        id="entity_showcaseGallery"
        position="-9 -2.5 -3"
        rotation="0 50 0"
      >
        {links.map((link) => (
          <a-link
            key={link}
            // FIXME title not changing
            title={link.title}
            // eslint-disable-next-line no-script-url
            href="javascript:void(0)"
            class="collidable"
            position={link.position}
            image={link.image}
            menu-interactable
          />
        ))}
      </a-entity>
    );
  }
}

ShowcaseGallery.defaultProps = {};

ShowcaseGallery.propTypes = {
  model: PropTypes.string.isRequired,
};

export default ShowcaseGallery;
