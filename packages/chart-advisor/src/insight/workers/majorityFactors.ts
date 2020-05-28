import { IWorker } from '../index';
export const IWorkerName = 'MajorFactors';
/**
 * ### Majority (Major factors)
 * > Finds cases where a majority of a total value can be attributed to a single factor when broken down by another dimension
 * Citation: https://docs.microsoft.com/en-us/power-bi/consumer/end-user-insight-types
 * @param aggData aggregated dataSource
 * @param dimensions dimensions
 * @param measures measures
 */
export const MajorityWorker: IWorker = async (aggData, dimensions, measures) => {
  if (measures.length !== 1) return null;
  let majorityValue = 0;
  let total = 0;
  for (const record of aggData) {
    for (const mea of measures) {
      const value = Math.abs(record[mea]);
      majorityValue = Math.max(value, majorityValue);
      total += value;
    }
  }
  const significance = majorityValue / total;
  return {
    dimensions,
    measures,
    significance,
  };
};
