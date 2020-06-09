/* eslint-disable no-underscore-dangle */
AFRAME.registerComponent('stretchable', {
  schema: {
    id: { type: 'string' },
    revesed: { default: true },
  },
  init: function () {
    const { el } = this;
    const { id } = this.data;
    this.rhand = false;
    this.lhand = false;
    this.oldPos = { rhand: null, lhand: null };

    el.addEventListener('gripdown', (evt) => {
      if (evt.detail === `${id}_rightHand`) {
        this.rhand = document.getElementById(evt.detail);
      } else if (evt.detail === `${id}_leftHand`) {
        this.lhand = document.getElementById(evt.detail);
      }
    });

    el.addEventListener('gripup', (evt) => {
      if (evt.detail === `${id}_rightHand`) {
        this.rhand = null;
      } else if (evt.detail === `${id}_lefttHand`) {
        this.lhand = null;
      }
    });
  },

  tick: function (time, delta) {
    const { el } = this;

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
