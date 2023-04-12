import { Artist, ArtistID, AudioFeatures, Playlist, PlaylistID, Raw, Response, Track, TrackID, User } from "../types";
import { generateURLWithSearchParams } from "../utilities/generateURLWithSearchParams";
import { makeRandomString } from "../utilities/makeRandomString";
import { promiseTimeout, Timeout } from "../utilities/timeout";
import heartIcon from "../../public/heartIcon.svg"

export let currentUser = "currentUser";

const clientSecret = import.meta.env.VITE_CLIENT_SECRET;
const clientID = import.meta.env.VITE_CLIENT_ID;
const redirectURI = import.meta.env.VITE_REDIRECT_URI;

interface Token {
    key: string,
    expirationTime: number,
    refreshToken: string
}

export let token: undefined | Promise<Token> = undefined;

// =====================
// Token Getter
// =====================

export async function getToken(): Promise<string> {
    let callTime: number = Date.now();

    // Check if the token exists / has expired. If so, fetch a new token.
    let oldToken = token;

    if (token === undefined) {
        throw new Error("Token undefined! That shouldn't happen.");
    }

    let {expirationTime, refreshToken} = await token;
    
    if (expirationTime < callTime) {
        // Allows only first refresher of token to refresh, causing others who happen to arrive afterwards to wait until the first refresher completes.
        if (token === oldToken) {
            token = exchangeRefreshToken(callTime, refreshToken);
        }
    }

    return (await token).key;
}

export async function exchangeRefreshToken(callTime: number, refreshToken: string): Promise<Token> {
    // Store the current time for checking if our token is still valid / computing the expiration of our soon-to-be token.
    let data = new URLSearchParams();
    data.append("grant_type", "refresh_token");
    data.append("refresh_token", refreshToken);
    data.append("client_id", clientID);
    
    let token_response = await (await fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: data,
        })).json();

    let promiseToken = {
        key: token_response.access_token,
        expirationTime: callTime + token_response.expires_in*1000,
        refreshToken: token_response.refresh_token
    };
    
    return promiseToken;
}

// export async function fetchToken(callTime: number): Promise<Token> {
//     // Store the current time for checking if our token is still valid / computing the expiration of our soon-to-be token.
//     let data = new URLSearchParams();
//     data.append("grant_type", "client_credentials");
    
//     let token_response = await (await fetch("https://accounts.spotify.com/api/token", {
//         method: "POST",
//         headers: {
//             "Authorization": "Basic " + btoa(clientID + ":" + clientSecret),
//         },
//         body: data,
//         })).json();

//     let promiseToken = {
//         key: token_response.access_token,
//         expirationTime: callTime + token_response.expires_in*1000,
//         refreshToken: token_response.refresh_token
//     };
    
//     return promiseToken;
// }

