import type {
  AuthResponse,
  ChangePasswordDto,
  CheckPhoneEmailDto,
  FacebookLoginDto,
  ForgotPasswordMemberDto,
  GoogleLoginDto,
  RefreshTokenDto,
  RegisterMemberDto,
  SendOtpMemberDto,
  SendOtpVerifyDto,
  UpdatePasswordDto,
  UserLoginDto,
  VerifyLoginOtpDto,
} from "@/dto";
import rootApiService from "./api.service";
import { API_ENDPOINTS } from "./endpoint";

export const authService = {
  /** Đăng nhập thông thường */
  loginNormal(data: UserLoginDto) {
    return rootApiService.post<AuthResponse>(API_ENDPOINTS.AUTH.LOGIN, data);
  },

  /** Đăng nhập Google */
  loginWithGoogle(data: GoogleLoginDto) {
    return rootApiService.post<AuthResponse>(API_ENDPOINTS.AUTH.LOGIN_GOOGLE, data);
  },

  /** Đăng nhập Facebook */
  loginWithFacebook(data: FacebookLoginDto) {
    return rootApiService.post<AuthResponse>(API_ENDPOINTS.AUTH.LOGIN_FACEBOOK, data);
  },

  /** Kiểm tra số điện thoại hoặc email tồn tại */
  checkPhoneEmail(data: CheckPhoneEmailDto): Promise<any> {
    return rootApiService.post(API_ENDPOINTS.AUTH.CHECK_PHONE_EMAIL, data);
  },

  /** Gửi OTP cho khách hàng mới (đăng ký) */
  sendOtpMember(data: SendOtpMemberDto): Promise<any> {
    return rootApiService.post(API_ENDPOINTS.AUTH.SEND_OTP, data);
  },

  /** Gửi OTP xác thực (quên mật khẩu / verify) */
  sendOtpVerify(data: SendOtpVerifyDto): Promise<any> {
    return rootApiService.post(API_ENDPOINTS.AUTH.SEND_OTP_VERIFY, data);
  },

  /** Đăng ký khách hàng mới */
  registerMember(data: RegisterMemberDto): Promise<any> {
    return rootApiService.post(API_ENDPOINTS.AUTH.REGISTER, data);
  },

  /** Quên mật khẩu */
  forgotPassword(data: ForgotPasswordMemberDto): Promise<any> {
    return rootApiService.post(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, data);
  },

  /** Xác thực OTP login */
  verifyLoginOtp(data: VerifyLoginOtpDto) {
    return rootApiService.post<AuthResponse>(API_ENDPOINTS.AUTH.VERIFY_OTP, data);
  },

  /** Làm mới token */
  refreshToken(data: RefreshTokenDto) {
    return rootApiService.post<AuthResponse>(API_ENDPOINTS.AUTH.REFRESH_TOKEN, data);
  },

  /** Cập nhật mật khẩu (khi đã login - có mật khẩu cũ) */
  updatePassword(data: UpdatePasswordDto): Promise<any> {
    return rootApiService.post(API_ENDPOINTS.AUTH.UPDATE_PASSWORD, data);
  },

  /** Đổi mật khẩu */
  changePassword(data: ChangePasswordDto): Promise<any> {
    return rootApiService.post(API_ENDPOINTS.AUTH.CHANGE_PASSWORD, data);
  },

  /** Lấy thông tin cá nhân */
  getMe(): Promise<any> {
    return rootApiService.post(API_ENDPOINTS.AUTH.ME);
  },

  /** Đăng xuất */
  logout(): Promise<any> {
    return rootApiService.post(API_ENDPOINTS.AUTH.LOGOUT);
  },
};
