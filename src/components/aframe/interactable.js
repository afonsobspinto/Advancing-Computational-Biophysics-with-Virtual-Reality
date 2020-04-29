AFRAME.registerComponent('interactable', {
  init: function () {
    const { el } = this;
    const threeDObject = el.getObject3D('mesh');

    el.addEventListener('mouseenter', function () {
      AFRAME.log('mouseenter');
      threeDObject.material.color.setHex('0x0000ff');
    });

    el.addEventListener('mouseleave', function () {
      AFRAME.log('mouseleave');
      threeDObject.material.color.setHex('0x00ff00');
    });

    el.addEventListener('gripdown', function () {
      AFRAME.log('gripdown');
      threeDObject.material.color.setHex('0xff0000');
    });

    el.addEventListener('gripup', function () {
      AFRAME.log('gripup');
      threeDObject.material.color.setHex('0x00ff00');
    });

    el.addEventListener('triggerdown', function () {
      AFRAME.log('triggerdown');
      threeDObject.material.color.setHex('0xffa500');
    });

    el.addEventListener('triggerup', function () {
      AFRAME.log('triggerup');
      threeDObject.material.color.setHex('0x00ff00');
    });
  },
  tick: function (t, dt) {},
});
