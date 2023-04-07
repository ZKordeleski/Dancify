export function percentager(unpercentage: number | undefined, dp?: number) {
    if (unpercentage === undefined) {
        return "Afraid I can't let you do that Star Fox.";
    }
    return Math.floor(unpercentage*100) + "%";

}