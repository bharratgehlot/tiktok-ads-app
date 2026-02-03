import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function OAuthCallback() {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const code = params.get("code");

    if (!code) {
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
        if (!data.access_token) {
          throw new Error();
        }

        localStorage.setItem("tiktok_token", data.access_token);
        navigate("/");
      })
      .catch(() => {
        alert("Session expired. Please reconnect your account.");
        navigate("/");
      });
  }, []);

  return <p>Connecting your TikTok Ads account…</p>;
}
