export interface Timeout {
    promise: Promise<void>
    cancel: () => void
}

export function promiseTimeout(duration = 15): Timeout {
    let timeoutID: number;
    let rejectPromise: (error: Error) => void;
    let promise = new Promise<void>(
        (resolve, reject) => {
            timeoutID = setTimeout(() => {
                resolve();
            }, duration);
            rejectPromise = reject;
        }
    );

    return {
        promise: promise,
        cancel: () => {
            clearTimeout(timeoutID);
            rejectPromise(new Error("Timeout was cancelled by user."));
        }
    };
}