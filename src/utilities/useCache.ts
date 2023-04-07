import { useEffect, useState } from "react";

// A cache function which allows you to grab information on an item using its id.
export function useCache<Type>(ids: string[], getType: (id: string) => Promise<Type>): Type[] | undefined {
    
    let [cache, setCache] = useState<Type[] | undefined>(undefined);

    useEffect(() => {
        let cachePromises: Promise<Type>[] = [];
        
        if (ids === undefined) {
            return
        }

        for (let id of ids) {
            cachePromises.push(getType(id));
        }
        let allPromises = Promise.all(cachePromises);
        allPromises.then((result) => {
            setCache(result);
        });
    }, [ids.join()]);
    // NOTE: The ids don't change after the data is loaded so it's not going to reload. What DOES change when data is loaded?
    return cache;
}
