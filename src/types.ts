// =====================
// Dancify Types
// =====================
export interface User {
    displayName: string,
    id: string,
    images: Raw.Image[]
}

export interface PlaylistMap {
    [playlistID: PlaylistID]: Playlist
}

export interface Playlist {
    images: Raw.Image[],
    id: PlaylistID,
    name: string,
    numberOfTracks: number
}

export interface Artist {
    name: string,
    id: ArtistID
}

export interface Track {
    name: string,
    id: TrackID,
    images: Raw.Image[],
    artistIDs: ArtistID[],
    durationMS: number,
    added: boolean | undefined
}

export interface AudioFeatures {
    id: string,
    danceability: number,
    energy: number,
    valence: number,
    instrumentalness: number,
    loudness: number,
    key: number,
    tempo: number,
    time_signature: number,
    duration_ms: number
}

// =====================
// Server Response Types
// =====================
export namespace Response {
    export interface User {
        display_name: string,
        id: string,
        images: Raw.Image[]
    }

    export interface UserPlaylists {
        items: Raw.Playlist[]
        limit: number,
        next: string | null,
        offset: number,
        previous: string | null,
        total: number
    }

    export interface UserSavedTracks {
        items: {
            track: Raw.Track
        }[],
        limit: number,
        next: string | null,
        offset: number,
        previous: string | null,
        total: number
    }

    export interface PlaylistTracks {
        items: {
            track: Raw.Track
        }[],
        limit: number,
        next: string | null,
        offset: number,
        previous: string | null,
        total: number
    }

    export interface Tracks {
        tracks: Raw.Track[];
    }

    export interface Artists {
        artists: Raw.Artist[];
    };

    export interface Albums { 
        albums: Raw.Album[];
    
    }

    export type TrackAudioFeatures = Raw.AudioFeatures;
}

// =====================
// Raw Types
// =====================
export namespace Raw {
    export interface Playlist {
        images: Raw.Image[],
        id: string,
        name: string
        tracks: {
            total: number
        }
    }

    export interface Artist {
        id: string,
        name: string,
        images: Raw.Image[],
        genres: string[],
        popularity: number,
        external_urls: {
            spotify: string;
        };
    }

    export interface Album {
        album_type: string;
        total_tracks: number;
        external_urls: {
            spotify: string;
        };
        id: string;
        images: Raw.Image[];
        name: string;
        release_date: string;
        type: string;
        artists: {
            id: string;
            name: string;
        }[];
    }

    export interface Track {
        album: Album;
        artists: Omit<Artist, "popularity" | "genres" | "images">[];
        duration_ms: number;
        external_urls: {
            spotify: string;
        };
        id: string;
        name: string;
        popularity: number;
    }
    
    export interface Image {
        height: number | null,
        url: string,
        width: number | null
    }

    export interface AudioFeatures {
        id: string,
        danceability: number,
        energy: number,
        valence: number,
        instrumentalness: number,
        loudness: number,
        key: number,
        tempo: number,
        time_signature: number,
        duration_ms: number
    }
}

// =====================
// Aliases
// =====================

export type PlaylistID = string;
export type TrackID = string;
export type ArtistID = string;