import { useAuth0 } from "@auth0/auth0-react";
import { useEffect, useState, useRef } from "react";
import { api, setAccessToken } from "@/services/api";

export const useApi = () => {
  const { getAccessTokenSilently, isAuthenticated, user } = useAuth0();
  const [isSynced, setIsSynced] = useState(false);
  const [syncError, setSyncError] = useState<string | null>(null);
  const syncingRef = useRef(false);

  useEffect(() => {
    const updateTokenAndSync = async () => {
      // Chỉ đồng bộ nếu chưa đang đồng bộ và chưa hoàn thành đồng bộ
      if (isAuthenticated && user && !syncingRef.current && !isSynced) {
        syncingRef.current = true;
        try {
          const token = await getAccessTokenSilently();
          setAccessToken(token);
          
          // Sync user with backend
          await api.identities.sync({
            auth0Id: user.sub || "",
            email: user.email || "",
            emailVerify: user.email_verified || false,
            name: user.name || user.nickname || "User",
            pictureUrl: user.picture || "",
            updateAt: new Date().toISOString()
          });
          
          setIsSynced(true);
          setSyncError(null);
        } catch (error: any) {
          console.error("Error during API setup/sync:", error);
          setAccessToken(null);
          setIsSynced(false);
          setSyncError(error.message);
        } finally {
          syncingRef.current = false;
        }
      } else if (!isAuthenticated) {
        setAccessToken(null);
        setIsSynced(false);
        syncingRef.current = false;
      }
    };

    updateTokenAndSync();
  }, [isAuthenticated, getAccessTokenSilently, user, isSynced]);

  return { isSynced, syncError };
};
