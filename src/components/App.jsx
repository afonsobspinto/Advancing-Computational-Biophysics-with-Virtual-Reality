import React, { Component } from 'react';
import Canvas from './3DCanvas/Canvas';
import ErrorBoundary from './ErrorBoundary';
import models from '../models/models';
require('../utilities/GeppettoLoader');

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedModel: models[0],
    };
    const { selectedModel } = this.state;
    GEPPETTO.Manager.loadModel(selectedModel.model);
    this.instances = [Instances.getInstance('acnet2')];
  }

  render() {
    const { selectedModel } = this.state;
    const { colorMap } = selectedModel.props;

    return (
      <div style={{ position: 'absolute', height: '100%', width: '100%' }}>
        <ErrorBoundary>
          {this.instances ? (
            <Canvas instances={this.instances} colorMap={colorMap} />
          ) : (
            ''
          )}
        </ErrorBoundary>
      </div>
    );
  }
}
