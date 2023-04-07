import "./LoadingPlaylistItem.css";

function LoadingPlaylistItem() {
    return (
        <div className={`PlaylistItem loading`}>
            <div className="PlaylistImage" />
            <span className="PlaylistName"></span>
            <span className="PlaylistName"></span>
        </div>
    )
}

export default LoadingPlaylistItem;