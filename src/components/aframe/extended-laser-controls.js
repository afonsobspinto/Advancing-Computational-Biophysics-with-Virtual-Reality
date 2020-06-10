import { BRING_CLOSER } from '../Events';

function emitEvent(event, raycaster) {
  if (raycaster.intersectedEls.length > 0) {
    raycaster.intersectedEls[0].emit(event);
  }
}

function emitEventSelected(event, model, detail) {
  const cEvent = new CustomEvent(event, { detail: detail });
  let toModel = true;
  for (const child of model.children) {
    if (child.selected) {
      child.dispatchEvent(cEvent);
      toModel = false;
    }
  }
  if (toModel) {
    model.dispatchEvent(cEvent);
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
      emitEventSelected('gripdown', model, el.id);
    });

    el.addEventListener('gripup', () => {
      emitEventSelected('gripup', model, el.id);
    });

    el.addEventListener('triggerdown', () => {
      emitEvent('triggerdown', raycaster);
    });

    el.addEventListener('triggerup', () => {
      emitEvent('triggerup', raycaster);
    });

    el.addEventListener(BRING_CLOSER, () => {
      emitEventSelected(BRING_CLOSER, model, null);
    });

    el.addEventListener('thumbstickmoved', (evt) => {
      const event = new CustomEvent('thumbstickmoved', { detail: evt.detail });
      camera.dispatchEvent(event);
    });
  },
});
