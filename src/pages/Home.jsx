import { isAuthenticated, logout } from "../utils/storage";
import { generateCodeVerifier, generateCodeChallenge, storeVerifier } from "../utils/pkce";
import AdForm from "../components/ad-form/AdForm";

export default function Home() {
  const loggedIn = isAuthenticated();

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
  };

  if (!loggedIn) {
    return (
      <button onClick={loginWithTikTok}>
        Connect TikTok Ads Account
      </button>
      
    );
  }

  return (
    <>
      <p>✅ TikTok account connected</p>
      <button onClick={logout}>Logout</button>
    </>
  );
}