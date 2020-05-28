import { aggregate } from '@antv/dw-transform';
import { IWorker } from '../index';

export const IWorkerName = 'Seasonality';
interface SeasonalDesc {
  T: number;
}
export const SeasonalityWorker: IWorker = async (aggData, dimensions, measures) => {
  // TODO: multi-measures case;
  if (measures.length > 1) return null;
  let significance = 0;
  const desc: SeasonalDesc = { T: Infinity };
  for (let i = 0; i < dimensions.length; i++) {
    const insightDimension = dimensions[i];
    const seriesData = aggregate(aggData, {
      groupBy: [insightDimension],
      fields: measures,
      as: measures,
      op: measures.map(() => 'sum'),
    });
    seriesData.sort((a, b) => (a[insightDimension] > b[insightDimension] ? 0 : 1));
    // suppose seriesData is sorted.
    const series: number[] = seriesData.map((s) => s[measures[0]] || 0);

    for (let T = 2; T < Math.floor(series.length / 2); T++) {
      const seriesFragments: number[][] = [];
      for (let i = 0; i < series.length; i += T) {
        if (i + T <= series.length) {
          const fragment = series.slice(i, i + T);
          while (fragment.length < T) {
            fragment.push(0);
          }
          seriesFragments.push(fragment);
        }
      }

      const meanFragment = standardize(
        seriesFragments
          .reduce((total, vec) => sumVec(total, vec), new Array(T).fill(0))
          .map((d) => d / seriesFragments.length)
      );
      const sigs = seriesFragments.map((f) => dot(meanFragment, standardize(f)));
      const meanOfSigs = sigs.reduce((total, sig) => total + Math.abs(sig), 0) / sigs.length;
      if (meanOfSigs * 0.95 > significance) {
        desc.T = T;
        significance = meanOfSigs;
      }
    }
  }
  return {
    dimensions,
    measures,
    significance,
    type: IWorkerName,
    description: desc,
  };
};

function sumVec(vec1: number[], vec2: number[]): number[] {
  return vec1.map((v, i) => v + vec2[i]);
}

function standardize(vec: number[]): number[] {
  const sum_2 = vec.reduce((total, val) => total + val ** 2, 0);
  return vec.map((v) => v / Math.sqrt(sum_2));
}

function dot(vec1: number[], vec2: number[]): number {
  let sum = 0;
  for (let i = 0; i < vec1.length; i++) {
    sum += vec1[i] * vec2[i];
  }
  return sum;
}
