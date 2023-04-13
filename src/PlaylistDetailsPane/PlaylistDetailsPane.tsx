import { useState } from "react"
import { getAudioFeatures } from "../fixtures/data"
import MetricAssessment from "../MetricAssessment/MetricAssessment"
import "../MetricAssessment/MetricAssessment.css"
import { PlaylistBuilder } from "../PlaylistBuilder/PlaylistBuilder"
import { AudioFeatures, TrackID } from "../types"
import { removeUndefined } from "../utilities/removeUndefined"
import { useCache } from "../utilities/useCache"
import "./PlaylistDetailsPane.css"
import { MoodSelector } from "../MoodSelector/MoodSelector"

interface PlaylistDetailsPaneProps {
  trackIDs: (TrackID | undefined)[] | undefined,
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
  key_signature: [min: number, max: number],
  tempo: [min: number, max: number],
  time_signature: [min: number, max: number],
  duration_ms: [min: number, max: number]
}

export let defaultFilterSettings: FilterSettings = {
  danceability: [0,1],
  energy: [0,1],
  valence: [0,1],
  instrumentalness: [0,1],
  loudness: [-1000, 1000],
  key_signature: [-1,11],
  tempo: [0,1000],
  time_signature: [3,7],
  duration_ms: [0,2000000]
}

//NOTE: This component is a holdover from a prior version of the app. It can be removed in future iterations with a refactoring.
function PlaylistDetailsPane(props: PlaylistDetailsPaneProps) {
  if (props.trackIDs === undefined || props.trackIDs.length === 0) {
    return null;
  }

  let uniqueSelectedPlaylistTrackIDs = props.trackIDs.filter((trackID, i, selectedPlaylistsTrackIDs) => {
    return selectedPlaylistsTrackIDs.indexOf(trackID) === i;
  });

  let [filterSettings, setFilterSettings] = useState(defaultFilterSettings);

  let definedTrackIDs = removeUndefined(uniqueSelectedPlaylistTrackIDs);

  let sourceAudioFeatures = useCache(definedTrackIDs || [], getAudioFeatures);

  let filteredTrackIDs: TrackID[] = [];

  // TODO: Filter settings will be updated with presets.
  // -- -- Need to make range sliders adjust positioning, though. Probably connect their state to filters.
  // -- -- This would involve passing filter settings to range sliders to read their min / max.
  // -- -- Not sure how passing this would affect their own states? Something to consider.
  function updateFilterSettings(updatedSettings: Partial<FilterSettings>) {
    setFilterSettings({...defaultFilterSettings, ...updatedSettings})
  }

  // Computes the total danceability, energy, and valence of the playlist for averaging later.
  if (sourceAudioFeatures !== undefined && definedTrackIDs !== undefined) {
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
      <MoodSelector setFilterPreset={updateFilterSettings} />
      <MetricAssessment trackIDs={uniqueSelectedPlaylistTrackIDs} audioFeatures={sourceAudioFeatures} filterSettings={filterSettings} setFilterSettings={setFilterSettings}/>
      {/* <button onClick={() => setDisplayDetails(!displayDetails)}>Show Details</button> */}
      <PlaylistBuilder filteredTrackIDs={filteredTrackIDs} newPlaylistTrackIDs={props.newPlaylistTrackIDs} addTrack={props.addTrack} removeTrack={props.removeTrack} resetSelections={props.resetSelections}/>
    </div>
  );
}

export default PlaylistDetailsPane;