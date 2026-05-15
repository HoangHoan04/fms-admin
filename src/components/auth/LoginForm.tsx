import { FacebookIcon, GoogleIcon } from "@/assets/icons";
import { ROUTES } from "@/common/constants";
import { useTheme, useToast } from "@/context";
import { tokenCache, validators } from "@/utils";
import FacebookLogin from "@greatsumini/react-facebook-login";
import { useGoogleLogin } from "@react-oauth/google";
import { Button } from "primereact/button";
import { Checkbox } from "primereact/checkbox";
import { InputText } from "primereact/inputtext";
import { useState } from "react";
import { Link } from "react-router-dom";
import { Divider, Field, SocialButton } from "..";
import { authService } from "../../services/auth.service";

export default function LoginForm() {
  const { showToast } = useToast();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({ username: "", password: "" });

  const handleLoginSuccess = async (data: any) => {
    if (data?.accessToken) {
      tokenCache.setAuthData(data.accessToken, data.refreshToken, data.user);
      const userInfoRes = await authService.getMe();
      if (userInfoRes && userInfoRes.user) {
        tokenCache.updateUser(userInfoRes.user);
      }

      showToast({
        type: "success",
        title: "Thành công",
        message: "Đăng nhập thành công",
      });

      window.location.href = ROUTES.MAIN.HOME.path;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let valid = true;
    const newErrors = { username: "", password: "" };

    if (validators.isEmpty(username)) {
      newErrors.username = "Vui lòng nhập tài khoản";
      valid = false;
    }
    if (validators.isEmpty(password)) {
      newErrors.password = "Vui lòng nhập mật khẩu";
      valid = false;
    }
    setErrors(newErrors);

    if (!valid) return;

    setLoading(true);
    try {
      const res: any = await authService.loginNormal({ username, password });
      if (res && res.accessToken) {
        handleLoginSuccess(res);
      } else {
        showToast({
          type: "error",
          title: "Lỗi",
          message: res?.message || "Đăng nhập thất bại",
        });
      }
    } catch (error: any) {
      showToast({
        type: "error",
        title: "Lỗi",
        message: error?.response?.data?.message || "Có lỗi xảy ra",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const res: any = await authService.loginWithGoogle({
          idToken: tokenResponse.access_token,
        });
        if (res && res.accessToken) handleLoginSuccess(res);
      } catch (error: any) {
        showToast({
          type: "error",
          title: "Lỗi Google",
          message: `Đăng nhập Google thất bại ${error?.response?.data?.message || ""}`,
        });
      }
    },
  });

  const handleFacebookLogin = async (fbResponse: any) => {
    try {
      if (fbResponse?.accessToken) {
        const res: any = await authService.loginWithFacebook({
          accessToken: fbResponse.accessToken,
        });
        if (res && res.accessToken) handleLoginSuccess(res);
      }
    } catch (error: any) {
      showToast({
        type: "error",
        title: "Lỗi Facebook",
        message: `Đăng nhập Facebook thất bại ${error?.response?.data?.message || ""}`,
      });
    }
  };

  return (
    <div className="flex w-full flex-col">
      <div className="mb-8">
        <h3
          className={`m-0 mb-2 text-left text-4xl font-bold ${isDark ? "text-white!" : "text-slate-800!"}`}
        >
          Đăng nhập
        </h3>
        <p className={`font-medium ${isDark ? "text-slate-400" : "text-slate-500"}`}>
          Chào mừng bạn quay trở lại với hệ thống quản lý quỹ nhóm
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="animate-in fade-in slide-in-from-right-4 flex flex-col gap-5 duration-500"
      >
        <Field label="Tên đăng nhập" error={errors.username} required>
          <div className="relative">
            <InputText
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Email hoặc số điện thoại"
              className={`w-full rounded-2xl border-none py-3.5 pl-10 transition-all focus:ring-2 focus:ring-blue-500 ${isDark ? "bg-slate-900!" : "bg-slate-50!"} ${errors.username ? "ring-2 ring-red-500" : ""}`}
            />
          </div>
        </Field>

        <Field label="Mật khẩu" error={errors.password} required>
          <div className="relative">
            <InputText
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Nhập mật khẩu"
              className={`w-full rounded-2xl border-none py-3.5 pl-10 transition-all focus:ring-2 focus:ring-blue-500 ${isDark ? "bg-slate-900!" : "bg-slate-50!"} ${errors.password ? "ring-2 ring-red-500" : ""}`}
            />
            <i
              className={`pi ${showPassword ? "pi-eye-slash" : "pi-eye"} absolute top-1/2 right-4 -translate-y-1/2 cursor-pointer text-slate-400 transition-colors hover:text-blue-600`}
              onClick={() => setShowPassword(!showPassword)}
            />
          </div>
        </Field>

        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <Checkbox
              inputId="rememberMe"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.checked || false)}
            />
            <label
              htmlFor="rememberMe"
              className={`cursor-pointer text-sm font-bold select-none ${isDark ? "text-slate-400!" : "text-slate-600!"}`}
            >
              Ghi nhớ đăng nhập
            </label>
          </div>
          <Link
            to={ROUTES.AUTH.FORGOT_PASSWORD.path}
            className="text-sm font-bold text-blue-600 hover:underline"
          >
            Quên mật khẩu?
          </Link>
        </div>

        <Button
          label={loading ? "Đang xử lý..." : "Đăng nhập ngay"}
          icon={!loading && "pi pi-arrow-right"}
          iconPos="right"
          disabled={loading}
          severity="info"
          size="small"
          className="mt-2 w-full rounded-2xl border-none py-4 text-lg font-bold shadow-xl shadow-blue-500/20 transition-all hover:bg-blue-700"
        />

        <Divider className="py-2">Hoặc đăng nhập với</Divider>

        <div className="flex gap-3">
          <SocialButton icon={GoogleIcon} onClick={() => handleGoogleLogin()} label="GOOGLE" />
          <FacebookLogin
            appId={import.meta.env.VITE_FACEBOOK_APP_ID}
            scope="email,public_profile"
            onSuccess={handleFacebookLogin}
            render={({ onClick }) => (
              <SocialButton icon={FacebookIcon} onClick={onClick} label="FACEBOOK" />
            )}
          />
        </div>

        <p className="mt-6 ml-2 text-center text-sm font-medium text-slate-500">
          Chưa có tài khoản?
          <Link
            to={ROUTES.AUTH.REGISTER.path}
            className="ml-1! font-bold text-blue-600 hover:underline"
          >
            Đăng ký thành viên
          </Link>
        </p>
      </form>
    </div>
  );
}
