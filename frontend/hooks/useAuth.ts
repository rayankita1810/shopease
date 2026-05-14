"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export const useAuth = (allowedRoles: string[]) => {
  const router = useRouter();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "null");

    if (!user || !allowedRoles.includes(user.role)) {
      router.push("/login");
    }
  }, []);
};