// =====================
// OAuth Process
// =====================
async function generateCodeChallenge(codeVerifier: string) {
    const encoder = new TextEncoder();
    const data = encoder.encode(codeVerifier);
    const digest = await window.crypto.subtle.digest("SHA-256", data);

    const base64String = btoa(String.fromCharCode(...new Uint8Array(digest)))
        .replace(/=/g, '')
        .replace(/\+/g, '-')
        .replace(/\//g, '_');

    return base64String;
}

function getOAuthState() {
    const state = makeRandomString(50);
    localStorage.setItem('state', state);

    return state;
}

// Generate Code Verifier for OAuth.
function getOauthCodeVerifier() {
    const codeVerifier = makeRandomString(50);
    localStorage.setItem('code_verifier', codeVerifier);

    return codeVerifier;
}

export async function redirectUserToSpotifyAuthorization() {

    // Store code verifier and state in local storage for token exchange later.
    const codeVerifier = getOauthCodeVerifier();
    const state = getOAuthState();

    generateCodeChallenge(codeVerifier).then((code_challenge) => {
        
        // URL information for redirect.
        const spotifyAuthURL = 'https://accounts.spotify.com/authorize';

        const spotifyAuthURLParams = {
            client_id: clientID,
            redirect_uri: redirectURI,
            response_type: "code",
        
            // Permission types for app functionality.
            scope: "playlist-read-private,playlist-read-collaborative,playlist-modify-private,playlist-modify-public,"
            +"user-library-modify,user-library-read,"
            +"user-read-email",
        
            code_challenge_method: 'S256',
            code_challenge,
            state: state
        }

        // Redirect user to authorization endpoint. 
        // NOTE: Reading a bit, seems like it might be more secure to adapt to window.location instead?
        window.location.href = generateURLWithSearchParams(spotifyAuthURL, spotifyAuthURLParams);

    })
}

export async function exchangeCodeForToken() {
    token = exchangeToken();
}

export async function exchangeToken() {
    const code_verifier = localStorage.getItem('code_verifier');
    const state = localStorage.getItem('state');

    if ((code_verifier === null) || (state === null)) {
        throw new Error("Authentication failed. Code verifier and state not found.")
    }

    const oAuthResponseURL = window.location.href;
    const oAuthResponseURLSplit = oAuthResponseURL.split("?code=").pop()?.split("&state=");
    
    if (oAuthResponseURLSplit === undefined) {
        throw new Error('User authentication failed. Failed to parse OAuth Response URL.') 
    }

    const oAuthResponseCode = oAuthResponseURLSplit[0];
    const oAuthResponseState = oAuthResponseURLSplit[1];

    localStorage.clear();
    history.replaceState(null, "", location.origin);

    if (oAuthResponseState !== state) {
        throw new Error('Authentication failed. OAuth response state does not match.')
    } else {

    // If state checks pass, sends fetch request to get user tokens.
    // TODO: Use generateURLWIthSearchParams function to resolve this.
    const data = new URLSearchParams();
    data.append("grant_type", "authorization_code");
    data.append("code", oAuthResponseCode);
    data.append("redirect_uri", redirectURI);
    data.append("client_id", clientID);
    data.append("code_verifier", code_verifier);

    let callTime: number = Date.now();

    let token_response = await (await fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: {
            "Authorization": "Basic " + btoa(clientID + ":" + clientSecret),
        },
        body: data,
    })).json();

    let promiseToken = {
        key: token_response.access_token,
        expirationTime: callTime + token_response.expires_in*1000,
        refreshToken: token_response.refresh_token
    };

    // let userProfile = await (await fetch("https://accounts.spotify.com/v1/me", {
    //     method: "GET",
    //     headers: {
    //         "Authorization": "Bearer " + promiseToken.key,
    //     }
    // })).json();

    // currentUserID = userProfile.id;
    
    return promiseToken;
    }
}

// =====================
// Batcher
// =====================
type ObjectIndex<Type> = {[key: string]: Type | undefined};
type Fetcher = (objectIDs: string[]) => Promise<void>;
type singleFetcher = (objectIDs: string) => Promise<void>;
type Getter<IDType, Type> = (objectID: IDType) => Promise<Type | undefined>;

export function batchify<IDType extends string, Type>(objectByID: ObjectIndex<Type>, fetcher: Fetcher, batchSize = 100): Getter<IDType, Type> {
    let batch = new Set<IDType>();
    let timeout: Timeout;
    let fetchPromise: Promise<void>;

    return async (objectID: IDType) => {

        if (objectByID[objectID] === undefined) {
            if (batch.size === batchSize) {
                timeout.cancel();
                batch = new Set();
            }

            batch.add(objectID);

            if (batch.size === 1) {
                timeout = promiseTimeout(15);
                let currentBatch = batch;
                fetchPromise = timeout.promise.catch(() => undefined).then(async () => {
                    // TODO: Seems to be failing for clicking on Maeve's music for the first time when loading the page.
                    await fetcher([...currentBatch]);
                    currentBatch.clear();
                });
            }
            
            await fetchPromise;
        }

        return objectByID[objectID];
    }
}

export function memoizeFetch<IDType extends string, Type>(objectByID: ObjectIndex<Type>, fetcher: singleFetcher) {
    let greenLight: {[key: string]: Promise<void>} = {};

    return async (objectID: IDType) => {
        // NOTE: This can be cleaned up a touch. I don't think it is necessary to await twice.
        //       I also think the method we're removing the object from the greenLight could be more straightforward.
        //       It was implemented this way to prevent the object from being interacted with twice etc. but I think it's unnec.
        if (objectByID[objectID] === undefined) {
            if (greenLight[objectID] === undefined) {
                greenLight[objectID] = fetcher(objectID);
            }
            
            await greenLight[objectID]
            
            // NOTE: This check insures that, if a playlist's information has been wiped from storage, a future fetch will be done to retrieve it.
            if (greenLight[objectID] !== undefined) {
                delete greenLight[objectID];
            }
        }
        return objectByID[objectID];
    }
}

// =====================
// User Information
// =====================
export let userInfoByID:{[userID: string]: User} = {
};

export async function getUserInfo(id: string) {
    if (userInfoByID[currentUser] === undefined) {
        await fetchUserInfo();
    }

    return userInfoByID[currentUser];
}

