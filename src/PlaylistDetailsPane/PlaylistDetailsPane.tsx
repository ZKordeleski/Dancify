import { useState } from "react"
import { getAudioFeatures } from "../fixtures/data"
import MetricAssessment from "../MetricAssessment/MetricAssessment"
import "../MetricAssessment/MetricAssessment.css"
import { PlaylistBuilder } from "../PlaylistBuilder/PlaylistBuilder"
import { AudioFeatures, TrackID } from "../types"
import { removeUndefined } from "../utilities/removeUndefined"
import { useCache } from "../utilities/useCache"
import "./PlaylistDetailsPane.css"
import { MoodSelector } from "../fixtures/presets"

interface PlaylistDetailsPaneProps {
  trackIDs: (TrackID | undefined)[],
  newPlaylistTrackIDs: TrackID[],
  addTrack: (trackID: TrackID, index: number) => void,
  removeTrack: (trackID: TrackID, index: number) => void,
  resetSelections: () => void
}

// TODO: Redefine this type so it's less ugly using "type" and "[K in keyof AudioFeatures]?: [min: number, max: number]" or similar.
export interface FilterSettings {
  danceability: [min: number, max: number],
  energy: [min: number, max: number],
  valence: [min: number, max: number],
  instrumentalness: [min: number, max: number],
  loudness: [min: number, max: number],
  key: [min: number, max: number],
  tempo: [min: number, max: number],
  time_signature: [min: number, max: number],
  duration_ms: [min: number, max: number]
}

let defaultFilterSettings: FilterSettings = {
  danceability: [0,1],
  energy: [0,1],
  valence: [0,1],
  instrumentalness: [0,1],
  loudness: [-1000, 1000],
  key: [-1,11],
  tempo: [0,1000],
  time_signature: [3,7],
  duration_ms: [0,2000000]
}

//NOTE: This component is a holdover from a prior version of the app. It can be removed in future iterations with a refactoring.
function PlaylistDetailsPane(props: PlaylistDetailsPaneProps) {

  let [filterSettings, setFilterSettings] = useState(defaultFilterSettings);

  let definedTrackIDs = removeUndefined(props.trackIDs);

  let sourceAudioFeatures = useCache(definedTrackIDs, getAudioFeatures);

  let filteredTrackIDs: TrackID[] = [];

  // Computes the total danceability, energy, and valence of the playlist for averaging later.
  if (sourceAudioFeatures !== undefined && definedTrackIDs.length > 0) {
    for (let audioFeatures of sourceAudioFeatures) {
      if (audioFeatures === undefined) {
        continue;
      }

      filteredTrackIDs.push(audioFeatures.id);

      //TODO: Filtering Process needs moved to PlaylistDetailsPane.
      for (let metric in filterSettings) {
        let stupidMetric = metric as keyof FilterSettings;
        if (
          audioFeatures[stupidMetric] >= (filterSettings[stupidMetric])[0] && 
          audioFeatures[stupidMetric] <= (filterSettings[stupidMetric])[1]) {
            continue;
          } else {
            filteredTrackIDs.pop();
            break;
          }
      }
    }
  }

  return (
    <div className="PlaylistDetailsPane Tile">
      <MoodSelector />
      <MetricAssessment trackIDs={props.trackIDs} audioFeatures={sourceAudioFeatures} filterSettings={filterSettings} setFilterSettings={setFilterSettings}/>
      {/* <button onClick={() => setDisplayDetails(!displayDetails)}>Show Details</button> */}
      <PlaylistBuilder filteredTrackIDs={filteredTrackIDs} newPlaylistTrackIDs={props.newPlaylistTrackIDs} addTrack={props.addTrack} removeTrack={props.removeTrack} resetSelections={props.resetSelections}/>
    </div>
  );
}

export default PlaylistDetailsPane;