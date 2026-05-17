"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "@/lib/store/authStore";
import { checkSession, logout } from "@/lib/api/clientApi";

const PRIVATE_ROUTES = ["/notes", "/profile"];

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const { setUser, clearIsAuthenticated, isAuthenticated } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();

  const isPrivate = PRIVATE_ROUTES.some((r) => pathname.startsWith(r));

  useEffect(() => {
    async function verify() {
      try {
        const user = await checkSession();
        if (user) {
          setUser(user);
        } else if (isPrivate) {
          await logout();
          clearIsAuthenticated();
          router.push("/sign-in");
          return;
        }
      } catch {
        if (isPrivate) {
          clearIsAuthenticated();
          router.push("/sign-in");
          return;
        }
      } finally {
        setLoading(false);
      }
    }
    verify();
  }, [pathname]);

  if (loading) return <p style={{ padding: "40px", textAlign: "center" }}>Loading...</p>;
  if (isPrivate && !isAuthenticated) return null;

  return <>{children}</>;
}
