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
    const scene = document.getElementById(`${id}_scene`);

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
  },
});
