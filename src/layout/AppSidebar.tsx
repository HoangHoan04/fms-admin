import { ROUTES } from "@/common/constants/routes";
import { useConfig } from "@/context/ConfigContext";
import { useTheme } from "@/context/ThemeContext";
import { usePermission } from "@/hooks/layout/usePermission";
import { convertRoutesToMenuItems } from "@/utils";
import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

type AppSidebarProps = { collapsed: boolean };

type MenuItem = {
  key: string;
  path?: string;
  icon?: string;
  label: string;
  items?: MenuItem[];
  isShow?: boolean;
};

const checkIsActive = (item: MenuItem, currentPath: string): boolean => {
  if (item.path === ROUTES.MAIN.HOME.path && currentPath !== ROUTES.MAIN.HOME.path) return false;
  if (item.path === currentPath) return true;
  if (item.path && currentPath.startsWith(item.path)) return true;
  if (item.items) return item.items.some((child) => checkIsActive(child, currentPath));
  return false;
};

const getAllChildKeys = (item: MenuItem): string[] => {
  const keys: string[] = [];
  if (item.items) {
    item.items.forEach((child) => {
      keys.push(child.key);
      if (child.items) {
        keys.push(...getAllChildKeys(child));
      }
    });
  }
  return keys;
};

export default function AppSidebar({ collapsed }: AppSidebarProps) {
  const { theme } = useTheme();
  const { settings } = useConfig();
  const { hasPermission } = usePermission();
  const location = useLocation();
  const navigate = useNavigate();

  const [openKeys, setOpenKeys] = useState<string[]>([]);
  const [hoveredKey, setHoveredKey] = useState<string | null>(null);
  const isDark = theme === "dark";
  const menuItems = useMemo(
    () => convertRoutesToMenuItems(ROUTES.MAIN, hasPermission),
    [hasPermission],
  );

  useEffect(() => {
    if (collapsed) {
      setOpenKeys([]);
      return;
    }
    const keysToExpand: string[] = [];
    const findParents = (items: MenuItem[]) => {
      items.forEach((item) => {
        if (checkIsActive(item, location.pathname) && item.items) {
          keysToExpand.push(item.key);
          findParents(item.items);
        }
      });
    };
    findParents(menuItems);
    setOpenKeys((prev) => Array.from(new Set([...prev, ...keysToExpand])));
  }, [location.pathname, menuItems, collapsed]);

  const getParentKeys = (
    targetKey: string,
    items: MenuItem[],
    parents: string[] = [],
  ): string[] => {
    for (const item of items) {
      if (item.key === targetKey) {
        return parents;
      }
      if (item.items) {
        const found = getParentKeys(targetKey, item.items, [...parents, item.key]);
        if (found.length > 0 || item.items.some((child) => child.key === targetKey)) {
          return [...parents, item.key];
        }
      }
    }
    return [];
  };

  const handleToggleSubmenu = (key: string, item?: MenuItem) => {
    setOpenKeys((prev) => {
      const isOpen = prev.includes(key);

      if (settings.sidebarAccordion) {
        if (isOpen) {
          const childKeys = item ? getAllChildKeys(item) : [];
          return prev.filter((k) => childKeys.includes(k));
        } else {
          const parentKeys = getParentKeys(key, menuItems);
          return [...parentKeys, key];
        }
      }

      return isOpen ? prev.filter((k) => k !== key) : [...prev, key];
    });
  };

  const handleMenuClick = (item: MenuItem) => {
    if (item.items && item.items.length > 0 && !collapsed) {
      handleToggleSubmenu(item.key, item);
    } else if (item.path) {
      navigate(item.path);
    }
  };

  const renderCollapsedPopup = (item: MenuItem) => {
    if (!item.items || item.items.length === 0) return null;

    const isRightSidebar = settings.sidebarPosition === "right";

    return (
      <div
        className={`animate-in fade-in absolute top-0 z-9999 duration-200 ${
          isRightSidebar
            ? "slide-in-from-right-2 right-full pr-2"
            : "slide-in-from-left-2 left-full pl-2"
        }`}
      >
        <div
          className={`flex min-w-55 flex-col rounded-xl border py-2 shadow-2xl ${
            isDark ? "border-[#404040] bg-[#262626]" : "border-[#e0e6ed] bg-white"
          }`}
        >
          <div
            className={`mb-1 border-b px-4 py-2 text-[11px] font-bold tracking-wider uppercase opacity-50 ${
              isDark ? "border-[#404040] text-gray-400" : "border-[#eee] text-gray-500"
            }`}
          >
            {item.label}
          </div>
          <div className="flex flex-col gap-0.5 px-2">
            {item.items
              .filter((c) => c.isShow !== false)
              .map((child) => (
                <button
                  key={child.key}
                  onClick={() => child.path && navigate(child.path)}
                  className={`flex w-full items-center rounded-md px-3 py-2 text-left text-[13px] transition-colors ${
                    checkIsActive(child, location.pathname)
                      ? "bg-[#1890ff]/10 font-bold text-[#1890ff]"
                      : isDark
                        ? "text-gray-300 hover:bg-white/5 hover:text-[#1890ff]"
                        : "text-gray-700 hover:bg-black/5 hover:text-[#1890ff]"
                  }`}
                >
                  {child.label}
                </button>
              ))}
          </div>
        </div>
      </div>
    );
  };

  const renderMenuItems = (items: MenuItem[]) => {
    return items
      .filter((item) => item.isShow !== false)
      .map((item) => {
        const isActive = checkIsActive(item, location.pathname);
        const isOpen = openKeys.includes(item.key);
        const hasChildren = item.items && item.items.length > 0;
        const isHovered = hoveredKey === item.key;

        return (
          <div
            key={item.key}
            className="group relative w-full"
            onMouseEnter={() => collapsed && setHoveredKey(item.key)}
            onMouseLeave={() => collapsed && setHoveredKey(null)}
          >
            <div
              onClick={() => handleMenuClick(item)}
              className={`m-1 flex cursor-pointer items-center gap-3 rounded-lg font-medium transition-all duration-200 select-none ${
                collapsed ? "justify-center p-2.5" : "justify-start px-5 py-2.5"
              } ${
                isActive
                  ? isDark
                    ? "bg-[#1890ff]/15 font-semibold text-[#1890ff]"
                    : "bg-[#cfe8ff] font-semibold text-[#1890ff]"
                  : isDark
                    ? "text-[#b0b0b0] hover:bg-[#1890ff]/10 hover:text-[#1890ff]"
                    : "hover:bg-[#1890ff]/05 text-[#666] hover:text-[#1890ff]"
              } `}
            >
              {settings.showSidebarIcon && item.icon && (
                <i
                  className={`${item.icon} shrink-0 text-[18px] ${
                    isActive ? "text-[#1890ff]" : ""
                  }`}
                />
              )}

              {!collapsed && <span className="flex-1 truncate text-[13px]">{item.label}</span>}

              {hasChildren && !collapsed && (
                <i
                  className={`pi text-[11px] transition-transform duration-300 ${
                    isOpen ? "pi-chevron-up rotate-180" : "pi-chevron-down"
                  }`}
                />
              )}

              {collapsed && hasChildren && isHovered && renderCollapsedPopup(item)}
            </div>

            {hasChildren && isOpen && !collapsed && (
              <div
                className={`mt-1 ml-4 flex flex-col border-l transition-all duration-300 ${isDark ? "border-[#404040]" : "border-[#e0e6ed]"}`}
              >
                {renderMenuItems(item.items!)}
              </div>
            )}
          </div>
        );
      });
  };

  return (
    <div
      style={{
        width: collapsed ? `${settings.sidebarCollapsedWidth}px` : `${settings.sidebarWidth}px`,
        transition: "width 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
      }}
      className={`scrollbar-none z-50 flex h-screen flex-col border-r ${collapsed ? "overflow-visible" : "overflow-x-hidden overflow-y-auto"} ${
        isDark ? "border-[#404040] bg-[#1f1f1f]" : "border-[#e0e6ed] bg-[#e6f2ff]"
      } `}
    >
      <div className="flex h-24 shrink-0 items-center justify-center gap-2.5 p-6">
        <div
          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-transform duration-300 hover:scale-110 ${isDark ? "bg-white/10" : "bg-blue-500/20"}`}
        >
          <i className="pi pi-sparkles text-blue-400" />
        </div>

        {!collapsed && (
          <Link
            to={ROUTES.MAIN.HOME.path}
            className={`font-['Syne'] text-xl font-extrabold tracking-[0.18em] whitespace-nowrap uppercase transition-all duration-300 select-none ${isDark ? "text-white" : "text-[#1a2a4a]"}`}
            style={{
              letterSpacing: "0.18em",
              background: isDark
                ? "linear-gradient(90deg, #38bdf8, #818cf8)"
                : "linear-gradient(90deg, #2563eb, #4f46e5)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Fms
          </Link>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-0 p-2">{renderMenuItems(menuItems)}</div>
    </div>
  );
}
