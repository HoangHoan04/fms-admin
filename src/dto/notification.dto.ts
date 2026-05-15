import type { PaginationDto } from "./common/base.dto";

export type NotifyColorType = "BLUE" | "GREEN" | "RED" | "YELLOW" | "ORANGE" | "PURPLE" | "GRAY";

export type NotifyCategory = "AUTH" | "SYSTEM" | "BOOKING" | "PAYMENT" | "PROMOTION" | "GENERAL";

export interface NotificationItem {
  id: string;
  userId?: string;
  studentId?: string;
  teacherId?: string;
  title: string;
  description?: string;
  titleEn?: string;
  descriptionEn?: string;
  callbackUrl?: string;
  category: NotifyCategory;
  colorType: NotifyColorType;
  isSeen: boolean;
  isNotifyOffScreen: boolean;
  createdAt: string;
  createdBy?: string;
  updatedAt?: string;
  updatedBy?: string;
}

export interface NotifyCreateDto {
  lstStudentId?: string[];
  lstTeacherId?: string[];
  lstUserId?: string[];
  title: string;
  titleEn?: string;
  description: string;
  descriptionEn?: string;
  callbackUrl?: string;
  category: NotifyCategory;
  colorType?: NotifyColorType;
}

export interface NotifyCreateAdminDto {
  title: string;
  titleEn?: string;
  description: string;
  descriptionEn?: string;
  callbackUrl?: string;
  category: NotifyCategory;
  colorType?: NotifyColorType;
}

export interface NotifyUpdateSeenListDto {
  lstId: string[];
}

export interface NotifyFilterDto {
  userId?: string;
  studentId?: string;
  teacherId?: string;
  category?: NotifyCategory;
  colorType?: NotifyColorType;
  isSeen?: boolean;
  isNotifyOffScreen?: boolean;
}

export type NotifyPaginationDto = PaginationDto<NotifyFilterDto>;

export interface NotifyCountResponse {
  countAll: number;
}

export interface NotifyPaginationResponse {
  data: NotificationItem[];
  total: number;
}

export interface NotifyMessageResponse {
  message: string;
}
