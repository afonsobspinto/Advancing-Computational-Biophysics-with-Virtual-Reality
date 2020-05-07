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
      AFRAME.log('extended-laser-controls:gripdown');
      emitEvent('gripdown', raycaster);
    });

    el.addEventListener('gripup', function () {
      AFRAME.log('extended-laser-controls:gripup');
      emitEvent('gripup', raycaster);
    });

    el.addEventListener('triggerdown', function () {
      AFRAME.log('extended-laser-controls:triggerdown');
      emitEvent('triggerdown', raycaster);
    });

    el.addEventListener('triggerup', function () {
      AFRAME.log('extended-laser-controls:triggerup');
      emitEvent('triggerup', raycaster);
    });

    el.addEventListener('thumbupstart', function (evt) {
      AFRAME.log('extended-laser-controls:thumbupstart');
    });
    el.addEventListener('thumbupend', function (evt) {
      AFRAME.log('extended-laser-controls:thumbupend');
    });
  },
  tick: function (t, dt) {},
});
