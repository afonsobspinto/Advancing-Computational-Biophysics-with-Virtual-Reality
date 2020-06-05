AFRAME.registerComponent('scroll-movement', {
  schema: {
    acceleration: { default: 2 },
  },
  init: function () {
    const { el, nextData } = this;
    const { acceleration } = nextData;

    window.addEventListener('wheel', (evt) => {
      let movement = acceleration;
      if (evt.deltaY > 0) {
        movement *= 1;
      } else if (evt.deltaY < 0) {
        movement *= -1;
      }
      const lastPos = el.object3D.position;
      el.object3D.position.set(lastPos.x, lastPos.y, lastPos.z + movement);
    });
  },
});
