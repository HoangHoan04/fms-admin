import type { PaginationDto } from "./common/base.dto";

export type NotifyColorType = "BLUE" | "GREEN" | "RED" | "YELLOW" | "ORANGE" | "PURPLE" | "GRAY";

export type NotifyCategory = "AUTH" | "SYSTEM" | "BOOKING" | "PAYMENT" | "PROMOTION" | "GENERAL";

export interface NotifyPayload {
  category?: NotifyCategory;
  colorType?: NotifyColorType;
  callbackUrl?: string;
  titleEn?: string;
  descriptionEn?: string;
  notifyPermissionType?: string;
}

export interface NotifyItem {
  id: string;
  userId: string;
  templateId?: string;
  title: string;
  body?: string;
  payload?: NotifyPayload;
  channel?: string;
  isRead: boolean;
  readAt?: string;
  sentAt?: string;
  failReason?: string;
  relatedEntityType?: string;
  relatedEntityId?: string;
  createdAt: string;
  createdBy?: string;
  updatedAt?: string;
  updatedBy?: string;
}

export interface NotifyFilterDto {
  userId?: string;
  isRead?: boolean;
  channel?: string;
  relatedEntityType?: string;
  relatedEntityId?: string;
}

export type NotifyPaginationDto = PaginationDto<NotifyFilterDto>;

export interface NotifyCountResponse {
  count: number;
}

export interface NotifyPaginationResponse {
  data: NotifyItem[];
  total: number;
}

export interface NotifyMessageResponse {
  message: string;
}

// ==================== NOTIFICATION TEMPLATE ====================

export interface NotifyTemplateDto {
  id: string;
  code: string;
  title: string;
  body?: string;
  channel?: string;
  eventType?: string;
  isDeleted: boolean;
  createdAt: string;
  createdBy?: string;
  updatedAt?: string;
  updatedBy?: string;
}

export interface CreateTemplateDto {
  code: string;
  title: string;
  body?: string;
  channel?: string;
  eventType?: string;
}

export interface UpdateTemplateDto extends CreateTemplateDto {
  id: string;
}

export interface TemplateFilterDto {
  code?: string;
  eventType?: string;
  isDeleted?: boolean;
}

export type TemplatePaginationDto = PaginationDto<TemplateFilterDto>;

export interface TemplatePaginationResponse {
  data: NotifyTemplateDto[];
  total: number;
}

// ==================== CREATE NOTIFICATION ====================

export interface CreateNotifyAdminDto {
  title: string;
  description: string;
  category: string;
  titleEn?: string;
  descriptionEn?: string;
  colorType?: string;
  callbackUrl?: string;
  notifyPermissionType?: string;
}

export interface CreateNotifyForUsersDto {
  title: string;
  body?: string;
  userIds: string[];
  channel?: string;
  payload?: Record<string, any>;
  relatedEntityType?: string;
  relatedEntityId?: string;
}

export interface SendFromTemplateDto {
  templateCode: string;
  userIds: string[];
  variables: Record<string, any>;
  payload?: Record<string, any>;
  relatedEntityType?: string;
  relatedEntityId?: string;
}

export interface RenderTemplateDto {
  templateCode: string;
  variables: Record<string, any>;
}

export interface RenderTemplateResultDto {
  templateCode: string;
  renderedTitle: string;
  renderedBody: string | null;
  channel?: string;
}
