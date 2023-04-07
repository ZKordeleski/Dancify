import { redirectUserToSpotifyAuthorization } from '../fixtures/data';
import './login.css';

function Login() {   

    //TODO: Parse the response url code from oauth and hook it up to token state for the app to use in requests.
    //TODO: Add "state" to request URL to help prevent against redirect attacks.
    //TODO: Add "show_dialog to request URL so users don't have to sign-in again."
    return (
        <div className="Login">
            <div className="login-pane">
                <div className="logo-wrapper">
                    <p className="title">dancify</p>
                    <img src="dancifyLogoV3-NoText.svg" alt="dancify logo" />
                </div>
                <button onClick={() => {
                    redirectUserToSpotifyAuthorization();
                }
                }>login to spotify</button>
                <p>a <span>♬</span> tool by Zack Kordeleski</p>
            </div>
        </div>
    );
}

export default Login;