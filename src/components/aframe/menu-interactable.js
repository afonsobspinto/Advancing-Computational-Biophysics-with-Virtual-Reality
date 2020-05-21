function clicked(target, detail) {
  const event = new CustomEvent('model_changed', { detail: detail });
  target.dispatchEvent(event);
}

AFRAME.registerComponent('menu-interactable', {
  init: function () {
    const { el } = this;
    this.canvasContainer = document.getElementById('CanvasContainer');

    el.addEventListener('triggerdown', () => {
      clicked(this.canvasContainer, el.title);
    });

    el.addEventListener('click', () => {
      clicked(this.canvasContainer, el.title);
    });
  },
});
