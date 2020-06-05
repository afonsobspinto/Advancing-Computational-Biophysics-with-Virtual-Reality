function clicked(target, event, detail) {
  const evt = new CustomEvent(event, { detail: detail });
  target.dispatchEvent(evt);
}

AFRAME.registerComponent('menu-interactable', {
  schema: {
    id: { type: 'string' },
    event: { type: 'string' },
    evt_detail: { type: 'string' },
  },
  init: function () {
    const { el } = this;
    // eslint-disable-next-line camelcase
    const { id, event, evt_detail } = this.data;
    this.scene = document.getElementById(`${id}_scene`);

    el.addEventListener('triggerdown', () => {
      clicked(this.scene, event, evt_detail);
    });

    el.addEventListener('click', () => {
      clicked(this.scene, event, evt_detail);
    });
  },

  // TODO: Remove event listeners
});
