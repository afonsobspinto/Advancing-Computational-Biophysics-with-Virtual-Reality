/* eslint-disable import/no-unresolved */
import Manager from '@geppettoengine/geppetto-client/js/common/Manager';
import AA from '@geppettoengine/geppetto-client/js/geppettoModel/model/ArrayElementInstance';
import { rgbToHex } from '../../geppetto-client/geppetto-core/geppetto-js/Utility';

const GEPPETTO = {};
window.GEPPETTO = GEPPETTO;
require('@geppettoengine/geppetto-client/js/common/GEPPETTO.Resources').default(
  GEPPETTO
);
require('@geppettoengine/geppetto-client/js/pages/geppetto/GEPPETTO.Events').default(
  GEPPETTO
);
const ModelFactory = require('@geppettoengine/geppetto-client/js/geppettoModel/ModelFactory').default(
  GEPPETTO
);

GEPPETTO.Utility = {};
GEPPETTO.Utility.extractMethodsFromObject = () => [];
GEPPETTO.Utility.rgbToHex = (r, g, b) => rgbToHex(r, g, b);
GEPPETTO.trigger = (evt) => console.log(evt, 'triggered');
GEPPETTO.Manager = new Manager();
console.warn = () => null;
GEPPETTO.CommandController = {
  log: console.log,
  createTags: (a, b) => null,
};
GEPPETTO.ComponentFactory = {
  addExistingComponent: console.log,
};
GEPPETTO.on = console.log;
GEPPETTO.off = console.log;
GEPPETTO.UnitsController = {
  getUnitLabel: function (unit) {
    return unit;
  },
  hasUnit: function (unit) {
    return true;
  },
};
window.Project = {
  getId: function () {
    return 1936486795;
  },
};
