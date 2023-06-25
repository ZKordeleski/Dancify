import { useState } from "react";
import CreatePlaylist from "../CreatePlaylist/CreatePlaylist";
import TrackItem from "../TrackItem/TrackItem";
import { getAudioFeatures, getTrack } from "../fixtures/data";
import { TrackID } from "../types";
import { removeUndefined } from "../utilities/removeUndefined";
import { useCache } from "../utilities/useCache";
import "./PlaylistBuilder.css";
import { Virtuoso } from "react-virtuoso";

interface PlaylistBuilderProps {
  filteredTrackIDs: TrackID[],
  newPlaylistTrackIDs: TrackID[],
  addTrack: (trackID: TrackID, index: number) => void,
  removeTrack: (trackID: TrackID, index: number) => void,
  resetSelections: () => void
}

export function PlaylistBuilder(props: PlaylistBuilderProps) {
  let [showPlaylistForm, setShowPlaylistForm] = useState(false);
  const filteredTracks = removeUndefined(useCache(props.filteredTrackIDs, getTrack));
  let newPlaylistTracks = removeUndefined(useCache(props.newPlaylistTrackIDs, getTrack));

  let sourceTrackTiles: JSX.Element[] = [];
  let newTrackTiles = [];

  if (filteredTracks === undefined) {
    return null;
  }

  if (newPlaylistTracks === undefined) {
    newPlaylistTracks = [];
  }

  // TODO: Prefilter the tracks (removing duplicates) to the virtualized list.
  let virtualizedList = <Virtuoso 
    // totalCount={filteredTracks.length}
    data={filteredTracks}
    itemContent={(i, track) => <TrackItem trackInfo={track} index={i} buttonType={"remove"} addRemoveTrack={props.removeTrack} key={track.id} />}
  />

  for (let i = 0; i < filteredTracks.length; i++) {
    // Consider removing these tracks from the audio features get as well to keep the chart "live".
    if (newPlaylistTracks.includes(filteredTracks[i])) {
      continue;
    }

    let trackUI = <TrackItem  
    trackInfo={filteredTracks[i]} 
    index={i}
    buttonType={"remove"}
    addRemoveTrack={props.removeTrack}
    key={filteredTracks[i].id}
    />;

    sourceTrackTiles.push(trackUI);
  }

  // NOTE: Old manual playlist builder logic for adding tracks one by one.
  // for (let i = 0; i < newPlaylistTracks.length; i++) {
  //   let trackUI = <TrackItem  
  //   trackInfo={newPlaylistTracks[i]} 
  //   index={i}
  //   buttonType={"remove"}
  //   addRemoveTrack={props.removeTrack}
  //   key={newPlaylistTracks[i].id}
  //   />;

  //   newTrackTiles.push(trackUI);
  // }

  let submissionFormOverlay = showPlaylistForm ?       
    <CreatePlaylist trackIDs={filteredTracks.map((track) => track.id)} setShowPlaylistForm={setShowPlaylistForm} resetSelections={props.resetSelections} /> 
    : null;

  return (
    <div className="PlaylistBuilder">
      {submissionFormOverlay}
      <div className="playlists-window">
        <div className="source-playlist-info" >
          <div className="source-playlist playlist-tiles-wrapper">
            {virtualizedList}
          </div>
        </div>
        {/* TODO: The below could be adapted into a "cutting room floor" using the current functionality. */}
        {/* <div className="new-playlist-info">
          <div className="new-playlist playlist-tiles-wrapper">
            {newTrackTiles}
          </div>
        </div> */}
      </div>
      <div className="buttons-wrapper">
        <button className="add-playlist-button" onClick={() => {
              setShowPlaylistForm(!showPlaylistForm);
            }}>save
        </button>
        <button className="reset-button" onClick={() => {
              props.resetSelections();
            }}> reset
        </button>
      </div>
    </div>
  );
}

//TODO: Fix the add playlist to Spotify button (cloud upload icon with spotify note)
//TODO: Add a Chevron-like background to the playlist backgrounds.
//--  --Use the tile color background for the left side and the background color for the right.
//TODO: Use the playlist
//NOTE: CSS Grid? for tiles?