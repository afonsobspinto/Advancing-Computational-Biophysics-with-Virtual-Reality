function clicked(target, detail) {
  const event = new CustomEvent('mesh_click', { detail: detail });
  target.dispatchEvent(event);
}

AFRAME.registerComponent('interactable', {
  schema: {
    id: { type: 'string' },
  },
  init: function () {
    const { el } = this;
    const { id } = this.data;
    this.scene = document.getElementById(id);

    el.addEventListener('mouseenter', () => {
      const event = new CustomEvent('mesh_hover', { detail: el });
      this.scene.dispatchEvent(event);
    });

    el.addEventListener('mouseleave', () => {
      const event = new CustomEvent('mesh_hover_leave', { detail: el });
      this.scene.dispatchEvent(event);
    });

    el.addEventListener('gripdown', () => {
      console.log('gripdown');
    });

    el.addEventListener('triggerdown', () => {
      clicked(this.scene, el);
    });

    el.addEventListener('click', () => {
      clicked(this.scene, el);
    });
  },
});
