import * as Seasonality from '../src/insight/workers/seasonality';
import { RowData } from '../../datawizard/transform/src';
function generateSeriesData(size: number, T: number): RowData[] {
  const series: RowData[] = [];
  for (let i = 0; i < size; i++) {
    const value = 100 * Math.cos((2 * Math.PI * i) / T) + Math.round(Math.random() * 5);
    series.push({
      time: i,
      value,
    });
  }
  return series;
}
test('Seasonality Basic', async () => {
  const T = 6;
  const error = 1;
  const data = generateSeriesData(100, T);
  const result = await Seasonality.SeasonalityWorker(data, ['time'], ['value']);
  expect(result).not.toBe(null);
  if (result !== null) {
    expect(result?.significance > 0.9).toBe(true);
    expect(result.description.T % T <= error || result.description.T % T >= T - error);
  }
});
