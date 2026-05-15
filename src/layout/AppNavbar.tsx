import { Breadcrumbs, FullScreen, Notification } from "@/components";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { Avatar } from "primereact/avatar";
import { Button } from "primereact/button";
import { Menu } from "primereact/menu";
import type { MenuItem } from "primereact/menuitem";
import { type FC, useRef } from "react";

type AppNavbarProps = {
  collapsed: boolean;
  onToggleSidebar: () => void;
  onChangePassword: () => void;
  onLogout: () => void;
  onOpenSettings: () => void;
  showNotification?: boolean;
};

const AppNavbar: FC<AppNavbarProps> = ({
  collapsed,
  onToggleSidebar,
  onChangePassword,
  onLogout,
  onOpenSettings,
  showNotification = true,
}) => {
  const { theme } = useTheme();
  const menuRef = useRef<Menu>(null);
  const isDark = theme === "dark";
  const { user } = useAuth();

  const menuItems: MenuItem[] = [
    {
      label: "Đổi mật khẩu",
      icon: "pi pi-key",
      command: onChangePassword,
    },
    {
      label: "Đăng xuất",
      icon: "pi pi-sign-out",
      command: onLogout,
    },
  ];

  const displayUserName = user?.employee?.fullName || user?.username || "Guest";

  const displayRole =
    user?.roles && user.roles.length > 0
      ? user.roles[0].name
      : user?.isAdmin
        ? "Quản trị viên"
        : "Thành viên";

  const getAvatarUrl = () => {
    const avatarSource = user?.avatar || user?.employee?.avatar;
    if (avatarSource) {
      const avatarData = Array.isArray(avatarSource) ? avatarSource[0] : avatarSource;
      const url = avatarData?.fileUrl || avatarData?.url;
      if (url && /\.(heic|heif)$/i.test(url)) {
        return url.replace(/\.(heic|heif)$/i, ".jpg");
      }
      return url;
    }
  };

  const iconBtnClasses = `
    !w-6 !h-6 sm:!w-7 sm:!h-7 md:!w-8 md:!h-8 lg:!w-9 lg:!h-9 
    !p-0 !rounded-full !transition-all !duration-200 !border-none !shadow-none
    !text-[#1890ff] 
    ${
      isDark
        ? "hover:!bg-[#1890ff]/20 active:!bg-[#1890ff]/30"
        : "hover:!bg-[#1890ff]/10 active:!bg-[#1890ff]/20"
    }
    focus:!outline-none focus:!ring-2 focus:!ring-[#1890ff]/20
  `;

  return (
    <header
      className={`z-10 flex min-h-11 items-center border-b px-3 py-2 transition-all duration-300 sm:min-h-12 sm:px-4 md:min-h-14 ${
        isDark
          ? "border-[#404040] bg-linear-to-r from-[#1f1f1f] to-[#2a2a2a] shadow-[0_2px_8px_rgba(0,0,0,0.3)]"
          : "border-[#e0e6ed] bg-linear-to-r from-[#cfe8ff] to-[#e6f2ff] shadow-[0_2px_8px_rgba(0,0,0,0.1)]"
      } `}
    >
      <div className="flex w-full items-center justify-between gap-2 sm:gap-4">
        <div className="flex flex-1 items-center gap-2 overflow-hidden sm:gap-4">
          <Button
            icon={collapsed ? "pi pi-bars" : "pi pi-times"}
            onClick={onToggleSidebar}
            tooltip={collapsed ? "Mở menu" : "Đóng menu"}
            tooltipOptions={{ position: "bottom" }}
            className={iconBtnClasses}
            text
            style={{
              marginLeft: 5,
            }}
          />
          <div className="hidden sm:block">
            <Breadcrumbs theme={theme} />
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-1.5 sm:gap-3">
          <FullScreen />
          {showNotification && <Notification />}

          <Button
            icon="pi pi-cog"
            onClick={onOpenSettings}
            tooltip="Cài đặt"
            tooltipOptions={{ position: "bottom" }}
            className={iconBtnClasses}
            text
          />

          <Menu
            model={menuItems}
            popup
            ref={menuRef}
            className={`top-[60.1px]! mt-0! rounded-lg! border! py-0!`}
            pt={{
              menuitem: { className: "my-1 p-0" },
              action: () => ({
                className: `
                  flex items-center gap-3  py-2.5 mx-2 rounded-md text-[13px] font-medium 
                  hover:!text-[#1890ff]
                `,
              }),
              icon: () => ({
                className: `!text-base transition-colors `,
              }),
              separator: {
                className: `!h-[1px] !my-1 ${isDark ? "!bg-[#404040]" : "!bg-[#e0e6ed]"}`,
              },
            }}
          />

          <div
            className={
              "flex cursor-pointer items-center gap-2.5 rounded-full px-2 py-1 transition-all duration-200"
            }
            onClick={(e) => {
              e.stopPropagation();
              menuRef.current?.toggle(e);
            }}
          >
            <div className="hidden flex-col items-end leading-tight sm:flex">
              <span className={`text-[13px] font-bold ${isDark ? "text-white" : "text-[#262626]"}`}>
                {displayUserName}
              </span>
              <span
                className={`text-[10px] opacity-60 ${isDark ? "text-gray-400" : "text-gray-500"}`}
              >
                {displayRole}
              </span>
            </div>

            <Avatar
              image={getAvatarUrl()}
              shape="circle"
              className={`h-16! w-20! border-2! border-[#1890ff]! shadow-[0_2px_8px_rgba(24,144,255,0.2)]! sm:h-8! sm:w-8! md:h-9! md:w-9!`}
            />
          </div>
        </div>
      </div>
    </header>
  );
};

export default AppNavbar;
