AFRAME.registerComponent('three-js-object', {
  init: function () {
    console.log(this.el);
    console.log(this.data);
    const box = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({
      color: '#00FF00',
    });
    this.el.setObject3D('mesh', new THREE.Mesh(box, material));
  },
  remove: function () {
    this.el.removeObject3D('mesh');
  },
});
