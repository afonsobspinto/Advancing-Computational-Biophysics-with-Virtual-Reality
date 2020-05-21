AFRAME.registerComponent('thumbstick-controls', {
  init: function () {
    const { el } = this;

    el.addEventListener('thumbstickmoved', this.logThumbstick);
  },

  logThumbstick: function (evt) {
    console.log(evt.detail);
    if (evt.detail.y > 0.95) {
      console.log('DOWN');
    }
    if (evt.detail.y < -0.95) {
      console.log('UP');
    }
    if (evt.detail.x < -0.95) {
      console.log('LEFT');
    }
    if (evt.detail.x > 0.95) {
      console.log('RIGHT');
    }
  },
});
