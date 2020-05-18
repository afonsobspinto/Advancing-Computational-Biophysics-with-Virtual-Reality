function emitEvent(event, raycaster) {
  if (raycaster.intersectedEls.length > 0) {
    raycaster.intersectedEls[0].emit(event);
  }
}

AFRAME.registerComponent('extended-laser-controls', {
  init: function () {
    const { el } = this;
    const { raycaster } = this.el.components;

    el.addEventListener('gripdown', function () {
      emitEvent('gripdown', raycaster);
    });

    el.addEventListener('gripup', function () {
      emitEvent('gripup', raycaster);
    });

    el.addEventListener('triggerdown', function () {
      emitEvent('triggerdown', raycaster);
    });

    el.addEventListener('triggerup', function () {
      emitEvent('triggerup', raycaster);
    });
  },
});
