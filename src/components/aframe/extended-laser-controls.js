function emitEvent(event, raycaster) {
  if (raycaster.intersectedEls.length > 0) {
    raycaster.intersectedEls[0].emit(event);
  }
}

AFRAME.registerComponent('extended-laser-controls', {
  schema: {
    cameraID: { type: 'string' },
  },
  init: function () {
    const { el } = this;
    const { raycaster } = this.el.components;
    const { cameraID } = this.data;

    this.camera = document.getElementById(cameraID);

    el.addEventListener('gripdown', () => {
      emitEvent('gripdown', raycaster);
    });

    el.addEventListener('gripup', () => {
      emitEvent('gripup', raycaster);
    });

    el.addEventListener('triggerdown', () => {
      emitEvent('triggerdown', raycaster);
    });

    el.addEventListener('triggerup', () => {
      emitEvent('triggerup', raycaster);
    });

    el.addEventListener('thumbstickmoved', (evt) => {
      const event = new CustomEvent('thumbstickmoved', { detail: evt.detail });
      this.camera.dispatchEvent(event);
    });
  },
});
