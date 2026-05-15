import { type BaseDto } from "./common/base.dto";

export interface ContributionDto extends BaseDto {
  fundId?: string;
  fundName?: string;
  memberId?: string;
  memberName?: string;
  cycleId: string;
  fundMemberId: string;
  amount: number;
  requiredAmount: number;
  paidAt?: string;
  contributionDate?: string;
  dueDate?: string;
  paymentMethod?: string;
  transactionRef?: string;
  proofFileId?: string;
  status: string;
  isConfirmed?: boolean;
  isLate: boolean;
  lateDays: number;
  lateFee: number;
  confirmedBy?: string;
  note?: string;
  cycle?: { id: string; code: string; name: string; fundId: string };
  fundMember?: {
    id: string;
    memberId: string;
    joinDate?: string;
    member?: { id: string; code: string; fullName: string };
  };
  confirmer?: { id: string; code: string; fullName: string };
}

export interface CreateContributionDto {
  cycleId: string;
  fundMemberId: string;
  amount: number;
  requiredAmount: number;
  contributionDate?: string;
  dueDate?: string;
  paymentMethod?: string;
  transactionRef?: string;
  proofFileId?: string;
  note?: string;
}

export interface UpdateContributionDto extends Partial<CreateContributionDto> {
  id: string;
  status?: string;
  paidAt?: string;
  isConfirmed?: boolean;
}

export interface ConfirmContributionDto {
  id: string;
  amount?: number;
  paymentMethod?: string;
  transactionRef?: string;
  note?: string;
}

export interface ContributionFilterDto {
  fundId?: string;
  memberId?: string;
  cycleId?: string;
  fundMemberId?: string;
  status?: string;
  isLate?: boolean;
}
