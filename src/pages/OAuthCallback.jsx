import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { saveToken } from "../utils/storage";

export default function OAuthCallback() {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const code = params.get("code");
    const error = params.get("error");

    // Log the code received from TikTok
    console.log("TikTok OAuth Code:", code);
    console.log("TikTok OAuth Error:", error);

    if (error || !code) {
      alert("Authorization failed");
      navigate("/");
      return;
    }

    fetch("/api/oauth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Token exchange response:", data);

        if (!data.success || !data.data?.access_token) {
          throw new Error(data.error || "Token exchange failed");
        }

        saveToken(data.data.access_token);
        navigate("/");
      })
      .catch((err) => {
        console.error("OAuth error:", err);
        alert("Session expired. Please reconnect your account.");
        navigate("/");
      });
  }, [params, navigate]);

  return <p>Connecting your TikTok Ads account…</p>;
}