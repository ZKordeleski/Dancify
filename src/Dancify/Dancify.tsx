import { useState } from "react"
import "../fixtures/data"
import { currentUser, exchangeCodeForToken, getCurrentUserPlaylists, getPlaylistTracks, getUserInfo, playlistByID, playlistsByUserID, token } from "../fixtures/data"
import Login from "../Login/login"
import PlaylistDetailsPane from "../PlaylistDetailsPane/PlaylistDetailsPane"
import PlaylistPane from "../PlaylistPane/PlaylistPane"
import { Playlist, TrackID } from "../types"
import { useCache } from "../utilities/useCache"
import "./Dancify.css"
import { Virtuoso } from "react-virtuoso"

if (location.href.includes("?code=")) {
  exchangeCodeForToken();
}

//TODO: Filter out local tracks from playlists so audio feature requests don't bug.
// See more here: https://developer.spotify.com/documentation/general/guides/local-files-spotify-playlists/
//TODO: Rethink how playlists are fetched. Currently, memoize fetch for currentUserPlaylists won't ever fetch new playlists as they're made.
function Dancify() {
  let userInfo = useCache([currentUser], getUserInfo);
  let playlistIDs = useCache([currentUser], getCurrentUserPlaylists)?.[0];
  let [selectedPlaylists, setSelectedPlaylists] = useState<Playlist[]>([]);
  let [newPlaylist, setNewPlaylist] = useState<TrackID[]>([]);
  let [dancifiedTracks, setDancifiedTracks] = useState<TrackID[]>()
  let selectedPlaylistsTrackIDs = useCache(selectedPlaylists.map((playlist => playlist.id)), getPlaylistTracks)?.flat()
  let uniqueSelectedPlaylistTrackIDs = selectedPlaylistsTrackIDs?.filter((trackID, i, selectedPlaylistsTrackIDs) => {
    return selectedPlaylistsTrackIDs.indexOf(trackID) === i;
  });

  
  function setNewSelection(newSelectedPlaylist: Playlist, selected: boolean) {
    // Adding new playlist, removing existing playlist
    if (selected === false) {
      selectedPlaylists.push(newSelectedPlaylist);
    } else {
      selectedPlaylists = selectedPlaylists.filter((playlist) => playlist !== newSelectedPlaylist);
    }
    setSelectedPlaylists([...selectedPlaylists]);
    setDancifiedTracks(undefined);
  }

  function resetSelections() {
    setSelectedPlaylists([]);
    setDancifiedTracks(undefined);
    setNewPlaylist([]);
    playlistIDs = [];
  }

  function addTrack(trackID: TrackID, index: number) {
    let updatedNewPlaylist = newPlaylist.slice();
    updatedNewPlaylist.push(trackID);
    setNewPlaylist(updatedNewPlaylist);
  }

  function removeTrack(trackID: TrackID, index: number) {
    let updatedNewPlaylist = newPlaylist.slice(0, index).concat(newPlaylist.slice(index+1));
    setNewPlaylist(updatedNewPlaylist);
  }
  
  if (token === undefined) {
    return <Login />
  } else {
    return (
      <div className="Dancify">
        <PlaylistPane playlistIDs={playlistIDs} setNewSelection={setNewSelection} selectedPlaylists={selectedPlaylists} />
        <PlaylistDetailsPane trackIDs={uniqueSelectedPlaylistTrackIDs || []} newPlaylistTrackIDs={newPlaylist} addTrack={addTrack} removeTrack={removeTrack} resetSelections={resetSelections} key={selectedPlaylists?.map((playlist) => playlist.id).toString()} />
        {/* <FunctionSelection selectedPlaylistTrackIDs={selectedPlaylistTrackIDs} setDancifiedTracks={setDancifiedTracks} /> */}
        {/* <PlaylistDetailsPane trackIDs={dancifiedTracks} key={selectedPlaylist?.id + "dancified"}/> */}
      </div>
    )
  }
}

export default Dancify