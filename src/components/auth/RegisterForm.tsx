import { FacebookIcon, GoogleIcon } from "@/assets/icons";
import { ROUTES } from "@/common/constants";
import { useTheme, useToast } from "@/context";
import { useRouter } from "@/routers/hooks";
import { tokenCache, validators } from "@/utils";
import { Button } from "primereact/button";
import { InputOtp } from "primereact/inputotp";
import { InputText } from "primereact/inputtext";
import { RadioButton } from "primereact/radiobutton";
import { Steps } from "primereact/steps";
import { useState } from "react";
import { Link } from "react-router-dom";
import { Divider, Field, SocialButton } from "..";
import { authService } from "../../services/auth.service";

export default function RegisterForm() {
  const router = useRouter();
  const { showToast } = useToast();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [activeStep, setActiveStep] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [registerData, setRegisterData] = useState({
    name: "",
    phone: "",
    email: "",
    gender: "MALE",
    password: "",
    confirmPassword: "",
    sendMethod: "EMAIL",
    otpCode: "",
  });

  const [errors, setErrors] = useState<any>({});

  const stepItems = [{ label: "Thông tin" }, { label: "Xác thực" }];

  const validateForm = () => {
    const newErrors: any = {};
    let isValid = true;

    if (validators.isEmpty(registerData.name)) {
      newErrors.name = "Vui lòng nhập họ và tên";
      isValid = false;
    }
    if (!validators.isValidPhone(registerData.phone)) {
      newErrors.phone = "Số điện thoại không hợp lệ";
      isValid = false;
    }
    if (!validators.isValidEmail(registerData.email)) {
      newErrors.email = "Email không đúng định dạng";
      isValid = false;
    }
    if (!validators.isValidPassword(registerData.password)) {
      newErrors.password = "Mật khẩu tối thiểu 6 ký tự";
      isValid = false;
    }
    if (registerData.password !== registerData.confirmPassword) {
      newErrors.confirmPassword = "Mật khẩu không khớp";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSendOTP = async () => {
    if (!validateForm()) return;
    setLoading(true);
    try {
      const method = registerData.sendMethod === "phone" ? "SMS" : "EMAIL";
      await authService.sendOtpMember({
        phone: registerData.phone,
        email: registerData.email,
        sendMethod: method,
      });
      showToast({
        type: "success",
        title: "Thành công",
        message: `OTP đã gửi qua ${registerData.sendMethod === "phone" ? "SMS" : "Email"}`,
      });
      setActiveStep(1);
    } catch (error: any) {
      showToast({
        type: "error",
        title: "Lỗi",
        message: error?.response?.data?.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    if (!registerData.otpCode || registerData.otpCode.length < 6) return;
    setLoading(true);
    try {
      const method = registerData.sendMethod === "phone" ? "SMS" : "EMAIL";
      await authService.registerMember({ ...registerData, sendMethod: method });

      const loginRes = (await authService.loginNormal({
        username: registerData.phone,
        password: registerData.password,
      })) as any;

      if (loginRes?.accessToken) {
        tokenCache.setAuthData(loginRes.accessToken, loginRes.refreshToken, loginRes.user);
        showToast({
          type: "success",
          title: "Thành công",
          message: "Đăng ký hoàn tất!",
        });
        router.push(ROUTES.MAIN.HOME.path);
      }
    } catch (error: any) {
      showToast({
        type: "error",
        title: "Lỗi",
        message: error?.response?.data?.message || "Đăng ký thất bại",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex w-full flex-col">
      <div className="mb-6">
        <h3 className={`m-0 mb-2 text-4xl font-bold ${isDark ? "text-white" : "text-slate-800"}`}>
          Đăng ký
        </h3>
        <p className={`font-medium ${isDark ? "text-slate-400" : "text-slate-500"}`}>
          Tham gia cộng đồng học thuật <span className="font-bold text-blue-600">LingoArena</span>
        </p>
      </div>

      <div className="mb-8 origin-left scale-95">
        <Steps model={stepItems} activeIndex={activeStep} readOnly className="custom-steps-small" />
      </div>

      {activeStep === 0 ? (
        <div className="animate-in fade-in slide-in-from-right-4 flex flex-col gap-4 duration-500">
          <Field label="Họ và tên" error={errors.name} required>
            <div className="relative">
              <InputText
                value={registerData.name}
                onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })}
                placeholder="Nguyễn Văn A"
                className={`w-full rounded-xl border-none py-3 pl-10 transition-all focus:ring-2 focus:ring-blue-500 ${isDark ? "bg-slate-900" : "bg-slate-50"} ${errors.name ? "ring-2 ring-red-500" : ""}`}
              />
            </div>
          </Field>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Field label="Số điện thoại" error={errors.phone} required>
              <div className="relative">
                <InputText
                  value={registerData.phone}
                  onChange={(e) => setRegisterData({ ...registerData, phone: e.target.value })}
                  placeholder="0912345678"
                  className={`w-full rounded-xl border-none py-3 pl-10 ${isDark ? "bg-slate-900" : "bg-slate-50"}`}
                />
              </div>
            </Field>
            <Field label="Email" error={errors.email} required>
              <div className="relative">
                <InputText
                  value={registerData.email}
                  onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                  placeholder="name@example.com"
                  className={`w-full rounded-xl border-none py-3 pl-10 ${isDark ? "bg-slate-900" : "bg-slate-50"}`}
                />
              </div>
            </Field>
          </div>

          <Field label="Giới tính">
            <div
              className={`flex gap-6 rounded-xl p-2.5 ${isDark ? "bg-slate-900" : "bg-slate-50"}`}
            >
              {[
                { v: "MALE", l: "Nam" },
                { v: "FEMALE", l: "Nữ" },
                { v: "OTHER", l: "Khác" },
              ].map((g) => (
                <div
                  key={g.v}
                  className="flex grow cursor-pointer items-center justify-center gap-2"
                >
                  <RadioButton
                    inputId={g.v}
                    value={g.v}
                    checked={registerData.gender === g.v}
                    onChange={(e) => setRegisterData({ ...registerData, gender: e.value })}
                  />
                  <label
                    htmlFor={g.v}
                    className={`cursor-pointer text-sm font-bold ${isDark ? "text-slate-300" : "text-slate-600"}`}
                  >
                    {g.l}
                  </label>
                </div>
              ))}
            </div>
          </Field>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Field label="Mật khẩu" error={errors.password} required>
              <div className="relative">
                <InputText
                  type={showPassword ? "text" : "password"}
                  value={registerData.password}
                  onChange={(e) =>
                    setRegisterData({
                      ...registerData,
                      password: e.target.value,
                    })
                  }
                  placeholder="••••••"
                  className={`w-full rounded-xl border-none py-3 pl-10 ${isDark ? "bg-slate-900" : "bg-slate-50"}`}
                />
                <i
                  className={`pi ${showPassword ? "pi-eye-slash" : "pi-eye"} absolute top-1/2 right-4 -translate-y-1/2 cursor-pointer text-slate-400`}
                  onClick={() => setShowPassword(!showPassword)}
                />
              </div>
            </Field>
            <Field label="Xác nhận" error={errors.confirmPassword} required>
              <div className="relative">
                <InputText
                  type={showPassword ? "text" : "password"}
                  value={registerData.confirmPassword}
                  onChange={(e) =>
                    setRegisterData({
                      ...registerData,
                      confirmPassword: e.target.value,
                    })
                  }
                  placeholder="••••••"
                  className={`w-full rounded-xl border-none py-3 pl-10 ${isDark ? "bg-slate-900" : "bg-slate-50"}`}
                />
              </div>
            </Field>
          </div>

          <Field label="Nhận mã OTP qua:">
            <div className="flex gap-3">
              {[
                { m: "EMAIL", i: "pi-envelope", l: "Email" },
                { m: "phone", i: "pi-mobile", l: "SMS" },
              ].map((item) => (
                <div
                  key={item.m}
                  onClick={() => setRegisterData({ ...registerData, sendMethod: item.m })}
                  className={`flex flex-1 cursor-pointer items-center gap-2 rounded-xl border-2 p-3 text-sm font-bold transition-all ${registerData.sendMethod === item.m ? `border-blue-600 text-blue-600 ${isDark ? "bg-blue-900/20" : "bg-blue-50"}` : `${isDark ? "border-slate-800 text-slate-500" : "border-slate-100 text-slate-500"}`}`}
                >
                  <i className={`pi ${item.i}`}></i> {item.l}
                </div>
              ))}
            </div>
          </Field>

          <Button
            label={loading ? "Đang xử lý..." : "Tiếp tục"}
            className="mt-2 w-full rounded-2xl border-none bg-blue-600 py-4 font-bold shadow-xl shadow-blue-500/20"
            onClick={handleSendOTP}
            loading={loading}
          />

          <Divider className="py-2">Hoặc đăng nhập với</Divider>

          <div className="flex gap-3">
            <SocialButton icon={GoogleIcon} label="Google" />
            <SocialButton icon={FacebookIcon} label="Facebook" />
          </div>

          <p className="mt-4 text-center text-sm font-medium text-slate-500">
            Đã có tài khoản?
            <Link
              to={ROUTES.AUTH.LOGIN.path}
              className="ml-1! font-bold text-blue-600 hover:underline"
            >
              Đăng nhập ngay
            </Link>
          </p>
        </div>
      ) : (
        <div className="animate-in zoom-in-95 flex flex-col items-center gap-8 py-4 duration-300">
          <div className="text-center">
            <div
              className={`mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full border-4 shadow-lg ${isDark ? "border-slate-900 bg-blue-900/30" : "border-white bg-blue-100"}`}
            >
              <i className="pi pi-shield animate-pulse text-4xl text-blue-600"></i>
            </div>
            <h4
              className={`mb-2 text-2xl font-bold uppercase italic ${isDark ? "text-white" : "text-slate-800"}`}
            >
              Xác thực OTP
            </h4>
            <p className="text-sm text-slate-500">
              Mã 6 số đã được gửi đến: <br />
              <span className="font-bold text-blue-600">
                {registerData.sendMethod === "phone" ? registerData.phone : registerData.email}
              </span>
            </p>
          </div>

          <InputOtp
            value={registerData.otpCode}
            onChange={(e) => setRegisterData({ ...registerData, otpCode: e.value as string })}
            length={6}
            integerOnly
            pt={{
              input: {
                className: `w-12 h-14 text-2xl font-bold rounded-xl border-2 focus:border-blue-600 ${isDark ? "bg-slate-900 border-slate-700" : "border-slate-200"}`,
              },
            }}
          />

          <div className="flex w-full flex-col gap-3">
            <Button
              label={loading ? "Đang xử lý..." : "Hoàn tất đăng ký"}
              className="w-full rounded-2xl border-none bg-blue-600 py-4 font-bold shadow-lg shadow-blue-500/20"
              onClick={handleRegister}
              disabled={registerData.otpCode.length < 6}
              loading={loading}
            />
            <div className="flex flex-col gap-1">
              <Button
                label="Gửi lại mã"
                icon="pi pi-refresh"
                text
                className="text-sm font-bold text-blue-600"
                onClick={handleSendOTP}
              />
              <Button
                label="Quay lại sửa thông tin"
                icon="pi pi-arrow-left"
                outlined
                className="rounded-2xl border-slate-200 py-2 text-sm"
                onClick={() => setActiveStep(0)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
