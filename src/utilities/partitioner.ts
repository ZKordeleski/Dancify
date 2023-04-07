//NOTE: Currently, this removes values outside the range of min and max provided. It would be nice to
//      accumulate those in "outlier" arrays on either side but the condition in the filter
//      would need modified to accommodate outliers below min.
export function partitioner(rawData: number[], min: number, max: number, numberOfPartitions: number): number[][] {
    let partitionedDataset: number[][] = [];
    let partitionSize = (max-min) / numberOfPartitions;
    for (let i=1; i <= numberOfPartitions; i++) {
        let ithPartition = rawData.filter((value) => value > min+(i-1)*partitionSize && value < min+i*partitionSize);
        partitionedDataset.push(ithPartition);
    }

    return partitionedDataset;
}