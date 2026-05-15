import { useTheme } from "@/context/ThemeContext";
import type { ReactNode } from "react";

interface DividerProps {
  children?: ReactNode;
  className?: string;
}

function Divider({ children, className = "" }: DividerProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  return (
    <div className={`relative flex w-full items-center py-6 ${className}`}>
      <div
        className={`h-px grow bg-linear-to-r from-transparent ${isDark ? "via-slate-700 to-slate-700" : "via-slate-200 to-slate-200"}`}
      ></div>
      {children && (
        <div className="relative mx-4 shrink">
          <div
            className={`relative z-10 flex items-center gap-2 rounded-full border ${isDark ? "border-white/10 bg-slate-900" : "border-slate-200 bg-white"} px-4 py-1 shadow-sm`}
          >
            <div
              className={`flex items-center gap-2 text-[13px] leading-none font-medium whitespace-nowrap ${isDark ? "text-slate-400" : "text-slate-500"}`}
            >
              {children}
            </div>
          </div>
        </div>
      )}
      <div
        className={`h-px grow bg-linear-to-l from-transparent ${isDark ? "via-slate-700 to-slate-700" : "via-slate-200 to-slate-200"}`}
      ></div>
    </div>
  );
}

export { Divider };
