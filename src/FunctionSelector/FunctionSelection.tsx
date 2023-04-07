import { TrackID } from "../types"
import { dancifier } from "../utilities/dancifier"
import "./FunctionSelection.css"

interface FunctionSelectionProps {
  selectedPlaylistTrackIDs: TrackID[] | undefined,
  setDancifiedTracks: (trackIDs: TrackID[]) => void
}

function FunctionSelection(props: FunctionSelectionProps) {
  if (props.selectedPlaylistTrackIDs !== undefined) {
    return (
      <div className="FunctionSelection">
          <p>Select an option.</p> 
          <button name="Dancify" onClick={async () => props.setDancifiedTracks(await dancifier(props.selectedPlaylistTrackIDs))}>Dancify</button>
      </div>
    );
  }
  else return null;
}

export default FunctionSelection;