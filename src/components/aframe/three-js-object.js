AFRAME.registerComponent('three-js-object', {
  schema: {
    color: {
      default: '#000',
    },
  },

  init: function () {
    const box = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({
      color: this.data.color,
    });
    this.el.setObject3D('mesh', new THREE.Mesh(box, material));
  },
  remove: function () {
    this.el.removeObject3D('mesh');
  },
});
