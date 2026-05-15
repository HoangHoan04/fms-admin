import { ROUTES } from "@/common/constants/routes";
import { BreadCrumb } from "primereact/breadcrumb";
import { Ripple } from "primereact/ripple";
import { useCallback, useMemo } from "react";
import { Link, useLocation } from "react-router-dom";

type BreadcrumbItem = {
  label: string;
  path?: string;
  icon?: string;
};

const Breadcrumbs = ({ theme = "light" }: { theme?: "light" | "dark" }) => {
  const { pathname } = useLocation();

  const matchPathToPattern = useCallback((pathname: string, pattern?: string): boolean => {
    if (!pattern) return false;
    const pathParts = pathname.split("/").filter(Boolean);
    const patternParts = pattern.split("/").filter(Boolean);
    if (pathParts.length !== patternParts.length) return false;
    return pathParts.every((part, idx) => {
      const patternPart = patternParts[idx];
      return patternPart === part || patternPart.startsWith(":");
    });
  }, []);

  const findRouteByKey = useCallback((obj: any, key: string): any => {
    const search = (searchObj: any, parentKey?: string): any => {
      for (const value of Object.values(searchObj)) {
        const item = value as any;
        if (item.key === key) return { ...item, parentKey };
        if (item.children) {
          const result = search(item.children, item.key);
          if (result) return result;
        }
      }
      return null;
    };
    return search(obj);
  }, []);

  const findMatchingRoute = useCallback(
    (routes: any, targetPath: string): any | null => {
      let bestMatch: any = null;
      let maxDepth = -1;
      const traverse = (obj: any, depth: number, parentKey?: string) => {
        for (const item of Object.values(obj)) {
          const route = item as any;
          if (route.path) {
            const isMatch = matchPathToPattern(targetPath, route.path);
            if (isMatch) {
              const hasNoChildren = !route.children || Object.keys(route.children).length === 0;
              if (depth > maxDepth || (depth === maxDepth && hasNoChildren)) {
                bestMatch = { ...route, parentKey };
                maxDepth = depth;
              }
            }
          }
          if (route.children) traverse(route.children, depth + 1, route.key);
        }
      };
      traverse(routes, 0);
      return bestMatch;
    },
    [matchPathToPattern],
  );

  const breadcrumbChain = useMemo(() => {
    if (pathname === "/")
      return [
        {
          label: "Trang chủ",
          path: "/",
          icon: "pi-home",
          translationKey: "menu.home",
        },
      ];

    const matchedRoute = findMatchingRoute(ROUTES.MAIN, pathname);
    if (!matchedRoute)
      return [
        {
          label: "Trang chủ",
          path: "/",
          icon: "pi-home",
          translationKey: "menu.home",
        },
      ];

    const buildChainReverse = (route: any): BreadcrumbItem[] => {
      const chain: BreadcrumbItem[] = [];
      let currentRoute = route;
      while (currentRoute) {
        chain.unshift({
          label: currentRoute.label,
          path: currentRoute.path,
          icon: currentRoute.icon,
        });
        currentRoute = currentRoute.parentKey
          ? findRouteByKey(ROUTES.MAIN, currentRoute.parentKey)
          : null;
      }
      return chain;
    };

    return [
      {
        label: "Trang chủ",
        path: "/",
        icon: "pi-home",
        translationKey: "menu.home",
      },
      ...buildChainReverse(matchedRoute),
    ];
  }, [pathname, findMatchingRoute, findRouteByKey]);

  const items = useMemo(() => {
    return breadcrumbChain.map((item, idx) => {
      const isLast = idx === breadcrumbChain.length - 1;
      const linkColor = "text-[#1890ff] hover:text-[#40a9ff]";
      const displayLabel = item.label;

      return {
        template: () => (
          <div className="flex items-center">
            {isLast || !item.path ? (
              <span
                className={`mx-0! flex cursor-default items-center gap-2 rounded p-1 text-[0.65rem] font-semibold md:p-2 md:text-[0.7rem] lg:text-xs`}
              >
                {item.icon && (
                  <i className={`pi ${item.icon} text-inherit`} style={{ fontSize: "1em" }} />
                )}
                <span>{displayLabel}</span>
              </span>
            ) : (
              <Link
                to={item.path}
                className={`mx-0! flex items-center gap-2 rounded p-1 text-[0.65rem] no-underline transition-all duration-200 focus:ring-2 focus:ring-blue-400/20 focus:outline-none md:p-2 md:text-[0.7rem] lg:text-xs ${linkColor}`}
              >
                {item.icon && (
                  <i className={`pi ${item.icon} text-inherit`} style={{ fontSize: "1em" }} />
                )}
                <span>{displayLabel}</span>
                <Ripple />
              </Link>
            )}
          </div>
        ),
      };
    });
  }, [breadcrumbChain]);

  return (
    <div
      className={`flex items-center px-2 py-1 transition-all duration-300 md:px-4 md:py-2 ${theme === "dark" ? "bg-transparent" : "bg-transparent"} `}
    >
      <BreadCrumb
        model={items}
        className="m-0! border-none! bg-transparent! p-0! shadow-none!"
        pt={{
          root: { className: "!bg-transparent !border-none" },
          separator: {
            className: `mx-0! px-2 text-[0.65rem] md:text-xs flex items-center ${
              theme === "light" ? "text-[#bfbfbf]" : "text-[#595959]"
            }`,
          },
        }}
        separatorIcon="pi pi-angle-right"
      />
    </div>
  );
};

export default Breadcrumbs;
