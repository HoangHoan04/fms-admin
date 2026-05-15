import { useTheme } from "@/context";
import type { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div className={`flex h-screen w-full overflow-hidden ${isDark ? "bg-slate-950" : "bg-white"}`}>
      {/* Side trang trí - Left side */}
      <div className="relative hidden shrink-0 items-center justify-center overflow-hidden bg-[#0f5573] p-16 lg:flex lg:w-1/2">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-[-10%] left-[-10%] h-[70%] w-[70%] animate-pulse rounded-full bg-blue-400/30 blur-[120px]" />
          <div className="absolute right-[-10%] bottom-[-10%] h-[60%] w-[60%] rounded-full bg-cyan-400/20 blur-[100px]" />
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg stroke='%23ffffff' stroke-width='1'%3E%3Cpath d='M36 34v-4H20v4H16V20h4v4h16v-4h4v14h-4z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          ></div>
        </div>

        <div className="relative z-10 w-full max-w-lg text-white">
          <div className="mb-12 inline-block text-3xl font-bold tracking-tight uppercase">
            Hệ thống quản lý quỹ <br />
            <span className="text-cyan-300">Gia đình trẻ A3</span>
          </div>

          <div className="mb-10 space-y-4">
            <div className="h-1.5 w-24 rounded-full bg-linear-to-r from-cyan-400 to-transparent" />
            <p className="max-w-md text-xl leading-relaxed font-medium text-blue-100/90">
              Giải pháp tài chính minh bạch cho nhóm bạn thân.
              <span className="font-bold text-white"> Tiết kiệm chung </span>
              và quản lý dòng tiền hiệu quả mỗi tháng.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {/* Feature 1 */}
            <div className="group flex cursor-default items-center gap-5 rounded-4xl border border-white/10 bg-white/5 p-5 shadow-lg backdrop-blur-md transition-all duration-500 hover:translate-x-2 hover:bg-white/10">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-cyan-300/30 bg-cyan-400/20 transition-transform group-hover:scale-110">
                <i className="pi pi-shield text-2xl text-cyan-300"></i>
              </div>
              <div>
                <h4 className="text-lg font-bold text-white">Minh bạch & Bảo mật</h4>
                <p className="text-sm text-blue-200">
                  Mọi giao dịch đóng tiền và giải ngân đều được lưu lịch sử chi tiết.
                </p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="group flex cursor-default items-center gap-5 rounded-4xl border border-white/10 bg-white/5 p-5 shadow-lg backdrop-blur-md transition-all duration-500 hover:translate-x-2 hover:bg-white/10">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-emerald-300/30 bg-emerald-400/20 transition-transform group-hover:scale-110">
                <i className="pi pi-check-circle text-2xl text-emerald-300"></i>
              </div>
              <div>
                <h4 className="text-lg font-bold text-white">Duyệt quỹ nhanh chóng</h4>
                <p className="text-sm text-blue-200">
                  Hệ thống tự động nhắc nhở và xử lý yêu cầu nhận quỹ đúng hạn.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-12 flex items-center gap-8 border-t border-white/10 pt-8 text-blue-200/60">
            <div className="flex -space-x-3">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="h-8 w-8 rounded-full border-2 border-[#0f5573] bg-slate-400"
                />
              ))}
              <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-[#0f5573] bg-cyan-500 text-[10px] font-bold text-white">
                A3
              </div>
            </div>
            <span className="text-sm font-semibold italic">
              Dành riêng cho thành viên nội bộ nhóm A3
            </span>
          </div>
        </div>
      </div>

      {/* Form login/register - Right side */}
      <div
        className={`flex h-full w-full flex-col overflow-y-auto lg:w-1/2 ${isDark ? "bg-slate-950" : "bg-white"}`}
      >
        <div className="flex p-6 font-bold text-[#0f5573] lg:hidden">QUỸ NHÓM A3</div>

        <div className="flex flex-1 items-center justify-center p-6 sm:p-12">
          <div className="animate-in fade-in slide-in-from-right-4 w-full max-w-140 duration-500">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
