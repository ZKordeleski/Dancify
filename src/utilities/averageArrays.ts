import { AudioFeatures } from "../types";

// TODO: Finish this function and create a new parameter that takes an array of keys that you'd like to average.
export function averageObjectsWithNumericProperties<Type extends {[key: string]: number}>(arrayOfObjects: Type[]) {
    for (let object of arrayOfObjects) {
        let averagedObject = {} as Record<string, number>;
        for (let key in object) {
            averagedObject[key];
            averagedObject[key] += object[key];
        }
    }
}