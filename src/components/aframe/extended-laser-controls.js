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
      emitEvent('gripdown', raycaster);
      model.emit('gripdown');
    });

    el.addEventListener('gripup', () => {
      emitEvent('gripup', raycaster);
      model.emit('gripup');
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
    el.addEventListener(COLLAPSE_MENU, () => {
      scene.emit(COLLAPSE_MENU);
    });
  },
});
