import { BaseView } from "@/components/ui";
import { useTheme } from "@/context/ThemeContext";

export default function Dashboard() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <BaseView>
      <div className="flex flex-col gap-5">
        <div
          className={`rounded-xl px-6 py-5 ${
            isDark
              ? "bg-linear-to-r from-[#1e1b4b] to-[#1f1f1f]"
              : "bg-linear-to-r from-indigo-50 to-white"
          }`}
        >
          <h1 className={`text-xl font-bold ${isDark ? "text-white" : "text-gray-800"}`}>
            Xin chào, Admin!
          </h1>
          <p className={`mt-1 text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}>
            Đây là tổng quan hệ thống Fms của bạn hôm nay.
          </p>
        </div>
      </div>
    </BaseView>
  );
}
