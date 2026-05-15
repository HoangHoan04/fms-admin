import { type BaseDto, type FileDto } from "./common/base.dto";

export interface MemberDto extends BaseDto {
  userId: string;
  code: string;
  fullName: string;
  email: string;
  gender?: string;
  phone?: string;
  birthday?: Date;
  avatarUrl?: string;
  bio?: string;
  specialties?: string;
  certifications?: string;
  yearsExperience?: number;
  user: any;
  avatar: FileDto[];
}

export interface CreateMemberDto {
  userId?: string;
  code?: string;
  fullName: string;
  email: string;
  phone?: string;
  birthday?: Date;
  gender?: string;
  bio?: string;
  specialties?: string;
  certifications?: string;
  yearsExperience?: number;
  avatar?: FileDto[];
}

export interface UpdateMemberDto extends CreateMemberDto {
  id: string;
}

export interface MemberFilterDto {
  code?: string;
  fullName?: string;
  email?: string;
  phone?: string;
  gender?: string;
  isDeleted?: boolean | null;
}

export interface MemberSelectBoxDto {
  id: string;
  code: string;
  fullName: string;
}
