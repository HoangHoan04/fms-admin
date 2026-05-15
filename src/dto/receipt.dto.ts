import { type BaseDto } from "./common/base.dto";

export interface ReceiptDto extends BaseDto {
  code: string;
  fundId: string;
  memberId: string;
  amount: number;
  receiptDate: string;
  note?: string;
  status: string;
  approvedAt?: string;
  approvedBy?: string;
  memberName?: string;
  fundName?: string;
}

export interface CreateReceiptDto {
  fundId: string;
  memberId: string;
  amount: number;
  receiptDate?: string;
  note?: string;
}

export interface ReceiptFilterDto {
  fundId?: string;
  status?: string;
  memberId?: string;
}
