import type { EmployeeDto, MemberDto } from ".";
import { type BaseDto, type FileDto } from "./common/base.dto";
import type { FundCycleDto, FundReceiptDto } from "./fund.dto";

export interface DisbursementDto extends BaseDto {
  receiptId: string;
  receipt: FundReceiptDto;
  cycleId: string;
  cycle: FundCycleDto;
  amount: number;
  disbursedAt?: Date;
  paymentMethod?: string;
  transactionRef?: string;
  proofFileId?: string;
  proofFile?: FileDto[];
  disbursedBy?: string;
  disburser?: EmployeeDto;
  bankName?: string;
  bankAccountNo?: string;
  bankAccountName?: string;
  note?: string;
  confirmations: DisbursementConfirmationDto[];
}

export interface CreateDisbursementDto {
  fundId: string;
  memberId: string;
  amount: number;
  disbursementDate?: string;
  note?: string;
}

export interface DisbursementFilterDto {
  fundId?: string;
  memberId?: string;
  isConfirmed?: boolean;
}

export interface DisbursementConfirmationDto extends BaseDto {
  disbursementId?: string;
  disbursement?: DisbursementDto;
  confirmedAt?: Date;
  confirmedBy?: string;
  confirmer?: MemberDto;
  proofFile?: FileDto[];
  note?: string;
}
