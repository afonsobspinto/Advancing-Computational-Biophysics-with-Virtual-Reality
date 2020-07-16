import auditoryCortex from './auditory_cortex.json';
// import vfb from './vfb.json';
// import ca1 from './ca1_pyramidal_cell.json';
// import ca1OutputMapping from './rawRecording_ca1/outputMapping.dat';
import auditoryOutputMapping from './rawRecording_auditory/outputMapping.dat';
// import ca1Results0 from './rawRecording_ca1/results0.dat';
import auditoryResults0 from './rawRecording_auditory/results0.dat';
import auditoryResults1 from './rawRecording_auditory/results1.dat';
import auditoryResults2 from './rawRecording_auditory/results2.dat';
import auditoryResults3 from './rawRecording_auditory/results3.dat';
import auditoryResults4 from './rawRecording_auditory/results4.dat';
import auditoryResults5 from './rawRecording_auditory/results5.dat';

// TODO: Import only the models

const models = [
  {
    name: 'auditory_cortex',
    model: auditoryCortex,
    props: {
      colorMap: {
        'acnet2.baskets_12': '#003398',
        'acnet2.pyramidals_48': '#cb0000',
      },
      position: '-20 18 -80',
    },
    imageID: '#auditory_cortex',
    instances: ['acnet2'],
    color: '#F85333',
    visualGroups: false,
    simulation: {
      outputMapping: auditoryOutputMapping,
      results: [
        auditoryResults0,
        auditoryResults1,
        auditoryResults2,
        auditoryResults3,
        auditoryResults4,
        auditoryResults5,
      ],
      step: 1,
    },
  },
  // {
  //   name: 'ca1_pyramidal_cell',
  //   model: ca1,
  //   props: {
  //     colorMap: {
  //       network_CA1PyramidalCell: '0x009295',
  //     },
  //     position: '5 12 -20',
  //     rotation: '0 0 90',
  //   },
  //   imageID: '#ca1',
  //   instances: ['network_CA1PyramidalCell'],
  //   color: '#48BAEA',
  //   visualGroups: true,
  //   // simulation: {
  //   //   outputMapping: ca1OutputMapping,
  //   //   results: [ca1Results0],
  //   //   step: 1,
  //   // },
  // },
  // {
  //   name: 'vfb',
  //   model: vfb,
  //   props: {
  //     colorMap: {
  //       VFB_00017894: '0x5b5b5b',
  //       VFB_00030622: '0x00ff00',
  //       VFB_00030616: '0xff00ff',
  //       VFB_00030633: '0x0000ff',
  //       VFB_00030840: '0xffd300',
  //       VFB_00030632: '0x0084f6',
  //     },
  //     opacityMap: {
  //       VFB_00017894: 0.4,
  //       VFB_00030622: 0.3,
  //       VFB_00030616: 0.3,
  //       VFB_00030633: 0.3,
  //       VFB_00030840: 0.3,
  //       VFB_00030632: 0.3,
  //     },
  //     position: '-20 2 -50',
  //   },
  //   imageID: '#vfb',
  //   instances: [
  //     'VFB_00017894',
  //     'VFB_00030624',
  //     'VFB_00030622',
  //     'VFB_00030616',
  //     'VFB_00030633',
  //     'VFB_00030840',
  //     'VFB_00030632',
  //     'VFB_00030783',
  //     // 'VFB_00030773',
  //     // 'VFB_00025007',
  //     // 'VFB_00101383',
  //   ],
  //   color: '#e0cb49',
  //   visualGroups: false,
  //   simulation: null,
  // },
];

export default models;
