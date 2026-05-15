import { type BaseDto } from "./common/base.dto";

export interface TransactionDto extends BaseDto {
  fundId: string;
  type: "INCOME" | "EXPENSE";
  amount: number;
  transactionDate: string;
  description?: string;
  fundName?: string;
}

export interface BalanceDto {
  fundId: string;
  fundName: string;
  currentBalance: number;
  totalIncome: number;
  totalExpense: number;
}

export interface TransactionFilterDto {
  fundId?: string;
  type?: string;
  startDate?: string;
  endDate?: string;
}
