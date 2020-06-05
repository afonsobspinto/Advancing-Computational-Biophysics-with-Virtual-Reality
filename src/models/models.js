import auditoryCortex from './auditory_cortex.json';
import vfb from './vfb.json';
import ca1 from './ca1_pyramidal_cell.json';

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
    name: 'ca1_pyramidal_cell',
    model: ca1,
    props: {
      colorMap: {
        network_CA1PyramidalCell: '0x009295',
      },
      position: '-5 -5 -40',
    },
    imageID: '#ca1',
    instances: ['network_CA1PyramidalCell'],
  },
  {
    name: 'vfb',
    model: vfb,
    props: {
      colorMap: {
        VFB_00017894: '0x5b5b5b',
        VFB_00030622: '0x00ff00',
        VFB_00030616: '0xff00ff',
        VFB_00030633: '0x0000ff',
        VFB_00030840: '0xffd300',
        VFB_00030632: '0x0084f6',
      },
      opacityMap: {
        VFB_00017894: 0.4,
        VFB_00030622: 0.3,
        VFB_00030616: 0.3,
        VFB_00030633: 0.3,
        VFB_00030840: 0.3,
        VFB_00030632: 0.3,
      },
    },
    imageID: '#vfb',
    instances: [
      'VFB_00017894',
      'VFB_00030624',
      'VFB_00030622',
      'VFB_00030616',
      'VFB_00030633',
      'VFB_00030840',
      'VFB_00030632',
      // 'VFB_00030783',
      // 'VFB_00030773',
      // 'VFB_00025007',
      // 'VFB_00101383',
    ],
  },
];

export default models;
