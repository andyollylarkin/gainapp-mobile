import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from "expo-web-browser";
import { useState, useEffect } from "react";

WebBrowser.maybeCompleteAuthSession();

const IOS_CLIENT_ID =
  "758758512454-vlq6p9j942nt23sfmepoogo2btv9u7o7.apps.googleusercontent.com";

export interface GoogleUser {
  name: string | null;
  email: string | null;
  avatarUrl: string | null;
}

export function useGoogleAuth() {
  const [user, setUser] = useState<GoogleUser | null>(null);
  const [loading, setLoading] = useState(false);

  const [request, response, promptAsync] = Google.useAuthRequest({
    iosClientId: IOS_CLIENT_ID,
    redirectUri: `com.googleusercontent.apps.758758512454-vlq6p9j942nt23sfmepoogo2btv9u7o7:/oauth2redirect/google`,
  });

  useEffect(() => {
    if (!response || response.type !== "success") return;
    const token = response.authentication?.accessToken;
    if (!token) return;

    setLoading(true);
    fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((info) => {
        setUser({
          name: info.name ?? null,
          email: info.email ?? null,
          avatarUrl: info.picture ?? null,
        });
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [response]);

  const signIn = () => {
    if (!request) return;
    promptAsync({ preferEphemeralSession: true });
  };

  const signOut = () => setUser(null);

  return { user, loading, signIn, signOut, isSignedIn: user !== null };
}
