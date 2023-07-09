import Meter from "../Meter/Meter";
import { FilterSettings } from "../PlaylistDetailsPane/PlaylistDetailsPane";
import RangeSlider from "../RangeSlider/RangeSlider";
import { getAudioFeatures, getTrack } from "../fixtures/data";
import { AudioFeatures, TrackID } from "../types";
import { makeBarChart } from '../utilities/makeBarChart';
import { makeFrequencyDistribution } from '../utilities/makeFrequencyDistribution';
import { removeUndefined } from "../utilities/removeUndefined";
import { useCache } from "../utilities/useCache";
import "./MetricAssessment.css";

interface MetricAssessmentProps {
  trackIDs: (TrackID | undefined)[] | undefined,
  sourceAudioFeatures: (AudioFeatures | undefined)[] | undefined,
  filterSettings: FilterSettings,
  setFilterSettings: (filterSettings: FilterSettings) => void
}

function MetricAssessment(props: MetricAssessmentProps) {
  let definedTrackIDs = removeUndefined(props.trackIDs);
  let filteredTracks = useCache(definedTrackIDs || [], getTrack) || [];
  let filteredAudioFeatures = useCache(definedTrackIDs || [], getAudioFeatures) || [];

  // ------------------------------------
  // Metric Calculations (New Playlist)
  // ------------------------------------

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
    },
  }

  let playlistArtists = new Set();

  for (let track of filteredTracks) {
    if (track === undefined) {
      continue
    }

    // DURATION
    playlistMetrics.duration.total += track.durationMS;

    // ARTISTS
    track.artistIDs.forEach((artistID) => {
      if (artistID !== undefined) {
        playlistArtists.add(artistID);
      }
    })
  }

  for (let audioFeatures of filteredAudioFeatures) {
    if (audioFeatures) {
      playlistMetrics.danceability.total += audioFeatures.danceability;
      playlistMetrics.energy.total += audioFeatures.energy;
      playlistMetrics.valence.total += audioFeatures.valence;
    }
  }

  playlistMetrics.danceability.average = (playlistMetrics.danceability.total / filteredAudioFeatures.length) || 0;
  playlistMetrics.energy.average = (playlistMetrics.energy.total / filteredAudioFeatures.length) || 0;
  playlistMetrics.valence.average = (playlistMetrics.valence.total / filteredAudioFeatures.length) || 0;

  // ------------------------------------
  // Chart Creation (Source Playlist(s))
  // ------------------------------------
  let energyDataset = [];
  let valenceDataset = [];
  let danceabilityDataset = [];

  // Computes the total danceability, energy, and valence of the playlist for averaging later.
  if (props.sourceAudioFeatures !== undefined && definedTrackIDs !== undefined) {
    for (let audioFeatures of props.sourceAudioFeatures) {
      if (audioFeatures === undefined) {
        continue
      }
      
      // Danceability Computations
      danceabilityDataset.push(audioFeatures.danceability);

      // Energy Computations
      energyDataset.push(audioFeatures.energy);

      // Valence Computations
      valenceDataset.push(audioFeatures.valence);
    }
  }
  
  // Danceability Chart and Filter
  let danceabilityFrequencyDistribution = makeFrequencyDistribution(danceabilityDataset);
  let danceabilityChart = makeBarChart("Danceability Distribution", danceabilityFrequencyDistribution, '#FCA18E', Math.max(...danceabilityFrequencyDistribution), "Danceability");

  // Energy Chart and Filter
  let energyFrequencyDistribution = makeFrequencyDistribution(energyDataset);
  let energyChart = makeBarChart("Energy Distribution", energyFrequencyDistribution, '#8EFCA1', Math.max(...energyFrequencyDistribution), "Energy");

  // Valence Chart and Filter
  let valenceFrequencyDistribution = makeFrequencyDistribution(valenceDataset);
  let valenceChart = makeBarChart("Valence Distribution", valenceFrequencyDistribution, '#A18EFC', Math.max(...valenceFrequencyDistribution), "Happiness");

  function boundSetter(min: number, max: number, key: string): void {
    props.setFilterSettings({...props.filterSettings, [key]: [min, max]});
  }


  return (
    <div className="MetricAssessment">
      <div className="charts">
        <div className="histogram-filter">
          <div className="chart-wrapper">
            {energyChart}
          </div>
          <RangeSlider min={0} max={1} step={.025} filterRange={props.filterSettings.energy} setBounds={boundSetter} name={"energy"} color={'#8EFCA1'} />
        </div>
        <div className="histogram-filter">
          <div className="chart-wrapper">
            {valenceChart}
          </div>
          <RangeSlider min={0} max={1} step={.025} filterRange={props.filterSettings.valence} setBounds={boundSetter} name={'valence'} color={'#A18EFC'} />
        </div>
        <div className="histogram-filter">
          <div className="chart-wrapper">
            {danceabilityChart}
          </div>
          <RangeSlider min={0} max={1} step={.025} filterRange={props.filterSettings.danceability} setBounds={boundSetter} name={'danceability'} color={'#FCA18E'} />
        </div>
      </div>
      <div className="metrics">
        <div className="averages playlist-stats">
          <Meter name={"Average Energy"} value={(100*playlistMetrics.energy.average).toPrecision(2)+ "%"} />
          <Meter name={"Average Valence"} value={(100*playlistMetrics.valence.average).toPrecision(2)+ "%"} />
          <Meter name={"Average Danceability"} value={(100*playlistMetrics.danceability.average).toPrecision(2) + "%"} />
        </div>
        <div className="playlist-stats">
          <Meter name={"Minutes"} value={(Math.round((playlistMetrics.duration.total/1000)/60))} />
          <Meter name={"Tracks"} value={filteredTracks.length} />
          <Meter name={"Artists"} value={playlistArtists.size} />
        </div>
      </div>
    </div>
  );
}

//TODO: Make conditional for minutes to display hours if passed certain threshold.
export default MetricAssessment;