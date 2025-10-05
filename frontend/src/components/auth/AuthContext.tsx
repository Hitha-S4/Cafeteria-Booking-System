import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { RegisterPayload, User, UserRole } from "@/types";
import { LoginPayload, loginUser, registerUser } from "@/services/authApi";

interface AuthContextType {
  user: User | null;
  setUser: (user: User | null) => void; // ✅ add this
  login: (email: string, password: string) => Promise<void>;
  register: (
    name: string,
    email: string,
    password: string,
    role: UserRole,
    managerId?: string
  ) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const payload: LoginPayload = { email, password };
      const response = await loginUser(payload);
      const { user } = response;
      const parsedUser: User =
        typeof user === "string" ? JSON.parse(user) : user;

      localStorage.setItem("user", JSON.stringify(parsedUser));
      setUser(parsedUser);
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (
    name: string,
    email: string,
    password: string,
    role: UserRole,
    managerId?: string
  ) => {
    setIsLoading(true);
    try {
      const payload: RegisterPayload = {
        name,
        email,
        password,
        role,
        managerId,
      };
      const data = await registerUser(payload);
      return data;
    } catch (error) {
      console.error("Registration error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("ibm_user");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser, // ✅ exposed here
        login,
        logout,
        register,
        isAuthenticated: !!user,
        isLoading,
      }}
    >
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
