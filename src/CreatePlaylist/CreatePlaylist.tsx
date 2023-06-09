import { useState } from "react";
import { postNewPlaylist } from "../fixtures/data";
import { TrackID } from "../types";
import './CreatePlaylist.css';

interface CreatePlaylistProps {
    trackIDs: TrackID[],
    setShowPlaylistForm: (state: boolean) => void,
    resetSelections: () => void
}

function CreatePlaylist(props: CreatePlaylistProps) {   

    const [playlistName, setPlaylistName] = useState('');
    const [playlistDescription, setPlaylistDescription] = useState('');
    const [isPlaylistPrivate, setIsPlaylistPrivate] = useState(false);

    // NOTE: This could be a nice reuseable component down the road.
    // Simply have an overlay component that accepts children to display and has a display state.
    let createPlaylistUI = (
    <div className="CreatePlaylist" >
        <div className="overlay-background">
            <div className="submission-window">
                <h1>Playlist Info</h1>
                <div className="submission-form-wrapper">
                    <div className="add-playlist-form">
                        <form>
                            <div className="playlist-name-wrapper wrapper">
                                <label>Name</label>
                                <input 
                                    type="text"
                                    required
                                    value={playlistName}
                                    // TODO: Consider tagging playlists with a "Dancify" tag?
                                    onChange={(event) => setPlaylistName(event.target.value)}
                                />
                            </div>
                            <div className="playlist-description-wrapper wrapper">
                                <label>Description</label>
                                <textarea
                                    required
                                    onChange={(event) => setPlaylistDescription(event.target.textContent || "")}>
                                        {playlistDescription}
                                </textarea>
                            </div>
                            <div className="private-toggle-wrapper wrapper">
                                <label>Private</label>
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
                </div>
            </div>
        </div>
    </div>);

    return createPlaylistUI;
}

export default CreatePlaylist;