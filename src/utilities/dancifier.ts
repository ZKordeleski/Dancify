import { getAudioFeatures } from "../fixtures/data";
import { Track, TrackID } from "../types";

export async function dancifier(trackIDs: (TrackID)[] | undefined, danceabilityMin: number = .5): Promise<TrackID[]> {
    if (trackIDs === undefined) {
        return [];
    }
    
    let dancifiedTrackIDs: TrackID[] = [];

    let cachePromises = [];
    for (let id of trackIDs) {
        cachePromises.push(getAudioFeatures(id));
    }

    let metricsOfTracks = await Promise.all(cachePromises);

    for (let trackMetrics of metricsOfTracks) {
        if (trackMetrics === undefined) {
            continue
        }

        if (trackMetrics.danceability !== undefined && trackMetrics?.danceability >= danceabilityMin) {
            dancifiedTrackIDs.push(trackMetrics.id);
        }
    }


    return dancifiedTrackIDs;

}