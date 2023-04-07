// Creates a random string of given length using alphanumeric characters of both cases.
export function makeRandomString(stringLength: number): string {
    let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let text = "";

    for (let i = 0; i < stringLength; i++){
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }

    return text;
}