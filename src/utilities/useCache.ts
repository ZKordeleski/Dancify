import { useEffect, useState } from "react";

// A cache function which allows you to grab information on an item using its id.

export function useCache<Type>(ids: string[], getType: (id: string) => Promise<Type>): Type[] | undefined {
    
    let [cache, setCache] = useState<Type[] | undefined>(undefined);

    let stack: any;
    try {
    throw new Error();
    } catch(err) {
        stack = (err as any).stack;
    }

    useEffect(() => {
        console.log(ids);
        console.log(stack);
        let cachePromises: Promise<Type>[] = [];
        
        if (ids === undefined) {
            return;
        }


        for (let id of ids) {
            cachePromises.push(getType(id).then((result) => {
                // We want to update trigger a rerender when individual items complete loading as a step towards "partial loading" or "streaming" results.
                setCache((oldCache) => {
                    let newCache = (oldCache === undefined) ? [result] : [...oldCache, result];
                    return newCache;
                });
                return result;
            }));
        }

        let allPromises = Promise.all(cachePromises);

        allPromises.then((result) => {
            setCache(result);
        });
    }, [ids.join()]);
    // NOTE: The ids don't change after the data is loaded so it's not going to reload. What DOES change when data is loaded?
    return cache;
}