export async function fetchUserInfo() {
    let token: string = await getToken();

    let response: Response.User = await (await fetch(`https://api.spotify.com/v1/me`, {
        headers: {
            "Authorization": "Bearer " + token,
            "Content-Type": "application/json"
        }
    })).json();

    let userInfo: User = {
        displayName: response.display_name,
        id: response.id,
        images: response.images
    }

    userInfoByID[currentUser] = userInfo;

    return userInfo;
}


// =====================
// Current User's Playlists
// =====================
export let playlistsByUserID: {[userID: string]: PlaylistID[] | undefined} = {
}

export let getCurrentUserPlaylists = memoizeFetch(playlistsByUserID, fetchCurrentUserPlaylists);

export async function fetchCurrentUserPlaylists(userID: string) {
    // Gets a valid token to make the API request.
    let token: string = await getToken();
    let userPlaylists: PlaylistID[] = playlistsByUserID[currentUser] = [];
    let responsePlaylistItems = [];
    let responseSavedTracksItems = [];

    // User's Saved Tracks
    // NOTE: Has to cycle through fetching until the "next" parameter is gone, signifying all user saved tracks are fetched.
    let responseSavedTracks: Response.UserSavedTracks = await (await fetch(`https://api.spotify.com/v1/me/tracks`, {
        headers: {
            "Authorization": "Bearer " + token,
            "Content-Type": "application/json"
        }
    })).json();

    responseSavedTracksItems.push(...responseSavedTracks.items);

    while (responseSavedTracks.next !== null) {
        responseSavedTracks = await (await fetch(`${responseSavedTracks.next}`, {
            headers: {
                "Authorization": "Bearer " + token,
                "Content-Type": "application/json"
            }
        })).json();
        responseSavedTracksItems.push(...responseSavedTracks.items);
    }

    let savedTracksID = "savedTracks";
    let savedTracksImage: Raw.Image[] = [{
        height: 200,
        url: heartIcon,
        width: 200
    }];

    // Stores track ids behind playlist id. Stores track information behind track id.
    let trackIDs: TrackID[] = [];
    for (let item of responseSavedTracksItems) {
        if (item === undefined || item.track.duration_ms === 0) {
            continue;
        }

        trackIDs.push(item.track.id);
        let dancifyTrack: Track = {
            name: item.track.name,
            id: item.track.id,
            images: item.track.album.images,
            artistIDs: item.track.artists.map((artist) => artist.id),
            durationMS: item.track.duration_ms,
            added: false
        }

        trackByID[item.track.id] = dancifyTrack;
    }

    let savedTracksPlaylist: Playlist = {
        name: "Liked Songs",
        id: savedTracksID,
        images: savedTracksImage,
        numberOfTracks: trackIDs.length
    };

    userPlaylists.push(savedTracksID);
    playlistByID["savedTracks"] = savedTracksPlaylist;
    tracksByPlaylistID["savedTracks"] = trackIDs;    

    // User's Playlists
    // NOTE: Has to cycle through fetching until the "next" parameter is gone, signifying all user playlists are fetched.
    let response: Response.UserPlaylists = await (await fetch(`https://api.spotify.com/v1/me/playlists`, {
        headers: {
            "Authorization": "Bearer " + token,
            "Content-Type": "application/json"
        }
    })).json();
    
    responsePlaylistItems.push(...response.items);

    while (response.next !== null) {
        response = await (await fetch(`${response.next}`, {
            headers: {
                "Authorization": "Bearer " + token,
                "Content-Type": "application/json"
            }
        })).json();
        responsePlaylistItems.push(...response.items);
    }

    // Pulls playlists out of the response object and stores in playlistByID with proper typing for Dancify usage.
    for (let responsePlaylist of responsePlaylistItems) {
        
        let dancifyPlaylist: Playlist = {
            name: responsePlaylist.name,
            id: responsePlaylist.id,
            images: responsePlaylist.images,
            numberOfTracks: responsePlaylistItems.length
        };

        userPlaylists.push(responsePlaylist.id);
        playlistByID[responsePlaylist.id] = dancifyPlaylist;
    }
}

// =======================
// Public User's Playlists
// =======================

export let getUserPlaylists = memoizeFetch(playlistsByUserID, fetchUserPlaylists);

