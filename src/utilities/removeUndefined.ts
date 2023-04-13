// TODO: Make it so it maintains the original undefined array if passed in. Only removes undefined elements.
export function removeUndefined<ArrayElement>(array: undefined | (ArrayElement | undefined)[]): ArrayElement[] | undefined  {
    if (array === undefined) {
        return undefined;
    }
    let definedArray = [];
    for (let element of array || []) {
        if (element !== undefined) {
            definedArray.push(element);
        }
    }

    return definedArray;
}