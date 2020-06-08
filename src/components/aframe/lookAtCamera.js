AFRAME.registerComponent('lookAtCamera', {
  schema: {
    cameraID: { type: 'string' },
  },
  tick: function () {
    const { el } = this;
    const { id } = this.data;
    const camera = document.getElementById(`${id}_camera`);
    el.getObject3D.lookAt(camera.object3D.position);
  },
});
