import { useState } from 'react';
import { redirectUserToSpotifyAuthorization } from '../fixtures/data';
import './landing.css';

function Landing() {

    let [showOverlay, setShowOverlay] = useState(false);

    // Displays on arrival to the page.
    const landingPageUI = (
        <div className="container">
                <div className="main-content">
                    <h1 className="title">
                        <span className="music">MUSIC</span><br/>
                        for your<br/>
                        <span className="mood">MOOD</span>
                    </h1>
                    <img src="./app-screenshot-metrics.png" alt="App Screenshot" className="app-screenshot"/>
                </div>
                <div className="description">
                <p>Playlists tailored to your specifications from your personal Spotify library. <br/> Your music, organized for your unique mood.</p>
                </div>
                <button className="get-started-btn" onClick={() => redirectUserToSpotifyAuthorization()}>Get Started</button>
            </div>
    )   

    const overlayUI = showOverlay ? (
        <div className="overlay" id="overlay">
            <div className="overlay-content">
                <p className="overlay-message">Before we make some mood-sic, we'll need to load in your Spotify library. Don't worry, though! All of this information is kept local to your PC and we don't see a thing.</p>
                <button className="overlay-btn" onClick={() => setShowOverlay(false)}>let's do it</button>
            </div>
        </div>
    ) : null;

    return (
        <div className="Landing">
            {landingPageUI}
        </div>
    );
}

export default Landing;