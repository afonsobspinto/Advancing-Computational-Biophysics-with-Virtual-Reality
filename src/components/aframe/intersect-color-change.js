AFRAME.registerComponent('intersect-color-change', {
  init: function () {
    AFRAME.log('intersect-color-change');
    const { el } = this;
    const threeDObject = el.getObject3D('mesh');
    const { material } = threeDObject;
    const initialColor = material.color.getHex().toString(16);
    const self = this;

    el.addEventListener('mousedown', function (evt) {
      AFRAME.log('mousedown');
      threeDObject.material.color.setHex('#EF2D5E');
    });

    el.addEventListener('mouseup', function () {
      AFRAME.log('mouseup');
      const color = self.isMouseEnter ? '#24CAFF' : initialColor;
      threeDObject.material.color.setHex(color);
    });

    el.addEventListener('mouseenter', function () {
      AFRAME.log('mouseenter');
      threeDObject.material.color.setHex('#24CAFF');
      self.isMouseEnter = true;
    });

    el.addEventListener('mouseleave', function () {
      AFRAME.log('mouseleave');
      threeDObject.material.color.setHex(initialColor);
      self.isMouseEnter = false;
    });
  },
});
