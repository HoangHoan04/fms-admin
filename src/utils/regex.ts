export const REGEX = {
  /** Regex cho SĐT Việt Nam: hỗ trợ 0x, 84x, +84x */
  PHONE: /(84|0[3|5|7|8|9])+([0-9]{8})\b/,

  /** Regex Email chuẩn RFC 5322 */
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,

  /** Mật khẩu: ít nhất 6 ký tự, có thể thêm yêu cầu chữ hoa/số nếu muốn */
  PASSWORD: /^.{6,}$/,

  /** Chỉ cho phép nhập số (cho OTP) */
  ONLY_NUMBER: /^\d+$/,
};

export const normalizePhoneNumber = (phone?: string): string => {
  if (!phone) return "";
  // +84377984957 → 0377984957
  if (phone.startsWith("+84")) return "0" + phone.slice(3);
  // 84377984957 → 0377984957
  if (phone.startsWith("84")) return "0" + phone.slice(2);
  // 0377984957 → giữ nguyên
  return phone;
};
