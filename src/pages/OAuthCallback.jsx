import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { saveToken } from "../utils/storage";
import { getVerifier, clearVerifier } from "../utils/pkce";

export default function OAuthCallback() {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const code = params.get("code");
    const error = params.get("error");

    console.log("TikTok OAuth Code:", code);
    console.log("TikTok OAuth Error:", error);

    if (error || !code) {
      alert("Authorization failed");
      navigate("/");
      return;
    }

    const verifier = getVerifier();
    if (!verifier) {
      alert("Session error. Please try again.");
      navigate("/");
      return;
    }

    // Exchange code for token directly with TikTok
    fetch("https://open.tiktokapis.com/v2/oauth/token/", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        client_key: import.meta.env.VITE_TIKTOK_CLIENT_KEY,
        code: code,
        grant_type: "authorization_code",
        redirect_uri: import.meta.env.VITE_REDIRECT_URI,
        code_verifier: verifier,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Token exchange response:", data);

        if (!data.access_token) {
          throw new Error(data.error_description || "Token exchange failed");
        }

        saveToken(data.access_token);
        clearVerifier();
        navigate("/");
      })
      .catch((err) => {
        console.error("OAuth error:", err);
        alert("Session expired. Please reconnect your account.");
        clearVerifier();
        navigate("/");
      });
  }, [params, navigate]);

  return <p>Connecting your TikTok Ads account…</p>;
}