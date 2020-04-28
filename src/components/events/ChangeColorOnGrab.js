export default AFRAME.registerComponent('change-color-on-grab', {
  schema: {
    color: { default: 'black' },
  },

  play: function () {
    const { data, el } = this;
    const defaultColor = el.getAttribute('material').color;

    el.addEventListener('grab-start', function () {
      el.setAttribute('color', data.color);
    });
  },
});
