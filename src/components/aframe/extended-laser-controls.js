import { COLLAPSE_MENU } from '../Events';

function emitEvent(event, raycaster) {
  if (raycaster.intersectedEls.length > 0) {
    raycaster.intersectedEls[0].emit(event);
  }
}

AFRAME.registerComponent('extended-laser-controls', {
  schema: {
    id: { type: 'string' },
  },
  init: function () {
    const { el } = this;
    const { raycaster } = this.el.components;
    const { id } = this.data;

    const camera = document.getElementById(`${id}_camera`);
    const model = document.getElementById(`${id}_model`);

    el.addEventListener('gripdown', () => {
      const event = new CustomEvent('gripdown', { detail: el.id });
      emitEvent('gripdown', raycaster);
      model.dispatchEvent(event);
    });

    el.addEventListener('gripup', () => {
      const event = new CustomEvent('gripup', { detail: el.id });
      emitEvent('gripup', raycaster);
      model.dispatchEvent(event);
    });

    el.addEventListener('triggerdown', () => {
      emitEvent('triggerdown', raycaster);
    });

    el.addEventListener('triggerup', () => {
      emitEvent('triggerup', raycaster);
    });

    el.addEventListener('thumbstickmoved', (evt) => {
      const event = new CustomEvent('thumbstickmoved', { detail: evt.detail });
      camera.dispatchEvent(event);
    });
  },
});
