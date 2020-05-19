function clicked(target, detail) {
  const event = new CustomEvent('model_changed', { detail: detail });
  target.dispatchEvent(event);
}

AFRAME.registerComponent('menu_interactable', {
  init: function () {
    const { el } = this;
    // TODO: Manage multiple instances
    const canvasContainers = document.getElementsByClassName('CanvasContainer');
    this.canvasContainer = canvasContainers[0];

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

    el.addEventListener('triggerdown', () => {
      console.log('triggerdown');
      clicked(this.canvasContainer, el.title);
    });

    el.addEventListener('click', () => {
      console.log('click');
      clicked(this.canvasContainer, el.title);
    });

    el.addEventListener('triggerup', function () {
      console.log('triggerup');
    });
  },
});