export async function fetchUserPlaylists(userID: string) {
    // Gets a valid token to make the API request.
    let token: string = await getToken();
    let responseItems = [];

    // Send API request for track features using a track ID.
    let response: Response.UserPlaylists = await (await fetch(`https://api.spotify.com/v1/users/${userID}/playlists`, {
        headers: {
            "Authorization": "Bearer " + token,
            "Content-Type": "application/json"
        }
    })).json();
    
    responseItems.push(...response.items);

    while (response.next !== null) {
        response = await (await fetch(`${response.next}`, {
            headers: {
                "Authorization": "Bearer " + token,
                "Content-Type": "application/json"
            }
        })).json();
        responseItems.push(...response.items);
    }

    let userPlaylists: PlaylistID[] = playlistsByUserID[userID] = [];

    // Pulls playlists out of the response object and stores in playlistByID with proper typing for Dancify usage.
    for (let responsePlaylist of responseItems) {
        
        let dancifyPlaylist: Playlist = {
            name: responsePlaylist.name,
            id: responsePlaylist.id,
            images: responsePlaylist.images,
            numberOfTracks: responsePlaylist.tracks.total
        };

        userPlaylists.push(responsePlaylist.id);
        playlistByID[responsePlaylist.id] = dancifyPlaylist;
    }
}

// =====================
// Playlist
// =====================
export let playlistByID: {[playlistID: string]: Playlist} = {
}

export async function fetchPlaylist(playlistID: PlaylistID) {
    // Gets a valid token to make the API request.
    let token: string = await getToken();

    // Send API request for track features using a track ID.
    let response: Raw.Playlist = await (await fetch("https://api.spotify.com/v1/playlists/" + playlistID, {
        headers: {
            "Authorization": "Bearer " + token,
            "Content-Type": "application/json"
        }
    })).json();

    // Store track audio features in an object organized by key.
    
    let dancifyPlaylist: Playlist = {
        name: response.name,
        id: response.id,
        images: response.images,
        numberOfTracks: response.tracks.total
    }

    playlistByID[playlistID] = dancifyPlaylist;
}

// Currently not batching correctly need to fix. Also extract batch logic and rename batchify
export async function postNewPlaylist(playlistName: string, isPublic: boolean, description: string, trackIDs: TrackID[]) {
    // Gets a valid token to make the API request.
    let token: string = await getToken();
    let userInfo = await getUserInfo(currentUser);

    let data = {
        "name": playlistName,
        "description": description,
        "public": isPublic
    };

    let newPlaylist: {id: string} = await (await fetch(`https://api.spotify.com/v1/users/${userInfo.id}/playlists`, {
        method: "POST",
        headers: {
            "Authorization": "Bearer " + token,
        },
        body: JSON.stringify(data),
    })).json();

    let newPlaylistID = newPlaylist.id;

    await postPlaylistItems(trackIDs, newPlaylistID);

    // HACK: Make this not a shitty hack but, rather, a perfectly acceptable hack to use.
    // -- -- Use cache in dancify is looking at the currentUser key when running the fetch for current user playlists.
    // -- -- That fetch wasn't running again after adding a new playlist because the check in "memoizeFetch" relies on the objectByID[ID] === undefined, which... it isn't.
    // -- -- Need a better work around than simply changing the user.
    // TODO: Make the new playlist fetched and added to the top of the list. (Alternatively, make the users playlists get refetched and Spotify will hand back in the correct order.)
    currentUser = Math.random().toString();
}

//TODO: Turn the batch logic into it's own function called batchify.
//TODO: Rename original batchify to catchify.
//TODO: Make the app refetch playlists after posting.
//TODO: Allow user to input playlist description information.
export async function postPlaylistItems(trackIDs: TrackID[], playlistID: PlaylistID) {
    // Gets a valid token to make the API request.
    let token: string = await getToken();
    let batchSize = 100;
    let trackURIs = trackIDs.map((track) => "spotify:track:" + track);
    for (let i = 0; i < trackURIs.length; i += batchSize) {
        let batch = trackURIs.slice(i, i + batchSize);
        let data = JSON.stringify({"uris": batch});
        await (await fetch(`https://api.spotify.com/v1/playlists/${playlistID}/tracks`, {
            method: "POST",
            headers: {
                "Authorization": "Bearer " + token
            },
            body: data
        })).json();
    }
}

// =====================
// Playlist Tracks
// =====================

export let tracksByPlaylistID: {[playlistID: string]: TrackID[]} = {
}

export let getPlaylistTracks = memoizeFetch(tracksByPlaylistID, fetchPlaylistTracks);

