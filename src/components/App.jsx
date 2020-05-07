import React, { Component } from 'react';
import Canvas from './3DCanvas/Canvas';
import model from '../models/vfb.json';

require('../utilities/GeppettoLoader');

export default class App extends Component {
  constructor(props) {
    super(props);
    GEPPETTO.Manager.loadModel(model);
    this.instances = [Instances.getInstance('VFB_00017894.VFB_00017894_obj')];
  }

  render() {
    return (
      <div>{this.instances ? <Canvas instances={this.instances} /> : ''}</div>
    );
  }
}
