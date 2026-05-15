import LoginForm from "@/components/auth/LoginForm";
import { useTheme } from "@/context/ThemeContext";

export default function LoginPage() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div
      className={`flex min-h-screen overflow-hidden font-['DM_Sans'] ${
        isDark ? "bg-[#0a0a0f]" : "bg-[#f0f4ff]"
      }`}
    >
      <div
        className={`relative hidden flex-1 items-center justify-center overflow-hidden p-16 md:flex ${
          isDark
            ? "bg-linear-to-br from-[#0d0d1a] via-[#0f1628] to-[#0a1020]"
            : "bg-linear-to-br from-[#e8eeff] via-[#dde6ff] to-[#e0f0ff]"
        }`}
      >
        <div
          className="absolute inset-0 z-0 opacity-20"
          style={{
            backgroundImage: `linear-gradient(rgba(99, 102, 241, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(99, 102, 241, 0.1) 1px, transparent 1px)`,
            backgroundSize: "48px 48px",
          }}
        />

        <div className="absolute -top-20 -left-20 h-105 w-105 animate-pulse rounded-full bg-indigo-600/30 blur-[80px]" />
        <div className="absolute -right-15 -bottom-15 h-75 w-75 animate-pulse rounded-full bg-cyan-600/30 blur-[80px] delay-700" />

        <div className="relative z-10 w-full max-w-105 space-y-12">
          <div className="flex items-center gap-3">
            <i className="pi pi-sparkles text-[22px] text-[#818cf8]" />
            <span className="font-['Syne'] text-xl font-extrabold tracking-[0.12em] uppercase">
              Fms
            </span>
          </div>

          <div className="space-y-4">
            <h2
              className={`font-['Syne'] text-4xl leading-tight font-bold md:text-5xl ${
                isDark ? "text-white" : "text-[#1e1e3f]"
              }`}
            >
              Hệ thống luyện thi
              <br />
              Aptis Online.
            </h2>
            <p
              className={`text-base leading-relaxed ${
                isDark ? "text-[#94a3b8]" : "text-[#4a5568]"
              }`}
            >
              Hệ thống quản lý luyện thi chuyên nghiệp, hiện đại và tối ưu cho học viên.
            </p>
          </div>

          <div className="flex gap-4 opacity-40">
            <div className="h-1.5 w-12 rounded-full bg-indigo-500" />
            <div className="h-1.5 w-12 rounded-full bg-cyan-500" />
            <div className="h-1.5 w-12 rounded-full bg-indigo-500/30" />
          </div>
        </div>
      </div>

      <div
        className={`flex w-full items-center justify-center p-10 md:w-120 md:p-12 ${
          isDark ? "bg-[#1a1a2e]" : "bg-white"
        }`}
      >
        <LoginForm />
      </div>
    </div>
  );
}
