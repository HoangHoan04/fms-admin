import { useTheme } from "@/context/ThemeContext";
import React from "react";

interface SocialButtonProps {
  icon: string;
  label?: string;
  onClick?: () => void;
}

const SocialButton: React.FC<SocialButtonProps> = ({ icon, label, onClick }) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={onClick}
      className={`group /* Kích thước cố định để đảm bảo cân đối khi có hoặc không có chữ */ relative flex min-h-15 flex-1 items-center justify-center overflow-hidden rounded-2xl border px-4 transition-all duration-500 active:scale-95 active:duration-100 ${
        isDark
          ? "border-white/5 bg-slate-900/40 text-slate-300 hover:border-cyan-400/20 hover:text-cyan-300 hover:drop-shadow-[0_0_15px_rgba(34,211,238,0.3)]"
          : "border-slate-100 bg-white text-slate-600 shadow-[0_4px_12px_rgba(0,0,0,0.03)] hover:border-blue-100 hover:text-blue-600 hover:shadow-xl hover:shadow-blue-500/10"
      } `}
    >
      <div className="absolute inset-0 -translate-y-full bg-linear-to-b from-transparent via-white/5 to-transparent opacity-0 transition-opacity duration-700 group-hover:translate-y-full group-hover:opacity-100" />
      <div className={`flex items-center justify-center ${label ? "gap-3" : "gap-0"}`}>
        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-all duration-300 ${isDark ? "bg-slate-950/80 group-hover:bg-cyan-500/10" : "bg-slate-50 group-hover:bg-blue-50"} `}
        >
          <img
            src={icon}
            alt={label || "social-icon"}
            className="h-5 w-5 object-contain transition-transform duration-300 group-hover:scale-110"
          />
        </div>

        {label && (
          <span className="text-sm font-bold tracking-tight whitespace-nowrap uppercase">
            {label}
          </span>
        )}
      </div>
    </button>
  );
};

export { SocialButton };
