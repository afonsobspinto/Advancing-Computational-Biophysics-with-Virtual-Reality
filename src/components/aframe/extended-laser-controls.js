function emitEvent(event, raycaster) {
  if (raycaster.intersectedEls.length > 0) {
    raycaster.intersectedEls[0].emit(event);
  }
}

AFRAME.registerComponent('extended-laser-controls', {
  init: function () {
    const { el } = this;
    const { raycaster } = this.el.components;

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

    el.addEventListener('thumbstickmoved', () => {
      emitEvent('thumbstickmoved', raycaster);
    });
  },
});
