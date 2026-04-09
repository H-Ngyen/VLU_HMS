import { createContext, useContext, useState, useEffect, useRef, type ReactNode } from "react";
import type { User } from "@/types";
import { useAuth0 } from "@auth0/auth0-react";
import { api, setAccessToken } from "@/services/api";

interface AuthContextType {
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  isAdmin: boolean;
  isTeacher: boolean;
  isStudent: boolean;
  isSynced: boolean;
  syncError: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isSynced, setIsSynced] = useState(false);
  const [syncError, setSyncError] = useState<string | null>(null);
  
  const { getAccessTokenSilently, isAuthenticated, user } = useAuth0();
  const syncingRef = useRef(false);

  const isAdmin = currentUser?.roleName === "Admin";
  const isTeacher = currentUser?.roleName === "Teacher";
  const isStudent = currentUser?.roleName === "Student";

  useEffect(() => {
    const updateTokenAndSync = async () => {
      if (isAuthenticated && user && !syncingRef.current && !isSynced) {
        syncingRef.current = true;
        try {
          const token = await getAccessTokenSilently();
          setAccessToken(token); 
          
          // 1. Sync user with backend (POST /api/identities)
          // Gửi kèm thông tin user trong body để đề phòng Backend cần
          const result = await api.identities.sync(token, {
            auth0Id: user.sub,
            email: user.email,
            emailVerify: user.email_verified,
            name: user.name || user.nickname,
            pictureUrl: user.picture,
            updateAt: new Date().toISOString()
          });
          
          let dbUser: User | null = null;
          
          if (typeof result === 'number') {
            dbUser = await api.identities.getUser(result, token);
          } else {
            const allUsers = await api.identities.getAllUsers(token);
            dbUser = allUsers.find(u => u.auth0Id === user.sub) || null;
          }
          
          if (dbUser) {
            setCurrentUser(dbUser);
          } else {
            throw new Error("Không tìm thấy thông tin tài khoản trong hệ thống.");
          }
          
          setIsSynced(true);
          setSyncError(null);
        } catch (error: unknown) {
          const errorMessage = error instanceof Error ? error.message : "Đã xảy ra lỗi không xác định";
          console.error("Error during API setup/sync:", error);
          setAccessToken(null);
          setIsSynced(false);
          setSyncError(errorMessage);
        } finally {
          syncingRef.current = false;
        }
      } else if (!isAuthenticated) {
        setAccessToken(null);
        setIsSynced(false);
        setCurrentUser(null);
        syncingRef.current = false;
      }
    };

    updateTokenAndSync();
  }, [isAuthenticated, getAccessTokenSilently, user, isSynced]);

  return (
    <AuthContext.Provider value={{ 
      currentUser, 
      setCurrentUser, 
      isAdmin, 
      isTeacher, 
      isStudent,
      isSynced,
      syncError
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
