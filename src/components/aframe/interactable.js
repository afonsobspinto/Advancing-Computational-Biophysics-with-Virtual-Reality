function clicked(target, detail) {
  const event = new CustomEvent('mesh_click', { detail: detail });
  target.dispatchEvent(event);
}

AFRAME.registerComponent('interactable', {
  schema: {
    id: { type: 'string' },
    revesed: { default: true },
  },
  init: function () {
    const { el } = this;
    const { id } = this.data;
    const scene = document.getElementById(`${id}_scene`);
    this.rhand = false;
    this.lhand = false;
    this.oldPos = { rhand: null, lhand: null };
    this.baseRotation = {
      rhand: { x: 0, y: 0, z: 0 },
      lhand: { x: 0, y: 0, z: 0 },
    };
    this.previousHandRotation = {
      rhand: { x: 0, y: 0, z: 0 },
      lhand: { x: 0, y: 0, z: 0 },
    };

    el.addEventListener('mouseenter', () => {
      const event = new CustomEvent('mesh_hover', { detail: el });
      scene.dispatchEvent(event);
    });

    el.addEventListener('mouseleave', () => {
      const event = new CustomEvent('mesh_hover_leave', { detail: el });
      scene.dispatchEvent(event);
    });

    el.addEventListener('triggerdown', () => {
      clicked(scene, el);
    });

    el.addEventListener('click', () => {
      clicked(scene, el);
    });

    el.addEventListener('gripdown', (evt) => {
      if (evt.detail === `${id}_rightHand`) {
        this.rhand = document.getElementById(evt.detail);
        this.baseRotation.rhand = el.object3D.rotation;
        this.previousHandRotation.rhand = { ...this.rhand.object3D.rotation };
      } else if (evt.detail === `${id}_leftHand`) {
        this.lhand = document.getElementById(evt.detail);
        this.baseRotation.lhand = el.object3D.rotation;
        this.previousHandRotation.lhand = { ...this.lhand.object3D.rotation };
      }
    });

    el.addEventListener('gripup', (evt) => {
      if (evt.detail === `${id}_rightHand`) {
        this.rhand = null;
      } else if (evt.detail === `${id}_leftHand`) {
        this.lhand = null;
      }
    });
  },
  tick: function () {
    const { el } = this;
    const { revesed } = this.data;

    if (this.rhand && this.lhand) {
      if (this.oldPos.rhand && this.oldPos.lhand) {
        if (this.isExpanding()) {
          el.object3D.scale.addScalar(0.001);
        } else {
          el.object3D.scale.addScalar(-0.001);
        }
      }
      this.oldPos.rhand = { ...this.rhand.object3D.position };
      this.oldPos.lhand = { ...this.lhand.object3D.position };
    } else if (this.rhand) {
      let rotate = {
        // eslint-disable-next-line no-underscore-dangle
        x: this.rhand.object3D.rotation.x - this.previousHandRotation.rhand._x,
        // eslint-disable-next-line no-underscore-dangle
        y: this.rhand.object3D.rotation.y - this.previousHandRotation.rhand._y,
        // z: this.rhand.object3D.rotation.z - this.previousHandRotation._z,
      };
      if (revesed) {
        rotate = {
          x: rotate.x * -1,
          y: rotate.y * -1,
          z: rotate.z * -1,
        };
      }
      el.object3D.rotation.x = this.baseRotation.rhand.x + rotate.x;
      el.object3D.rotation.y = this.baseRotation.rhand.y + rotate.y;
      this.previousHandRotation.rhand = { ...this.rhand.object3D.rotation };
    } else if (this.lhand) {
      let rotate = {
        // eslint-disable-next-line no-underscore-dangle
        x: this.lhand.object3D.rotation.x - this.previousHandRotation.lhand._x,
        // eslint-disable-next-line no-underscore-dangle
        y: this.lhand.object3D.rotation.y - this.previousHandRotation.lhand._y,
        // z: this.rhand.object3D.rotation.z - this.previousHandRotation._z,
      };
      if (revesed) {
        rotate = {
          x: rotate.x * -1,
          y: rotate.y * -1,
          z: rotate.z * -1,
        };
      }
      el.object3D.rotation.x = this.baseRotation.lhand.x + rotate.x;
      el.object3D.rotation.y = this.baseRotation.lhand.y + rotate.y;
      this.previousHandRotation.lhand = { ...this.lhand.object3D.rotation };
    }
  },

  isExpanding() {
    console.log(this.rhand.object3D.position.x - this.oldPos.rhand.x);
    console.log(this.lhand.object3D.position.x - this.oldPos.lhand.x);
    const rightXGrowing =
      this.rhand.object3D.position.x - this.oldPos.rhand.x >= 0;
    const leftXDecreasing =
      this.lhand.object3D.position.x - this.oldPos.lhand.x <= 0;
    return rightXGrowing && leftXDecreasing;
  },
});
