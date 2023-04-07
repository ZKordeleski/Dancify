export function generateURLWithSearchParams(url: string, params: Record<string, string>): string {
    const urlObject = new URL(url);
    // NOTE: What's happening here?
    urlObject.search = new URLSearchParams(params).toString();

    const urlWithSearchParams = urlObject.toString();

    return urlWithSearchParams;
}