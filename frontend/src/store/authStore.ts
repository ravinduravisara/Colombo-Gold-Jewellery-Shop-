import { create } from "zustand";
import { IUser } from "@/types/user";
import { authService } from "@/services/authService";

interface AuthState {
  user: IUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setUser: (user: IUser | null) => void;
  checkAuth: () => Promise<void>;
  logout: () => Promise<void>;
}

const getInitialUser = (): IUser | null => {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem("cgc_user");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const hasInitialToken = (): boolean => {
  if (typeof window === "undefined") return false;
  return !!localStorage.getItem("cgc_token");
};

export const useAuthStore = create<AuthState>((set, get) => {
  const initialUser = getInitialUser();
  const hasToken = hasInitialToken();

  return {
    user: initialUser,
    isAuthenticated: !!initialUser && hasToken,
    isLoading: hasToken && !initialUser,

    setUser: (user) => {
      if (typeof window !== "undefined") {
        if (user) {
          localStorage.setItem("cgc_user", JSON.stringify(user));
        } else {
          localStorage.removeItem("cgc_user");
        }
      }
      set({ user, isAuthenticated: !!user, isLoading: false });
    },

    checkAuth: async () => {
      if (typeof window === "undefined") return;

      const token = localStorage.getItem("cgc_token");
      if (!token) {
        set({ user: null, isAuthenticated: false, isLoading: false });
        return;
      }

      try {
        const currentUser = get().user;
        if (!currentUser) {
          set({ isLoading: true });
        }

        const user = await authService.getMe();
        if (user) {
          localStorage.setItem("cgc_user", JSON.stringify(user));
          set({ user, isAuthenticated: true, isLoading: false });
        }
      } catch (err: any) {
        if (err?.response?.status === 401) {
          localStorage.removeItem("cgc_token");
          localStorage.removeItem("cgc_user");
          set({ user: null, isAuthenticated: false, isLoading: false });
        } else {
          set({ isLoading: false });
        }
      }
    },

    logout: async () => {
      try {
        await authService.logout();
      } catch {
        // continue logout cleanup
      } finally {
        if (typeof window !== "undefined") {
          localStorage.removeItem("cgc_token");
          localStorage.removeItem("cgc_user");
        }
        set({ user: null, isAuthenticated: false, isLoading: false });
      }
    },
  };
});


