import { useState } from "react";
import { getAudioFeatures, postNewPlaylist } from "../fixtures/data";
import { TrackID } from "../types";
import './CreatePlaylist.css'
import MetricAssessment from "../MetricAssessment/MetricAssessment";
import { useCache } from "../utilities/useCache";
import { FilterSettings } from "../PlaylistDetailsPane/PlaylistDetailsPane";

interface CreatePlaylistProps {
    trackIDs: TrackID[],
    setShowPlaylistForm: (state: boolean) => void,
    resetSelections: () => void
}


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

function CreatePlaylist(props: CreatePlaylistProps) {   
    //TODO: We want Dancify to rerender the playlist pane afterwards.
    //TODO: Figure out why "form submission canceled because the form is not connected" happens but form completes successfully.
    //TODO: The cancel button currently disables the PlaylistPane for some reason...

    const [playlistName, setPlaylistName] = useState('');
    const [playlistDescription, setPlaylistDescription] = useState('');
    const [isPlaylistPrivate, setIsPlaylistPrivate] = useState(false);
    let [filterSettings, setFilterSettings] = useState(defaultFilterSettings);
    let newPlaylistAudioFeatures = useCache(props.trackIDs, getAudioFeatures);

    let createPlaylistUI = (
    <div className="CreatePlaylist" >
        <div className="overlay-background" />
        <div className="submission-window">
            <div className="new-playlist-metrics">
                <MetricAssessment trackIDs={props.trackIDs} audioFeatures={newPlaylistAudioFeatures} filterSettings={filterSettings} setFilterSettings={setFilterSettings}/>
            </div>
            <div className="submission-form-wrapper">
            <div className="add-playlist-form">
                <h2>Before we add your playlist...</h2>
                <form>
                    <div>
                        <label>Playlist Name:</label>
                        <input 
                            type="text"
                            required
                            value={playlistName}
                            onChange={(event) => setPlaylistName(event.target.value)}
                        />
                    </div>
                    <div>
                        <label>Playlist Description:</label>
                        <textarea
                            required
                            value={playlistDescription}
                            onChange={(event) => setPlaylistDescription(event.target.value)}
                        />
                    </div>
                    <div>
                        <label>Private:</label>
                        <input
                            type="checkbox"
                            checked={isPlaylistPrivate}
                            onChange={() => setIsPlaylistPrivate(!isPlaylistPrivate)}
                        />
                    </div>
                </form>
                <div className="buttons-wrapper">
                        <button type="button" onClick={async () => {
                            await postNewPlaylist(playlistName, !isPlaylistPrivate, playlistDescription, props.trackIDs);
                            props.setShowPlaylistForm(false);
                            props.resetSelections();
                            }}>
                            Create Playlist
                        </button>
                        <button type="button" onClick={() => props.setShowPlaylistForm(false)}>Cancel</button>
                    </div>
            </div>
            <div className="submission-form-tracks-preview">
                {}
                </div>
            </div>
        </div>
    </div>);

    return createPlaylistUI;
}

export default CreatePlaylist;