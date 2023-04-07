import Meter from "../Meter/Meter";
import { FilterSettings } from "../PlaylistDetailsPane/PlaylistDetailsPane";
import RangeSlider from "../RangeSlider/RangeSlider";
import { getTrack } from "../fixtures/data";
import { AudioFeatures, TrackID } from "../types";
import { makeBarChart } from '../utilities/makeBarChart';
import { makeFrequencyDistribution } from '../utilities/makeFrequencyDistribution';
import { removeUndefined } from "../utilities/removeUndefined";
import { useCache } from "../utilities/useCache";
import "./MetricAssessment.css";

interface MetricAssessmentProps {
  trackIDs: (TrackID | undefined)[] | undefined,
  audioFeatures: (AudioFeatures | undefined)[] | undefined,
  filterSettings: FilterSettings,
  setFilterSettings: (filterSettings: FilterSettings) => void
}

function MetricAssessment(props: MetricAssessmentProps) {
  let definedTrackIDs = removeUndefined(props.trackIDs);
  let trackList = useCache(definedTrackIDs, getTrack) || [];

  let playlistMetrics = {
    danceability: {
      total: 0,
      average: 0
    },
    valence: {
      total: 0,
      average: 0
    },
    energy: {
      total: 0,
      average: 0
    },
    duration: {
      total: 0
    }
  }

  let playlistArtists = new Set();

  // Cleans up the tracks prop, removing undefined elements and creating arrays of track/artist IDs.
  for (let track of trackList) {
    if (track === undefined) {
      continue
    }
    playlistMetrics.duration.total += track.durationMS;
    // NOTE: Currently, an artistID of undefined is still making it through this check FOR EVERY PLAYLIST. Can't figure out where it's coming from.
    track.artistIDs.forEach((artistID) => {
      if (artistID !== undefined) {
        playlistArtists.add(artistID);
      }
    })
  }

  let energyDataset = [];
  let valenceDataset = [];
  let danceabilityDataset = [];

  // Computes the total danceability, energy, and valence of the playlist for averaging later.
  if (props.audioFeatures !== undefined && definedTrackIDs.length > 0) {
    let numberOfTracksWithAudioFeatures: number = 0;
    for (let audioFeatures of props.audioFeatures) {
      if (audioFeatures === undefined) {
        continue
      }
      
      // Danceability Computations
      playlistMetrics.danceability.total += audioFeatures.danceability;
      danceabilityDataset.push(audioFeatures.danceability);

      // Energy Computations
      playlistMetrics.energy.total += audioFeatures.energy;
      energyDataset.push(audioFeatures.energy);

      // Valence Computations
      playlistMetrics.valence.total += audioFeatures.valence;
      valenceDataset.push(audioFeatures.valence);

      // Misc Computations
      numberOfTracksWithAudioFeatures++;
    }

    playlistMetrics.danceability.average = playlistMetrics.danceability.total / numberOfTracksWithAudioFeatures;
    playlistMetrics.energy.average = playlistMetrics.energy.total / numberOfTracksWithAudioFeatures;
    playlistMetrics.valence.average = playlistMetrics.valence.total / numberOfTracksWithAudioFeatures;
  }
  
  // Danceability Chart and Filter
  let danceabilityFrequencyDistribution = makeFrequencyDistribution(danceabilityDataset);
  let danceabilityChart = makeBarChart("Danceability Distribution", danceabilityFrequencyDistribution, '#FCA18E', Math.max(...danceabilityFrequencyDistribution));

  // Energy Chart and Filter
  let energyFrequencyDistribution = makeFrequencyDistribution(energyDataset);
  let energyChart = makeBarChart("Energy Distribution", energyFrequencyDistribution, '#8EFCA1', Math.max(...energyFrequencyDistribution));

  // Valence Chart and Filter
  let valenceFrequencyDistribution = makeFrequencyDistribution(valenceDataset);
  let valenceChart = makeBarChart("Valence Distribution", valenceFrequencyDistribution, '#A18EFC', Math.max(...valenceFrequencyDistribution));


  return (
    <div className="MetricAssessment">
      <div className="charts">
        <div className="histogram-filter">
          <div className="chart-wrapper">
            {energyChart}
          </div>
          <RangeSlider min={0} max={100} step={10} setMin={props.filterSettings.energy.setMin} setMax={props.filterSettings.energy.setMax} filterSettings={props.filterSettings} setFilterSettings={props.setFilterSettings} name={'energy'} color={'#8EFCA1'} />
        </div>
        <div className="histogram-filter">
          <div className="chart-wrapper">
            {valenceChart}
          </div>
          <RangeSlider min={0} max={100} step={10} setMin={props.filterSettings.valence.setMin} setMax={props.filterSettings.valence.setMax} filterSettings={props.filterSettings} setFilterSettings={props.setFilterSettings} name={'valence'} color={'#A18EFC'} />
        </div>
        <div className="histogram-filter">
          <div className="chart-wrapper">
            {danceabilityChart}
          </div>
          <RangeSlider min={0} max={100} step={10} setMin={props.filterSettings.danceability.setMin} setMax={props.filterSettings.danceability.setMax} filterSettings={props.filterSettings} setFilterSettings={props.setFilterSettings} name={'danceability'} color={'#FCA18E'} />
        </div>
      </div>
      <div className="metrics">
        <div className="averages playlist-stats">
          <Meter name={"Energy"} value={playlistMetrics.energy.average} normalized={true} />
          <Meter name={"Valence"} value={playlistMetrics.valence.average} normalized={true} />
          <Meter name={"Danceability"} value={playlistMetrics.danceability.average} normalized={true} />
        </div>
        <div className="playlist-stats">
          <Meter name={"Minutes"} value={(Math.round((playlistMetrics.duration.total/1000)/60))} />
          <Meter name={"Tracks"} value={trackList.length} />
          <Meter name={"Artists"} value={playlistArtists.size} />
        </div>
      </div>
    </div>
  );
}

export default MetricAssessment;