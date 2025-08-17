import React from "react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  user: any;
}

const ProtectedRoute = ({ children, user }: ProtectedRouteProps) => {
  const router = useRouter();

  useEffect(() => {
    if (!user || user.role !== "admin") {
      router.replace("/login");
    }
  }, [user, router]);

  if (!user || user.role !== "admin") {
    return null;
  }
  
  return <>{children}</>;
};

export default ProtectedRoute;
