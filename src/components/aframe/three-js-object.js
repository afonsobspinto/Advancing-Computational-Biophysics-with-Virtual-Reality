AFRAME.registerComponent('three-js-object', {
  schema: {
    threeObject: { type: 'array' },
  },
  init: function () {
    console.log(this.data.threeObject);
    this.el.setObject3D(this.attrName, new THREE.Mesh());
  },
  remove: function () {
    this.el.removeObject3D(this.attrName);
  },
});
