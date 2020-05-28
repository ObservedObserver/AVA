import * as majorityFactors from '../src/insight/workers/majorityFactors';

test('majority basic', async () => {
  const data = [
    { cat: 'A', value: 1000 },
    { cat: 'B', value: 10 },
    { cat: 'C', value: 20 },
    { cat: 'D', value: 55 },
  ];
  const result = await majorityFactors.MajorityWorker(data, ['cat'], ['value']);
  expect(result).not.toBe(null);
  if (result !== null) {
    expect(result.significance > 0.8).toBe(true);
  }
});
