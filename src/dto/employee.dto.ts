import { type BaseDto, type FileDto } from "./common/base.dto";

export interface EmployeeDto extends BaseDto {
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

export interface CreateEmployeeDto {
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

export interface UpdateEmployeeDto extends CreateEmployeeDto {
  id: string;
}

export interface EmployeeFilterDto {
  code?: string;
  fullName?: string;
  email?: string;
  phone?: string;
  gender?: string;
  isDeleted?: boolean | null;
}

export interface EmployeeSelectBoxDto {
  id: string;
  code: string;
  fullName: string;
}
