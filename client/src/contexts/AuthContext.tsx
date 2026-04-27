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
          const result = await api.identities.sync(token, {
            auth0Id: user.sub,
            email: user.email,
            emailVerify: user.email_verified,
            name: user.name || user.nickname,
            pictureUrl: user.picture,
            updateAt: new Date().toISOString()
          });
          
          let dbUser: User | null = null;
          
          // Lấy ID người dùng (xử lý nhiều định dạng trả về từ Backend)
          let userId: number | null = null;
          if (typeof result === 'number') {
            userId = result;
          } else if (result && typeof result === 'object') {
            userId = result.id || (result.data && result.data.id);
          } else if (typeof result === 'string') {
            userId = parseInt(result);
          }
          
          if (userId && !isNaN(userId)) {
            // Đợi 2 giây để Backend ổn định dữ liệu
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            try {
              dbUser = await api.identities.getUser(userId, token);
            } catch (e: any) {
              if (e.message === '403_FORBIDDEN') {
                throw new Error("Tài khoản của bạn đã bị khóa. Vui lòng liên hệ Quản trị viên để biết thêm chi tiết.");
              }
              console.warn("Lấy thông tin bị lỗi, đang thử xử lý lại...");
              // Chờ thêm một chút rồi thử lại lần cuối
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
