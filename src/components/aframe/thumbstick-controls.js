const MAX_DELTA = 0.2;
const CLAMP_VELOCITY = 0.00001;

function isEmptyObject(keys) {
  let key;
  for (key in keys) {
    return false;
  }
  return true;
}

AFRAME.registerComponent('thumbstick-controls', {
  schema: {
    acceleration: { default: 5 },
    adAxis: { default: 'x', oneOf: ['x', 'y', 'z'] },
    wsAxis: { default: 'z', oneOf: ['x', 'y', 'z'] },
    fly: { default: true },
  },
  init: function () {
    const { el } = this;
    this.thumbstick = { x: 0, y: 0 };
    this.easing = 1.1;
    this.velocity = new THREE.Vector3();
    el.addEventListener('thumbstickmoved', (evt) => {
      this.thumbstick = evt.detail;
    });
  },
  tick: function (time, delta) {
    const { el } = this;
    const { nextData, thumbstick } = this;
    const { adAxis, wsAxis } = nextData;

    if (
      !this.velocity[adAxis] &&
      !this.velocity[wsAxis] &&
      isEmptyObject(thumbstick)
    ) {
      return;
    }
    // Update velocity.
    const deltaSec = delta / 1000;
    this.updateVelocity(deltaSec);

    if (!this.velocity[adAxis] && !this.velocity[wsAxis]) {
      return;
    }

    const movementVector = this.getMovementVector(delta);
    el.object3D.position.add(movementVector);
  },

  updateVelocity: function (delta) {
    const { nextData, thumbstick } = this;
    const { adAxis, wsAxis, acceleration } = nextData;

    // If FPS too low, reset velocity.
    if (delta > MAX_DELTA) {
      this.velocity[adAxis] = 0;
      this.velocity[wsAxis] = 0;
      return;
    }

    // https://gamedev.stackexchange.com/questions/151383/frame-rate-independant-movement-with-acceleration
    // eslint-disable-next-line no-restricted-properties
    const scaledEasing = Math.pow(1 / this.easing, delta * 60);
    // Velocity Easing.
    if (this.velocity[adAxis] !== 0) {
      this.velocity[adAxis] -= this.velocity[adAxis] * scaledEasing;
    }
    if (this.velocity[wsAxis] !== 0) {
      this.velocity[wsAxis] -= this.velocity[wsAxis] * scaledEasing;
    }

    // Clamp velocity easing.
    if (Math.abs(this, this.velocity[adAxis]) < CLAMP_VELOCITY) {
      this.velocity[adAxis] = 0;
    }
    if (Math.abs(this.velocity[wsAxis]) < CLAMP_VELOCITY) {
      this.velocity[wsAxis] = 0;
    }

    this.velocity[adAxis] -= thumbstick.x * acceleration * delta * -1;
    this.velocity[wsAxis] -= thumbstick.y * acceleration * delta * -1;
  },
  getMovementVector: (function () {
    const directionVector = new THREE.Vector3(0, 0, 0);
    const rotationEuler = new THREE.Euler(0, 0, 0, 'YXZ');

    return function (delta) {
      const rotation = this.el.getAttribute('rotation');
      const { velocity } = this;

      directionVector.copy(velocity);
      directionVector.multiplyScalar(delta);

      // Absolute.
      if (!rotation) {
        return directionVector;
      }

      const xRotation = this.nextData.fly ? rotation.x : 0;

      // Transform direction relative to heading.
      rotationEuler.set(
        THREE.Math.degToRad(xRotation),
        THREE.Math.degToRad(rotation.y),
        0
      );
      directionVector.applyEuler(rotationEuler);
      return directionVector;
    };
  })(),
});
