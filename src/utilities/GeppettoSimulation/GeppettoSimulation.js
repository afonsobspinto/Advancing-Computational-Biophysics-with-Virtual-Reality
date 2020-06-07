import outputMapping from './rawRecording/outputMapping.dat';
import results from './rawRecording/results0.dat';

export default function runSimulation() {
  const simulationMap = {};
  const columns = outputMapping.split('\n')[1].split(' ');
  const lines = results.split('\n');
  for (const l of lines) {
    if (l !== '') {
      const values = l.split('	');
      const time = values[0];
      simulationMap[time] = {};
      for (let j = 1; j < columns.length; j++) {
        const col = columns[j];
        const val = values[j];
        simulationMap[time][col] = val;
      }
    }
  }
  return simulationMap;
}
