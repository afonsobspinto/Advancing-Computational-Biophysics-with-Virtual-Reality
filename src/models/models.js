import auditoryCortex from './auditory_cortex.json';
import vfb from './vfb.json';

const models = [
  {
    name: 'auditory_cortex',
    model: auditoryCortex,
    props: {
      colorMap: {
        'acnet2.baskets_12': '#003398',
        'acnet2.pyramidals_48': '#cb0000',
      },
    },
    imageID: '#auditory_cortex',
    instances: ['acnet2'],
  },
  {
    name: 'vfb',
    model: vfb,
    props: {},
    imageID: '#vfb',
    instances: ['VFB_00017894'],
  },
];

export default models;
