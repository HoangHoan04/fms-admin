import { ROUTES } from "@/common/constants";
import { usePermission } from "@/hooks/layout/usePermission";
import { useRouter } from "@/routers/hooks";
import { findMatchingRoutePattern } from "@/utils";
import { useEffect, useMemo } from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

export const AuthGuard = ({
  children,
  requiredPermission,
}: {
  children: any;
  requiredPermission?: string;
}) => {
  const { hasPermission } = usePermission();
  const { isLoading } = useAuth();
  const router = useRouter();
  const location = useLocation();

  const routePermission = useMemo(() => {
    if (requiredPermission) return requiredPermission;
    const matchedRoute = findMatchingRoutePattern(location.pathname, ROUTES.MAIN);
    return matchedRoute?.permission;
  }, [location.pathname, requiredPermission]);

  useEffect(() => {
    if (!isLoading && routePermission && !hasPermission(routePermission)) {
      router.push(ROUTES.MAIN.HOME.path);
    }
  }, [isLoading, routePermission, hasPermission, router]);

  if (isLoading) {
    return null;
  }

  if (routePermission && !hasPermission(routePermission)) {
    return null;
  }

  return <>{children}</>;
};
