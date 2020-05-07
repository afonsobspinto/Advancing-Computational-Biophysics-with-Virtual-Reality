import React, { Component } from 'react';
import Canvas from './3DCanvas/Canvas';
import model from '../models/auditory_cortex.json';

require('../utilities/GeppettoLoader');

export default class App extends Component {
  constructor(props) {
    super(props);
    GEPPETTO.Manager.loadModel(model);
    this.instances = [Instances.getInstance('acnet2')];
    console.log(this.instances);
  }

  render() {
    return (
      <div>{this.instances ? <Canvas instances={this.instances} /> : ''}</div>
    );
  }
}
