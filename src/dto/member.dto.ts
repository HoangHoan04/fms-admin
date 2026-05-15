import { type BaseDto, type FileDto } from "./common/base.dto";

export interface MemberBankAccountDto {
  id?: string;
  bankName?: string;
  bankAccountNo?: string;
  bankAccountName?: string;
  qrCode?: { fileName?: string; fileUrl?: string } | null;
}

export interface CreateMemberBankAccountDto {
  bankName?: string;
  bankAccountNo?: string;
  bankAccountName?: string;
  qrCode?: { fileName?: string; fileUrl?: string };
}

export interface MemberDto extends BaseDto {
  userId: string;
  user: any;
  code: string;
  fullName: string;
  shortName?: string;
  email: string;
  phone: string;
  gender?: string;
  birthday?: Date;
  description?: string;
  bankAccounts: MemberBankAccountDto[];
  avatar: FileDto[];
}

export interface CreateMemberDto {
  fullName: string;
  shortName?: string;
  email: string;
  phone: string;
  gender?: string;
  birthday?: Date;
  description?: string;
  bankAccounts?: CreateMemberBankAccountDto[];
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
