import { isAuthenticated, logout } from "../utils/storage";

export default function Home() {
  const loggedIn = isAuthenticated();

  const loginWithTikTok = () => {


    const params = new URLSearchParams({
      client_key: import.meta.env.VITE_TIKTOK_CLIENT_KEY,
      response_type: "code",
      scope: "user.info.basic",
      redirect_uri: import.meta.env.VITE_REDIRECT_URI,
      state: crypto.randomUUID(),
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
