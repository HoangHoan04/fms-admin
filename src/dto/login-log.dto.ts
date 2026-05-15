import { type BaseDto } from "./common/base.dto";

export interface LoginLogDto extends BaseDto {
  userId: string;
  username?: string;
  loginProvider: string;
  status: string;
  failReason?: string;
  ipAddress?: string;
  userAgent?: string;
  loggedInAt?: string;
}

export interface LoginLogFilterDto {
  userId?: string;
  status?: string;
  loginProvider?: string;
}
