import { ROUTES } from "@/common/constants";
import { useTheme, useToast } from "@/context";
import { useForgotPassword, useSendOtpVerify } from "@/hooks/auth/useAuth";
import { useRouter } from "@/routers/hooks";
import { validators } from "@/utils";
import { Button } from "primereact/button";
import { InputOtp } from "primereact/inputotp";
import { InputText } from "primereact/inputtext";
import { Steps } from "primereact/steps";
import { useState } from "react";
import { Field } from "..";

export default function ForgotPasswordForm() {
  const router = useRouter();
  const { showToast } = useToast();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [activeStep, setActiveStep] = useState(0);
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    contact: "",
    otpCode: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState<any>({});

  const stepItems = [{ label: "Xác minh" }, { label: "OTP" }, { label: "Mật khẩu mới" }];

  // Xác định phương thức gửi (email hay phone)
  const isEmail = (val: string) => val.includes("@");
  const getMethod = (contact: string): "EMAIL" | "phone" => (isEmail(contact) ? "EMAIL" : "phone");

  const { mutate: sendOtpVerify, isPending: isSendingOtp } = useSendOtpVerify();
  const { mutate: resetPassword, isPending: isResetting } = useForgotPassword();

  const handleSendOTP = () => {
    if (validators.isEmpty(formData.contact)) {
      setErrors({ contact: "Vui lòng nhập Email hoặc Số điện thoại" });
      return;
    }
    setErrors({});

    sendOtpVerify(
      {
        identifier: formData.contact,
        method: getMethod(formData.contact),
      },
      {
        onSuccess: () => {
          showToast({
            type: "success",
            title: "Đã gửi mã OTP",
            message: `Mã xác thực đã được gửi tới ${formData.contact}`,
          });
          setActiveStep(1);
        },
        onError: (error: any) => {
          showToast({
            type: "error",
            title: "Lỗi",
            message: error?.response?.data?.message || "Không thể gửi mã OTP. Vui lòng thử lại.",
          });
        },
      },
    );
  };

  const handleVerifyOTP = () => {
    if (formData.otpCode.length < 6) return;
    // Chỉ chuyển sang bước đặt mật khẩu mới, OTP sẽ kèm theo khi gọi API reset
    setActiveStep(2);
  };

  const handleResetPassword = () => {
    const newErrors: any = {};
    if (!validators.isValidPassword(formData.newPassword)) {
      newErrors.newPassword = "Mật khẩu tối thiểu 6 ký tự";
    }
    if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = "Mật khẩu xác nhận không khớp";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setErrors({});

    resetPassword(
      {
        identifier: formData.contact,
        method: getMethod(formData.contact),
        otpCode: formData.otpCode,
        newPassword: formData.newPassword,
      },
      {
        onSuccess: () => {
          showToast({
            type: "success",
            title: "Thành công",
            message: "Mật khẩu đã được đặt lại. Vui lòng đăng nhập lại.",
          });
          router.push(ROUTES.AUTH.LOGIN.path);
        },
        onError: (error: any) => {
          showToast({
            type: "error",
            title: "Lỗi",
            message:
              error?.response?.data?.message ||
              "Đặt lại mật khẩu thất bại. Mã OTP có thể không đúng.",
          });
        },
      },
    );
  };

  return (
    <div className="flex w-full flex-col">
      <div className="mb-6">
        <h3 className={`m-0 mb-2 text-4xl font-bold ${isDark ? "text-white" : "text-slate-800"}`}>
          Quên mật khẩu
        </h3>
        <p className={`text-sm font-medium ${isDark ? "text-slate-400" : "text-slate-500"}`}>
          {activeStep === 0 && "Nhập thông tin để tìm lại tài khoản của bạn"}
          {activeStep === 1 && "Nhập mã xác thực chúng tôi vừa gửi"}
          {activeStep === 2 && "Thiết lập mật khẩu mới an toàn hơn"}
        </p>
      </div>

      <div className="mb-8 origin-left scale-95">
        <Steps model={stepItems} activeIndex={activeStep} readOnly className="custom-steps-small" />
      </div>

      <div className="flex flex-1 flex-col">
        {activeStep === 0 && (
          <div className="animate-in fade-in slide-in-from-right-4 flex flex-col gap-6 duration-500">
            <Field label="Email hoặc Số điện thoại" error={errors.contact} required>
              <div className="relative">
                <InputText
                  value={formData.contact}
                  onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                  placeholder="example@gmail.com hoặc 0912..."
                  className={`w-full rounded-2xl border-none py-3.5 pl-10 transition-all focus:ring-2 focus:ring-blue-500 ${isDark ? "bg-slate-900" : "bg-slate-50"} ${errors.contact ? "ring-2 ring-red-500" : ""}`}
                  onKeyDown={(e) => e.key === "Enter" && handleSendOTP()}
                />
              </div>
            </Field>

            <Button
              label={isSendingOtp ? "Đang gửi mã..." : "Tiếp tục xác thực"}
              icon={!isSendingOtp ? "pi pi-send" : undefined}
              iconPos="right"
              className="w-full rounded-2xl border-none bg-blue-600 py-4 text-lg font-bold shadow-xl shadow-blue-500/20"
              onClick={handleSendOTP}
              loading={isSendingOtp}
            />

            <Button
              label={"Quay lại đăng nhập"}
              icon={"pi pi-arrow-left"}
              iconPos="left"
              severity="info"
              size="small"
              text
              className="mt-2 w-full transition-colors hover:bg-transparent!"
              onClick={() => router.push(ROUTES.AUTH.LOGIN.path)}
            />
          </div>
        )}

        {activeStep === 1 && (
          <div className="animate-in zoom-in-95 flex flex-col items-center gap-8 duration-300">
            <div
              className={`w-full rounded-2xl border p-4 text-center ${isDark ? "border-blue-800 bg-blue-900/20" : "border-blue-100 bg-blue-50"}`}
            >
              <p className={`m-0 text-sm ${isDark ? "text-slate-400" : "text-slate-600"}`}>
                Mã OTP đã được gửi tới: <br />
                <b className={`${isDark ? "text-blue-400" : "text-blue-600"}`}>
                  {formData.contact}
                </b>
              </p>
            </div>

            <InputOtp
              value={formData.otpCode}
              onChange={(e) => setFormData({ ...formData, otpCode: e.value as string })}
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
                label="Xác thực mã OTP"
                className="w-full rounded-2xl border-none bg-blue-600 py-4 font-bold shadow-lg"
                onClick={handleVerifyOTP}
                disabled={formData.otpCode.length < 6}
              />
              <Button
                label="Gửi lại mã"
                icon="pi pi-refresh"
                text
                className="font-bold text-blue-600"
                onClick={handleSendOTP}
                loading={isSendingOtp}
              />
              <Button
                label="Thay đổi thông tin liên hệ"
                icon="pi pi-arrow-left"
                outlined
                className="rounded-2xl border-slate-200"
                onClick={() => setActiveStep(0)}
              />
            </div>
          </div>
        )}

        {activeStep === 2 && (
          <div className="animate-in fade-in slide-in-from-right-4 flex flex-col gap-5 duration-500">
            <Field label="Mật khẩu mới" error={errors.newPassword} required>
              <div className="relative">
                <i className="pi pi-lock absolute top-1/2 left-4 -translate-y-1/2 text-slate-400" />
                <InputText
                  type={showPassword ? "text" : "password"}
                  value={formData.newPassword}
                  onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                  placeholder="Nhập mật khẩu mới"
                  className={`w-full rounded-2xl border-none py-3.5 pr-10 pl-10 transition-all focus:ring-2 focus:ring-blue-500 ${isDark ? "bg-slate-900" : "bg-slate-50"} ${errors.newPassword ? "ring-2 ring-red-500" : ""}`}
                />
                <i
                  className={`pi ${showPassword ? "pi-eye-slash" : "pi-eye"} absolute top-1/2 right-4 -translate-y-1/2 cursor-pointer text-slate-400`}
                  onClick={() => setShowPassword(!showPassword)}
                />
              </div>
            </Field>

            <Field label="Xác nhận mật khẩu" error={errors.confirmPassword} required>
              <div className="relative">
                <i className="pi pi-lock absolute top-1/2 left-4 -translate-y-1/2 text-slate-400" />
                <InputText
                  type={showPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      confirmPassword: e.target.value,
                    })
                  }
                  placeholder="Nhập lại mật khẩu mới"
                  className={`w-full rounded-2xl border-none py-3.5 pl-10 transition-all focus:ring-2 focus:ring-blue-500 ${isDark ? "bg-slate-900" : "bg-slate-50"} ${errors.confirmPassword ? "ring-2 ring-red-500" : ""}`}
                />
              </div>
            </Field>

            <Button
              label={isResetting ? "Đang cập nhật..." : "Đổi mật khẩu ngay"}
              icon="pi pi-check-circle"
              className="w-full rounded-2xl border-none bg-blue-600 py-4 text-lg font-bold shadow-xl shadow-blue-500/20"
              onClick={handleResetPassword}
              loading={isResetting}
            />
          </div>
        )}
      </div>
    </div>
  );
}
