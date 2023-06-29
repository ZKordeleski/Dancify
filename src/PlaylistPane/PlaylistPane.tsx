import LoadingPlaylistItem from "../PlaylistItem/LoadingPlaylistItem";
import PlaylistItem from "../PlaylistItem/PlaylistItem";
import { playlistByID } from "../fixtures/data";
import { Playlist, PlaylistID } from "../types";
import "./PlaylistPane.css";

interface PlaylistPaneProps {
  playlistIDs: (PlaylistID | undefined)[] | undefined,
  selectedPlaylists: Playlist[] | undefined,
  setNewSelection: (selectedPlaylist: Playlist, selected: boolean) => void
  // setPlaylist: (selectedPlaylist: PlaylistInfo | undefined) => void
}

function PlaylistPane(props: PlaylistPaneProps) {
  let selectedPlaylistTiles = [];
  let playlistTiles = [];
  let indexOfSelectedPlaylist: number = 0;

  if (props.playlistIDs === undefined) {
    for (let i = 0; i < 24; i++) {
      playlistTiles.push(<LoadingPlaylistItem />);
    }
  } else {
    for (let playlistID of props.playlistIDs) {
      // NOTE: If the playlistID is undefined, we will get an undefined playlist back as a result.
      let playlist = playlistByID[playlistID!];
      let selected: boolean;
      if (props.selectedPlaylists === undefined) {
        selected = false;
      } else {
        selected = (props.selectedPlaylists.includes(playlist));
        if (selected === true) {
          selectedPlaylistTiles.push(<PlaylistItem playlistInfo={playlist} setNewSelection={props.setNewSelection} selected={selected} key={(playlist.id).toString()} />)
          indexOfSelectedPlaylist++;
        } else {
          playlistTiles.push(<PlaylistItem playlistInfo={playlist} setNewSelection={props.setNewSelection} selected={selected} key={(playlist.id).toString()} />)
        }
      }
    }
  }

  return (
    <div className={`PlaylistPane ${status}`}>
      <h3>Your Music Library</h3>
      <div className="selected-playlists playlists-wrapper">
        {[...selectedPlaylistTiles]}
      </div>
      <div className="unselected-playlists playlists-wrapper">
        {[...playlistTiles]}
      </div>
    </div>
  )
}



export default PlaylistPane