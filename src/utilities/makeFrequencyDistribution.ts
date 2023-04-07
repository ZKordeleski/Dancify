import { partitioner } from "./partitioner";

export function makeFrequencyDistribution(dataset: number[]): number[] {
    let partionedDataset = partitioner(dataset, 0, 1, 50);
    let frequencies = partionedDataset.map((array) => array.length);
    let normalizedFrequencies = frequencies.map((value) => value / frequencies.reduce((partialSum, value) => partialSum + value, 0));

    return normalizedFrequencies;
}