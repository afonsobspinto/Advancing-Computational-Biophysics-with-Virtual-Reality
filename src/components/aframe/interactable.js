function clicked(target, detail) {
  const event = new CustomEvent('mesh_click', { detail: detail });
  target.dispatchEvent(event);
}

AFRAME.registerComponent('interactable', {
  init: function () {
    const { el } = this;
    // TODO: Manage multiple instances
    const scenes = document.getElementsByClassName('scene');
    this.scene = scenes[0];

    el.addEventListener('mouseenter', () => {
      const event = new CustomEvent('mesh_hover', { detail: el });
      this.scene.dispatchEvent(event);
    });

    el.addEventListener('mouseleave', () => {
      const event = new CustomEvent('mesh_hover_leave', { detail: el });
      this.scene.dispatchEvent(event);
    });

    el.addEventListener('gripdown', function () {
      console.log('gripdown');
    });

    el.addEventListener('gripup', function () {
      console.log('gripup');
    });

    el.addEventListener('triggerdown', function () {
      clicked(this.scene, el);
    });

    el.addEventListener('click', () => {
      clicked(this.scene, el);
    });

    el.addEventListener('triggerup', function () {
      console.log('triggerup');
    });
  },
});