// TODO: This function can be cleaned up by moving some of the logic to a new function (paginator).
export async function fetchPlaylistTracks(playlistID: PlaylistID) {
    // Gets a valid token to make the API request.
    let token: string = await getToken();

    let responseItems = [];

    // Send API request for track features using a track ID.
    let response: Response.PlaylistTracks = await (await fetch(`https://api.spotify.com/v1/playlists/${playlistID}/tracks`, {
        headers: {
            "Authorization": "Bearer " + token,
            "Content-Type": "application/json"
        }
    })).json();

    responseItems.push(...response.items);

    while (response.next !== null) {
        response = await (await fetch(`${response.next}`, {
            headers: {
                "Authorization": "Bearer " + token,
                "Content-Type": "application/json"
            }
        })).json();
        responseItems.push(...response.items);
    }

    // Stores track ids behind playlist id. Stores track information behind track id.
    let trackIDs: TrackID[] = [];
    for (let item of responseItems) {
        trackIDs.push(item.track.id);
        let dancifyTrack: Track = {
            name: item.track.name,
            id: item.track.id,
            images: item.track.album.images,
            artistIDs: item.track.artists.map((artist) => artist.id),
            durationMS: item.track.duration_ms,
            added: false
        }

        trackByID[item.track.id] = dancifyTrack;
    }
    tracksByPlaylistID[playlistID] = trackIDs;
}

// =====================
// Artist
// =====================
export let artistByID: {[artistID: ArtistID]: Artist} = {

}

export let getArtist = batchify(artistByID, fetchArtists, 50);

export async function fetchArtists(artistIDs: ArtistID[]) {
    // Gets a valid token to make the API request.
    let token: string = await getToken();

    // Send API request for track features using a track ID.
    let response: Response.Artists = await (await fetch("https://api.spotify.com/v1/artists?ids=" + artistIDs.join(), {
        headers: {
            "Authorization": "Bearer " + token,
            "Content-Type": "application/json"
        }
    })).json();
    
    // Store track audio features in an object organized by key.
    for (let responseArtist of response.artists) {
        
        let dancifyArtist: Artist = {
            name: responseArtist.name,
            id: responseArtist.id
        };

        artistByID[dancifyArtist.id] = dancifyArtist;
    }    
}

// =====================
// Track
// =====================
export let trackByID: {[trackID: TrackID]: Track} = {
}

export let getTrack = batchify(trackByID, fetchTracks, 50);

export async function fetchTracks(trackIDs: TrackID[]) {
    // Gets a valid token to make the API request.
    let token: string = await getToken();

    // Send API request for track features using a track ID.
    let response: Response.Tracks = await (await fetch("https://api.spotify.com/v1/tracks?ids=" + trackIDs.join(), {
        headers: {
            "Authorization": "Bearer " + token,
            "Content-Type": "application/json"
        }
    })).json();
    
    // Store track audio features in an object organized by key.
    for (let responseTrack of response.tracks) {
        let trackID = responseTrack.id;
        
        let dancifyTrack: Track = {
            name: responseTrack.name,
            id: responseTrack.id,
            images: responseTrack.album.images,
            artistIDs: responseTrack.artists.map((artist) => artist.id),
            durationMS: responseTrack.duration_ms,
            added: false
        };

        trackByID[trackID] = dancifyTrack;
    }
}

// =====================
// Audio Features
// =====================
export let audioFeaturesByTrackID: {[trackID: TrackID]: AudioFeatures} = {
}

export let getAudioFeatures = batchify(audioFeaturesByTrackID, fetchAudioFeatures);

export async function fetchAudioFeatures(trackIDs: TrackID[]) {
    // Gets a valid token to make the API request.
    let token: string = await getToken();

    // Send API request for track features using a track ID.
    let responseAudioFeatures = await (await fetch("https://api.spotify.com/v1/audio-features?ids=" + trackIDs.join(), {
        headers: {
            "Authorization": "Bearer " + token,
            "Content-Type": "application/json"
        }
    })).json();

    // Store track audio features in an object organized by key.
    // HACK: Currently has "key" and "key_signature" on it. key_signature was added and named in AudioFeatures type to prevent "key" confusion.
    for (let trackFeatures of responseAudioFeatures.audio_features as Raw.AudioFeatures[]) {
        let trackID = trackFeatures.id;
        audioFeaturesByTrackID[trackID] = {...trackFeatures, key_signature: trackFeatures.key};
    }
}

// Uses a raw server response of all playlists to create individual playlist objects.
// for (let rawPlaylist of rawPlaylistsMetadata.items) {
//     let responseTracks = rawPlaylistTracksByID[rawPlaylist.id];
//     if (responseTracks === undefined) {
//         continue;
//     }

//     // Extracts raw track information from server response.
//     let rawTracks: Raw.Track[] = [];
//     for (let container of responseTracks.items) {
//         rawTracks.push(container.track);
//         // trackByID[container.track.id] = packageTrack(container.track);
//     }

//     // Populates fixtured playlists with our post processed playlists / tracks.
//     playlistByID[rawPlaylist.id] = packagePlaylist(rawPlaylist, rawTracks);
// }