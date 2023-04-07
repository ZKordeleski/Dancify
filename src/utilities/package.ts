import { Artist, AudioFeatures, Playlist, Raw, Response, Track } from "../types";

export function packageTrack(rawTrack: Raw.Track): Track {
  return {
    name: rawTrack.name,
    id: rawTrack.id,
    images: rawTrack.album.images,
    artistIDs: rawTrack.artists.map((rawArtist) => rawArtist.id)
  }
}

export function packageAudioFeatures(rawAudioFeatures: Raw.AudioFeatures): AudioFeatures {
  return rawAudioFeatures;
}

export function packageArtist(rawArtist: Raw.Artist): Artist {
  return {
    name: rawArtist.name,
    id: rawArtist.id
  }
}

export function packagePlaylist(metadata: Raw.Playlist, tracks: Raw.Track[]): Playlist {


  return (
    {
      images: metadata.images,
      id: metadata.id,
      name: metadata.name,
      numberOfTracks: tracks.length
    }
  );
}