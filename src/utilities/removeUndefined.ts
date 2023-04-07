export function removeUndefined<ArrayElement>(array: undefined | (ArrayElement | undefined)[]): ArrayElement[]  {
    let definedArray = [];
    for (let element of array || []) {
        if (element !== undefined) {
            definedArray.push(element);
        }
    }

    return definedArray;
}