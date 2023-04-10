import { Playlist } from "../types";
import "./PlaylistItem.css"

// Types for component to utilize.
interface PlaylistItemProps {
  playlistInfo: Playlist,
  selected: boolean,
  setNewSelection: (selectedPlaylist: Playlist, selected: boolean) => void
}

//TODO: Make selecting a playlist change value of playlist item to selected for CSS purposes?
// FIXME: Something going on with the URL below and the ImageData type.
function PlaylistItem(props: PlaylistItemProps) {
  let status = props.selected ? "Selected" : "";
  let playlistImage = props.playlistInfo.images[0];
  let imageUI;

  if (playlistImage === undefined) {
    imageUI = <div className="PlaylistImage" />
  } else {
    imageUI = <div className="PlaylistImage" style={{backgroundImage: `url("${props.playlistInfo.images[0].url}")`}} />
  }

  return (
  <div className={`PlaylistItem ${status}`} onClick={() => (props.setNewSelection(props.playlistInfo, props.selected))}>
    {imageUI}
    <span className="PlaylistName">{props.playlistInfo.name}
    </span>
  </div>
  );
}

export default PlaylistItem;