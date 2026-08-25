import { createContext, useContext, useState, useEffect, useRef, type ReactNode } from "react";
import type { User } from "@/types";
import { useAuth0 } from "@auth0/auth0-react";
import { api, setAccessToken } from "@/services/api";
import { jwtDecode } from "jwt-decode";

interface AuthContextType {
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  isAdmin: boolean;
  isTeacher: boolean;
  isStudent: boolean;
  isPatient: boolean;
  isSynced: boolean;
  syncError: string | null;
  logoutPatient: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isSynced, setIsSynced] = useState(false);
  const [syncError, setSyncError] = useState<string | null>(null);
  const [isPatientAuthenticated, setIsPatientAuthenticated] = useState(false);
  const [isPatientLoading, setIsPatientLoading] = useState(true);
  
  const { getAccessTokenSilently, isAuthenticated: isAuth0Authenticated, user: auth0User, isLoading: isAuth0Loading } = useAuth0();
  const syncingRef = useRef(false);

  const isAdmin = currentUser?.roleName === "Admin";
  const isTeacher = currentUser?.roleName === "Teacher";
  const isStudent = currentUser?.roleName === "Student";
  const isPatient = currentUser?.roleName === "Patient";

  const isLoading = isAuth0Loading || isPatientLoading;

  const logoutPatient = () => {
    localStorage.removeItem("patient_token");
    setIsPatientAuthenticated(false);
    setCurrentUser(null);
    setIsSynced(false);
    setAccessToken(null);
  };

  // 1. Kiểm tra JWT cho Patient
  useEffect(() => {
    const checkPatientAuth = () => {
      const token = localStorage.getItem("patient_token");
      if (token) {
        try {
          const decoded = jwtDecode<any>(token);
          if (decoded.exp * 1000 > Date.now()) {
            setIsPatientAuthenticated(true);
            setAccessToken(token);
          } else {
            localStorage.removeItem("patient_token");
          }
        } catch (e) {
          localStorage.removeItem("patient_token");
        }
      }
      setIsPatientLoading(false);
    };
    checkPatientAuth();
    
    // Listen for custom event from patient login
    const handlePatientLogin = () => {
      checkPatientAuth();
    };
    window.addEventListener("patient_logged_in", handlePatientLogin);
    return () => window.removeEventListener("patient_logged_in", handlePatientLogin);
  }, []);

  // 2. Logic đồng bộ user (chung cho cả Auth0 và Patient)
  useEffect(() => {
    const updateTokenAndSync = async () => {
      if (isLoading) return; // Wait until auth state is determined
      
      // PATIENT FLOW
      if (isPatientAuthenticated) {
        if (!syncingRef.current && !isSynced) {
          syncingRef.current = true;
          try {
             const token = localStorage.getItem("patient_token");
             if (!token) throw new Error("Missing token");
             setAccessToken(token);
             const decoded = jwtDecode<any>(token);
             // Trích xuất UserId từ JWT của .NET
             const userIdStr = decoded.sub || decoded.nameid || decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];
             if (userIdStr) {
                const dbUser = await api.identities.getUser(parseInt(userIdStr), token);
                if (dbUser) {
                  setCurrentUser(dbUser);
                  setIsSynced(true);
                  setSyncError(null);
                } else {
                  throw new Error("Không tìm thấy thông tin bệnh nhân");
                }
             }
          } catch (error: any) {
             console.error("Lỗi lấy thông tin patient", error);
             setSyncError(error.message);
             setIsSynced(false);
             logoutPatient();
          } finally {
             syncingRef.current = false;
          }
        }
        return; // Don't proceed to Auth0 flow if Patient
      }
      
      // AUTH0 FLOW (Admin/Teacher/Student)
      if (isAuth0Authenticated && auth0User && !syncingRef.current && !isSynced) {
        syncingRef.current = true;
        try {
          const token = await getAccessTokenSilently();
          setAccessToken(token); 
          
          // 1. Sync user with backend (POST /api/identities)
          const result = await api.identities.sync(token, {
            auth0Id: auth0User.sub,
            email: auth0User.email,
            emailVerify: auth0User.email_verified,
            name: auth0User.name || auth0User.nickname,
            pictureUrl: auth0User.picture,
            updateAt: new Date().toISOString()
          });
          
          let dbUser: User | null = null;
          let userId: number | null = null;
          if (typeof result === 'number') {
            userId = result;
          } else if (result && typeof result === 'object') {
            userId = result.id || (result.data && result.data.id);
          } else if (typeof result === 'string') {
            userId = parseInt(result);
          }
          
          if (userId && !isNaN(userId)) {
            await new Promise(resolve => setTimeout(resolve, 2000));
            try {
              dbUser = await api.identities.getUser(userId, token);
            } catch (e: any) {
              if (e.message === '403_FORBIDDEN') {
                throw new Error("Tài khoản của bạn đã bị khóa. Vui lòng liên hệ Quản trị viên để biết thêm chi tiết.");
              }
              console.warn("Lấy thông tin bị lỗi, đang thử xử lý lại...");
              await new Promise(resolve => setTimeout(resolve, 3000));
              try {
                dbUser = await api.identities.getUser(userId, token);
              } catch (retryError: any) {
                console.error("Retry failed:", retryError);
                if (retryError.message === '403_FORBIDDEN') {
                  throw new Error("Tài khoản của bạn đã bị khóa. Vui lòng liên hệ Quản trị viên để biết thêm chi tiết.");
                }
                throw new Error("Tài khoản đã được tạo nhưng hệ thống cần thời gian để đồng bộ. Vui lòng F5 hoặc đăng nhập lại sau 1 phút.");
              }
            }
          }
          
          if (dbUser) {
            setCurrentUser(dbUser);
            setIsSynced(true);
            setSyncError(null);
          } else {
            throw new Error("Không tìm thấy thông tin tài khoản trong hệ thống.");
          }
        } catch (error: unknown) {
          const errorMessage = error instanceof Error ? error.message : "Đã xảy ra lỗi không xác định";
          console.error("Error during API setup/sync:", error);
          setAccessToken(null);
          setIsSynced(false);
          setSyncError(errorMessage);
        } finally {
          syncingRef.current = false;
        }
      } else if (!isAuth0Authenticated && !isPatientAuthenticated && !isLoading) {
        setAccessToken(null);
        setIsSynced(false);
        setCurrentUser(null);
        syncingRef.current = false;
      }
    };

    updateTokenAndSync();
  }, [isAuth0Authenticated, getAccessTokenSilently, auth0User, isSynced, isPatientAuthenticated, isLoading]);

  return (
    <AuthContext.Provider value={{ 
      currentUser, 
      setCurrentUser, 
      isAdmin, 
      isTeacher, 
      isStudent,
      isPatient,
      isSynced,
      syncError,
      logoutPatient,
      isLoading
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
