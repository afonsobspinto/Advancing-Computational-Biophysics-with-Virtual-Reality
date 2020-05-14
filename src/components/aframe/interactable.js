AFRAME.registerComponent('interactable', {
  init: function () {
    const { el } = this;

    el.addEventListener('mouseenter', function () {
      console.log('mouseenter');
    });

    el.addEventListener('mouseleave', function () {
      console.log('mouseleave');
    });

    el.addEventListener('gripdown', function () {
      console.log('gripdown');
    });

    el.addEventListener('gripup', function () {
      console.log('gripup');
    });

    el.addEventListener('triggerdown', function () {
      console.log('triggerdown');
    });

    el.addEventListener('triggerup', function () {
      console.log('triggerup');
    });
  },
});
