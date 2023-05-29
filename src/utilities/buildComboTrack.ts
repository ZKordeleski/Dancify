import { getArtist, getAudioFeatures, getTrack } from "../fixtures/data";
import { Artist, TrackID } from "../types";
import { useCache } from "./useCache";

// NOTE: Currently using useCache here which is not functional. 
// We just want to build a combo track using existing information of track info + audioFeature info
// This could instead be done in the actual gets which build combo tracks as their own item.
// Alternatively, since it's just for sorting, we could have the audioFeature info and the trackInfo passed in.
// It then looks for common trackIDs in each to build it out.

export function buildComboTracks(...trackIDs: TrackID[]) {
    let tracks = useCache(trackIDs, getTrack) || [];

    let comboTracks = tracks.map((track) => {
        if (track) {
            let trackAudioFeatures = useCache([track.id], getAudioFeatures) || [{}];

            // TODO: Add artists for sorting purposes.
            // let trackArtists = useCache(track.artistIDs, getArtist) || [{name: ""}];
    
            return {...track, ...trackAudioFeatures[0]};
        }
    })

    return comboTracks;
}