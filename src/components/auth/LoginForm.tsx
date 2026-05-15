import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { useToast } from "@/context/ToastContext";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { useState } from "react";

export default function LoginForm() {
  const [form, setForm] = useState({
    username: "",
    password: "",
    remember: false,
  });
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();
  const { showToast } = useToast();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);

    if (!form.username || !form.password) {
      showToast({
        type: "error",
        timeout: 3000,
        message: "Vui lòng điền đầy đủ thông tin đăng nhập.",
        title: "Lỗi đăng nhập",
      });
      return;
    }

    setIsLoading(true);
    try {
      await login({ username: form.username, password: form.password });
    } catch (err: any) {
      showToast({
        type: "error",
        timeout: 3000,
        message: "Đăng nhập thất bại. Vui lòng kiểm tra lại.",
        title: "Lỗi đăng nhập",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-96">
      <div className="mb-10">
        <h1 className={`mb-2 text-3xl font-bold ${isDark ? "text-white" : "text-slate-900"}`}>
          Chào mừng trở lại
        </h1>
        <p className={`text-sm ${isDark ? "text-slate-400" : "text-slate-500"}`}>
          Nhập thông tin quản trị để tiếp tục
        </p>
      </div>

      <form onSubmit={handleLogin} className="space-y-8">
        <div className="flex flex-col gap-1.5">
          <label className="font-['DM_Sans']! text-sm font-extrabold! tracking-widest text-indigo-500 uppercase">
            Tên người dùng
          </label>
          <InputText
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
            placeholder="Nhập username"
            className={`w-full! rounded-none! border-t-0! border-r-0! border-b-[1.5px]! border-l-0! bg-transparent! px-0! py-2! shadow-none! transition-colors focus:border-indigo-500! ${
              submitted && !form.username
                ? "border-red-500!"
                : isDark
                  ? "border-slate-600!"
                  : "border-slate-200!"
            }`}
          />
          {submitted && !form.username && (
            <small className="mt-1 text-[12px] text-red-500">Vui lòng nhập username.</small>
          )}
        </div>

        <div className="flex w-full flex-col gap-1.5">
          <label className="ml-1 font-['DM_Sans']! text-sm font-extrabold! tracking-[0.15em] text-indigo-500 uppercase">
            Mật khẩu
          </label>
          <Password
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            toggleMask
            feedback={false}
            placeholder="Vui lòng nhập mật khẩu"
            className="w-full"
            pt={{
              root: { className: "w-full flex relative" },
              input: {
                className: `w-96! !border-t-0 !border-l-0 !border-r-0 !border-b-[1.5px] !rounded-none !bg-transparent !px-0 !py-2 !shadow-none focus:!border-indigo-500 transition-colors ${
                  submitted && !form.password
                    ? "!border-red-500"
                    : isDark
                      ? "!border-slate-600"
                      : "!border-slate-200"
                }`,
              },
              showIcon: {
                className:
                  "absolute right-0 top-1/2 -translate-y-1/6 text-gray-400 cursor-pointer !shadow-none !outline-none",
              },
              hideIcon: {
                className:
                  "absolute right-0 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer !shadow-none !outline-none",
              },
            }}
          />
          {submitted && !form.password && (
            <small className="mt-1 text-[12px] font-medium text-red-500">
              Vui lòng nhập mật khẩu.
            </small>
          )}
        </div>

        <Button
          type="submit"
          label={isLoading ? "Đang thực hiện đăng nhập" : "Đăng nhập hệ thống"}
          loading={isLoading}
          className="w-full rounded-xl! border-none! bg-linear-to-r! from-blue-500! to-cyan-500! py-4! text-base! font-bold! text-white! shadow-[0_4px_20px_rgba(59,130,246,0.4)]! transition-all hover:scale-[1.01]!"
        />
      </form>
    </div>
  );
}
