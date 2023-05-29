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

function CreatePlaylist(props: CreatePlaylistProps) {   
    //TODO: We want Dancify to rerender the playlist pane afterwards.
    //TODO: Figure out why "form submission canceled because the form is not connected" happens but form completes successfully.
    //TODO: The cancel button currently disables the PlaylistPane for some reason...

    const [playlistName, setPlaylistName] = useState('');
    const [playlistDescription, setPlaylistDescription] = useState('');
    const [isPlaylistPrivate, setIsPlaylistPrivate] = useState(false);

    let createPlaylistUI = (
    <div className="CreatePlaylist" >
        <div className="overlay-background" />
        <div className="submission-window">
            <div className="submission-form-wrapper">
                <div className="add-playlist-form">
                    <form>
                        <div className="playlist-name-wrapper">
                            <label>Playlist Name:</label>
                            <input 
                                type="text"
                                required
                                value={playlistName}
                                onChange={(event) => setPlaylistName(event.target.value)}
                            />
                        </div>
                        <div className="playlist-description-wrapper">
                            <label>Playlist Description:</label>
                            <input
                                type="text"
                                required
                                value={playlistDescription}
                                onChange={(event) => setPlaylistDescription(event.target.value)}
                            />
                        </div>
                        <div className="private-toggle-wrapper">
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
                            create
                        </button>
                        <button type="button" onClick={() => props.setShowPlaylistForm(false)}>cancel</button>
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