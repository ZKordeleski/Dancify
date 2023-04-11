import { useState } from "react"
import { getAudioFeatures } from "../fixtures/data"
import MetricAssessment from "../MetricAssessment/MetricAssessment"
import "../MetricAssessment/MetricAssessment.css"
import { PlaylistBuilder } from "../PlaylistBuilder/PlaylistBuilder"
import { TrackID } from "../types"
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

export interface FilterBoundSetter {
  (filterSettings: FilterSettings, newBound: number): FilterSettings
}

export interface FilterSettings {
  energy: {
    min: number,
    setMin: FilterBoundSetter
    max: number,
    setMax: FilterBoundSetter
  },
  valence: {
    min: number,
    max: number,
    setMin: FilterBoundSetter
    setMax: FilterBoundSetter
  },
  danceability: {
    min: number,
    max: number,
    setMin: FilterBoundSetter,
    setMax: FilterBoundSetter
  }
}

let defaultFilterSettings = {
  danceability: [0,1],
  energy: [0,1],
  valence: [0,1],
  instrumentalness: [0,1],
  loudness: [-1000, 1000],
  key: [-1,0,1,2,3,4,5,6,7,8,9,10,11],
  tempo: [0,1000],
  time_signature: [3,7],
  duration_ms: [0,2000000]
}

//NOTE: This component is a holdover from a prior version of the app. It can be removed in future iterations with a refactoring.
function PlaylistDetailsPane(props: PlaylistDetailsPaneProps) {
  let defaultFilterSettings: FilterSettings = {
    energy: {
      min: 0,
      max: 100,
      setMin: (filterSettings, newMin) => {filterSettings.energy.min = newMin; return filterSettings},
      setMax: (filterSettings, newMax) => {filterSettings.energy.max = newMax; return filterSettings}
    },
    valence: {
      min: 0,
      max: 100,
      setMin: (filterSettings, newMin) => {filterSettings.valence.min = newMin; return filterSettings},
      setMax: (filterSettings, newMax) => {filterSettings.valence.max = newMax; return filterSettings}
    },
    danceability: {
      min: 0,
      max: 100,
      setMin: (filterSettings, newMin) => {filterSettings.danceability.min = newMin; return filterSettings},
      setMax: (filterSettings, newMax) => {filterSettings.danceability.max = newMax; return filterSettings}
    }
  };

  let [filterSettings, setFilterSettings] = useState(defaultFilterSettings);

  let definedTrackIDs = removeUndefined(props.trackIDs);

  let sourceAudioFeatures = useCache(definedTrackIDs, getAudioFeatures);

  let filteredTrackIDs: TrackID[] = [];

  // Computes the total danceability, energy, and valence of the playlist for averaging later.
  if (sourceAudioFeatures !== undefined && definedTrackIDs.length > 0) {
    for (let audioFeatures of sourceAudioFeatures) {
      if (audioFeatures === undefined) {
        continue
      }

      //TODO: Filtering Process needs moved to PlaylistDetailsPane.
      let filterConditions = ((audioFeatures !== undefined) &&
      (audioFeatures.danceability*100 <= filterSettings.danceability.max) &&
      (audioFeatures.danceability*100 >= filterSettings.danceability.min) &&
      (audioFeatures.energy*100 <= filterSettings.energy.max) &&
      (audioFeatures.energy*100 >= filterSettings.energy.min) &&
      (audioFeatures.valence*100 <= filterSettings.valence.max) &&
      (audioFeatures.valence*100>= filterSettings.valence.min));

      if (filterConditions) {
        filteredTrackIDs.push(audioFeatures.id);
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