import { getArtist, getAudioFeatures } from "../fixtures/data";
import Meter from "../Meter/Meter";
import { Artist, Track, TrackID } from "../types";
import { useCache } from "../utilities/useCache";
import "./TrackItem.css";

interface TrackInfoProps{
  trackInfo: Track,
  index: number,
  buttonType: "add" | "remove";
  addRemoveTrack: (trackID: TrackID, index: number) => void | ((trackID: TrackID, index: number) => void),
  key: string
}

function TrackItem(props: TrackInfoProps) {
  // TODO: Finish artist names;
  let trackAudioFeatures = useCache([props.trackInfo.id], getAudioFeatures)?.[0];
  let artists: (Artist | undefined)[] | undefined = useCache(props.trackInfo.artistIDs, getArtist);
  let artistNames: string[] = [];
  for (let artist of artists || []) {
    if (artist !== undefined) {
      artistNames.push(" " + artist.name);
    }
  }
  return (
    <div className={"TrackItem " + props.buttonType + "TrackItem"} onClick={() => props.addRemoveTrack(props.trackInfo.id, props.index)}>
      <div className="track-info-wrapper">
        <div className="track-image" style={{backgroundImage: `url("${props.trackInfo.images[0].url}")`}} />
        <div className="TextContainer">
          <div className="TrackName">
            <span>{props.trackInfo.name}</span>
          </div>
          <div className="TrackArtists">
            <span>{artistNames.toString()}</span>
          </div>
        </div>
      </div>
      <div className="button-wrapper">
        <button className={props.buttonType} onClick={() => props.addRemoveTrack(props.trackInfo.id, props.index)}></button>
      </div>
    </div>
  )
}

export default TrackItem;