import { useTheme } from "@/context/ThemeContext";
import { type FC } from "react";

type AppFooterProps = {
  visible?: boolean;
  content?: string;
  showVersion?: boolean;
  showCopyright?: boolean;
};

const AppFooter: FC<AppFooterProps> = ({
  visible = true,
  content = "",
  showVersion = true,
  showCopyright = true,
}) => {
  const { theme } = useTheme();

  if (!visible) return null;

  const isDark = theme === "dark";
  const currentYear = new Date().getFullYear();
  const defaultContent = content || "Hệ thống";

  return (
    <footer
      className={`mt-auto border-t transition-all duration-300 ease-in-out ${
        isDark
          ? "border-[#404040] bg-linear-to-r from-[#1a1a1a] to-[#262626]"
          : "border-[#e0e6ed] bg-linear-to-r from-[#ffffff] to-[#f8fafc]"
      } `}
    >
      <style>{`
        @keyframes fadeInLeft {
          from { opacity: 0; transform: translateX(-20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes fadeInRight {
          from { opacity: 0; transform: translateX(20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .animate-local-left { animation: fadeInLeft 0.5s ease-in-out; }
        .animate-local-right { animation: fadeInRight 0.5s ease-in-out; }
      `}</style>

      <div className="px-3 py-2 sm:px-4 md:py-3">
        <div
          className={`flex flex-col items-center justify-between gap-1.5 text-xs sm:flex-row sm:gap-4 md:text-[13px] ${isDark ? "text-[#b0b0b0]" : "text-[#666]"} `}
        >
          <div className="animate-local-left flex items-center gap-2 font-medium">
            <i className="pi pi-home text-base text-[#1890ff] transition-transform hover:scale-110"></i>
            <span>{defaultContent}</span>
          </div>

          <div className="animate-local-right flex flex-wrap items-center justify-center gap-2 sm:justify-end sm:gap-4">
            {showVersion && (
              <span className={`flex items-center gap-1 opacity-80`}>
                <i className="pi pi-info-circle text-[10px] text-[#1890ff]"></i>
                <span>Phiên bản 1.0.0</span>
              </span>
            )}

            {showCopyright && (
              <span className="opacity-80">
                © {currentYear} Fms. Bản quyền được bảo lưu.
              </span>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default AppFooter;
