import { useNavigate } from "react-router-dom";
import { isAuthenticated, logout } from "../utils/storage";
import { generateCodeVerifier, generateCodeChallenge, storeVerifier } from "../utils/pkce";

export default function Home() {
  const navigate = useNavigate();
  
  // TEMP: allow ad flow testing without OAuth ( will be removed later )
  // set this false to check real authetication flow
  
  const FORCE_AD_FLOW = false;

  const loggedIn = FORCE_AD_FLOW || isAuthenticated();

  const loginWithTikTok = async () => {
    // Generate PKCE codes
    const verifier = generateCodeVerifier();
    const challenge = await generateCodeChallenge(verifier);

    // Store verifier for later use
    storeVerifier(verifier);

    const params = new URLSearchParams({
      client_key: import.meta.env.VITE_TIKTOK_CLIENT_KEY,
      response_type: "code",
      scope: "user.info.basic",
      redirect_uri: import.meta.env.VITE_REDIRECT_URI,
      state: crypto.randomUUID(),
      code_challenge: challenge,
      code_challenge_method: "S256",
    });

    window.location.href =
      `https://www.tiktok.com/v2/auth/authorize/?${params.toString()}`;

    console.log("CONFIRM",{
      verifier,
      challenge,
      redirect: `https://www.tiktok.com/v2/auth/authorize/?${params.toString()}`
    })
      
  };

  if (!loggedIn) {
    return (

      <main className="home stack-lg">
        <h1>TikTok Ads Creative Flow</h1>
        <p>Connect your TikTok Ads account to start creating ads.</p>

        <button onClick={loginWithTikTok}>
          Connect TikTok Ads Account
        </button>

        {/** TEMP: direct access for testing */}
        <button onClick={() => navigate("/ad-creation")}>
          Create New Ad
        </button>


      </main>
      
    );
  }

  return (
    <main className="home stack-lg">
      <p className="success-text">✅ TikTok account connected</p>

      <button onClick={() => navigate('/ad-creation')}>
        Create New Ad
      </button>

      <button className="secondary" onClick={logout}>
        Logout
      </button>
    </main>
  );
}