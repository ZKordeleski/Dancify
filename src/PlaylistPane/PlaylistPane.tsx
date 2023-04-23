import { useState } from "react";
import { playlistByID } from "../fixtures/data";
import PlaylistItem from "../PlaylistItem/PlaylistItem";
import { Playlist, PlaylistID, PlaylistMap } from "../types";
import "./PlaylistPane.css";
import LoadingPlaylistItem from "../PlaylistItem/LoadingPlaylistItem";
import { List } from 'react-virtualized';

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
      {[...selectedPlaylistTiles, ...playlistTiles]}
    </div>
  )
}



export default PlaylistPane