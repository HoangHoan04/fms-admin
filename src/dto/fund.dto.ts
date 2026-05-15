import type { DisbursementDto } from ".";
import { type BaseDto, type FileDto } from "./common/base.dto";
import type { ContributionDto } from "./contribution.dto";
import type { EmployeeDto } from "./employee.dto";
import type { MemberDto } from "./member.dto";
import type { ReceiptDto } from "./receipt.dto";

export interface FundDto extends BaseDto {
  code: string;
  name: string;
  description?: string;
  contributionAmount: number;
  currency: string;
  cycleType: string;
  cycleDurationDays?: number;
  maxRecipientPerCycle: number;
  totalMembers?: number;
  status: string;
  startDate?: string;
  endDate?: string;
  managedBy?: string;
  manager?: { id: string; code: string; fullName: string };
  fundMembers?: FundMemberDto[];
}

export interface FundCycleDto extends BaseDto {
  fundId: string;
  code: string;
  name: string;
  cycleIndex: number;
  contributionAmount: number;
  totalExpected?: number;
  totalCollected?: number;
  totalPaidOut?: number;
  startDate?: string;
  endDate?: string;
  payoutDate?: string;
  status: string;
  note?: string;
  fund?: { id: string; code: string; name: string };
  fundName?: string;
  fundCode?: string;
  contributions?: any[];
}

export interface FundMemberDto extends BaseDto {
  fundId?: string;
  fund?: FundDto;
  memberId: string;
  member?: MemberDto;
  joinDate?: Date;
  leaveDate?: Date;
  status?: string;
  note?: string;
  contributions?: ContributionDto[];
  receiptHistories?: ReceiptDto[];
  fundReceipts?: FundReceiptDto[];
}

export interface FundReceiptDto extends BaseDto {
  cycleId: string;
  cycle: FundCycleDto;
  fundMemberId: string;
  fundMember: FundMemberDto;
  code: string;
  reason?: string;
  requestedAmount: number;
  approvedAmount?: number;
  priority: number;
  status: string;
  submittedAt?: Date;
  reviewedAt?: Date;
  reviewedBy?: string;
  reviewer?: EmployeeDto;
  reviewNote?: string;
  rejectedReason?: string;
  bankName?: string;
  bankAccountNo?: string;
  bankAccountName?: string;
  documents: FileDto[];
  approvals: FundReceiptApprovalDto[];
  disbursements: DisbursementDto[];
}

export interface FundReceiptApprovalDto extends BaseDto {
  receiptId: string;
  receipt: FundReceiptDto;
  fromStatus?: string;
  toStatus: string;
  actionBy?: string;
  actor?: any;
  actionNote?: string;
  actionAt?: Date;
}

export interface CreateFundDto {
  name: string;
  description?: string;
  contributionAmount: number;
  cycleType: string;
  cycleDurationDays?: number;
  maxRecipientPerCycle?: number;
  totalMembers?: number;
  startDate?: string;
  endDate?: string;
  managedBy?: string;
  members?: FundMemberDto[];
}

export interface UpdateFundDto extends CreateFundDto {
  id: string;
}

export interface CreateFundCycleDto {
  fundId: string;
  name: string;
  cycleIndex: number;
  contributionAmount: number;
  totalExpected?: number;
  startDate?: string;
  endDate?: string;
  payoutDate?: string;
  note?: string;
}

export interface UpdateFundCycleDto extends Partial<CreateFundCycleDto> {
  id: string;
  status?: string;
  totalCollected?: number;
  totalPaidOut?: number;
  note?: string;
}

export interface FundCycleFilterDto {
  fundId?: string;
  code?: string;
  name?: string;
  status?: string;
  isDeleted?: boolean;
}

export interface FundFilterDto {
  name?: string;
  code?: string;
  status?: string;
  isDeleted?: boolean;
}
