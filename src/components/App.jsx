import React, { Component } from 'react';
import Canvas from './3DCanvas/Canvas';
import ErrorBoundary from './ErrorBoundary';
import model from '../models/auditory_cortex.json';

require('../utilities/GeppettoLoader');

export default class App extends Component {
  constructor(props) {
    super(props);
    GEPPETTO.Manager.loadModel(model);
    this.instances = [Instances.getInstance('acnet2')];
  }

  render() {
    return (
      <div style={{ position: 'absolute', height: '100%', width: '100%' }}>
        <ErrorBoundary>
          {this.instances ? <Canvas instances={this.instances} /> : ''}
        </ErrorBoundary>
      </div>
    );
  }
}
