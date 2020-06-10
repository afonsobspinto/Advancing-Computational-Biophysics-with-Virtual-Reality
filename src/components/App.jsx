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
    this.instances = [];
    selectedModel.instances.forEach((instance) =>
      this.instances.push(Instances.getInstance(instance))
    );
    this.handleModelChange = this.handleModelChange.bind(this);
    this.canvasRef = React.createRef();
  }

  handleModelChange(newModel) {
    for (const model of models) {
      if (model.name === newModel) {
        GEPPETTO.ModelFactory = null;
        // eslint-disable-next-line global-require
        require('@geppettoengine/geppetto-client/js/geppettoModel/ModelFactory').default(
          GEPPETTO
        );
        GEPPETTO.Manager.loadModel(model.model);
        this.instances = [];
        model.instances.forEach((instance) =>
          this.instances.push(Instances.getInstance(instance))
        );
        this.setState({
          selectedModel: model,
        });
      }
    }
  }

  render() {
    const { selectedModel } = this.state;
    const {
      sceneBackground,
      colorMap,
      opacityMap,
      position,
      rotation,
    } = selectedModel.props;

    return (
      <div
        ref={this.canvasRef}
        id="CanvasContainer"
        style={{ position: 'absolute', height: '100%', width: '100%' }}
      >
        <ErrorBoundary>
          {this.instances ? (
            <Canvas
              id="canvas1"
              model={selectedModel.name}
              instances={this.instances}
              colorMap={colorMap}
              opacityMap={opacityMap}
              position={position}
              rotation={rotation}
              sceneBackground={sceneBackground}
              handleModelChange={this.handleModelChange}
            />
          ) : (
            ''
          )}
        </ErrorBoundary>
      </div>
    );
  }
}
