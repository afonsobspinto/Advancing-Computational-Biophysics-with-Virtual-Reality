/* eslint-disable no-underscore-dangle */
AFRAME.registerComponent('rotatable', {
  schema: {
    id: { type: 'string' },
    revesed: { default: true },
  },
  init: function () {
    const { el } = this;
    const { id } = this.data;
    this.model = document.getElementById(`${id}_model`);
    this.rhand = document.getElementById(`${id}_rightHand`);
    this.baseRotation = { x: 0, y: 0, z: 0 };
    this.previousHandRotation = { x: 0, y: 0, z: 0 };
    this.isRotating = false;

    el.addEventListener('gripdown', () => {
      this.baseRotation = this.model.object3D.rotation;
      this.previousHandRotation = { ...this.rhand.object3D.rotation };
      this.isRotating = true;
    });

    el.addEventListener('gripup', () => {
      this.isRotating = false;
    });
  },
  // TODO: Add reset button
  tick: function (time, delta) {
    const { el } = this;
    const { revesed } = this.data;
    if (this.isRotating) {
      let rotate = {
        x: this.rhand.object3D.rotation.x - this.previousHandRotation._x,
        y: this.rhand.object3D.rotation.y - this.previousHandRotation._y,
        z: this.rhand.object3D.rotation.z - this.previousHandRotation._z,
      };

      if (revesed) {
        rotate = {
          x: rotate.x * -1,
          y: rotate.y * -1,
          z: rotate.z * -1,
        };
      }
      el.object3D.rotation.x = this.baseRotation.x + rotate.x;
      el.object3D.rotation.y = this.baseRotation.y + rotate.y;
      el.object3D.rotation.z = this.baseRotation.z + rotate.z;
      this.previousHandRotation = { ...this.rhand.object3D.rotation };
    }
  },
});
