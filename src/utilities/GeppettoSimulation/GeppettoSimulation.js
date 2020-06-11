export function getSimulationData(simulation) {
  const { outputMapping, results } = simulation;

  const simulationMap = {};
  const columns = outputMapping.split('\n')[1].split(' ');
  const lines = results[0].split('\n');
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

export function getVoltageColor(x) {
  x = (x + 0.07) / 0.1; // normalization
  if (x < 0) {
    x = 0;
  }
  if (x > 1) {
    x = 1;
  }
  if (x < 0.25) {
    return [0, x * 4, 1];
  }
  if (x < 0.5) {
    return [0, 1, 1 - (x - 0.25) * 4];
  }
  if (x < 0.75) {
    return [(x - 0.5) * 4, 1, 0];
  }
  return [1, 1 - (x - 0.75) * 4, 0];
}
