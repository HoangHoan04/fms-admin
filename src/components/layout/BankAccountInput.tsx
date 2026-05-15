import { type FormField, FormCustom } from "@/components/ui";
import type { MemberBankAccountDto } from "@/dto/member.dto";
import { Button } from "primereact/button";
import { useMemo } from "react";

let tempId = 0;
const nextId = () => `bank_${++tempId}_${Date.now()}`;

function BankAccountRow({
  value,
  onChange,
  onRemove,
  title = "Thông tin tài khoản ngân hàng",
}: {
  value: MemberBankAccountDto;
  onChange: (val: MemberBankAccountDto) => void;
  onRemove: () => void;
  title?: string;
}) {
  const initialValues = useMemo(
    () => ({
      bankName: value.bankName || "",
      bankAccountNo: value.bankAccountNo || "",
      bankAccountName: value.bankAccountName || "",
      qrCode: value.qrCode || [],
    }),
    [value.bankAccountName, value.bankAccountNo, value.bankName, value.qrCode],
  );

  const formFields = useMemo((): FormField[] => {
    return [
      {
        name: "bankName",
        label: "Tên ngân hàng",
        type: "input",
        required: true,
        placeholder: "Nhập tên ngân hàng",
      },
      {
        name: "bankAccountNo",
        label: "Số tài khoản",
        type: "input",
        required: true,
        placeholder: "Nhập số tài khoản",
      },
      {
        name: "bankAccountName",
        label: "Chủ tài khoản",
        type: "input",
        required: true,
        placeholder: "Nhập tên chủ tài khoản",
      },
      {
        name: "qrCode",
        label: "Mã QR",
        type: "image",
        isSingle: true,
        placeholder: "Nhập thông tin mã QR",
        gridColumn: "span 3",
      },
    ];
  }, []);

  return (
    <div className="relative flex gap-3 rounded border border-gray-200 p-4">
      <div className="flex-1">
        <FormCustom
          title={title}
          showDivider={true}
          fields={formFields}
          initialValues={initialValues}
          showSubmitButton={false}
          gridColumns={3}
          onChangeValue={(vals: any) => onChange({ ...value, ...vals })}
        />
      </div>
      <div className="absolute top-2 right-4">
        <Button
          type="button"
          icon="pi pi-trash"
          severity="danger"
          text
          onClick={onRemove}
          tooltip="Xóa"
        />
      </div>
    </div>
  );
}

interface Props {
  value?: MemberBankAccountDto[];
  onChange?: (value: MemberBankAccountDto[]) => void;
}

function BankAccountInput({ value = [], onChange }: Props) {
  const addRow = () => {
    onChange?.([...value, { id: nextId() }]);
  };

  const removeRow = (id: string) => {
    onChange?.(value.filter((r) => r.id !== id));
  };

  const updateRow = (id: string, updated: MemberBankAccountDto) => {
    onChange?.(value.map((r) => (r.id === id ? updated : r)));
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex justify-end">
        <Button
          type="button"
          icon="pi pi-plus"
          label="Thêm ngân hàng"
          size="small"
          severity="info"
          outlined
          onClick={addRow}
        />
      </div>

      {value.map((row) => (
        <BankAccountRow
          key={row.id}
          value={row}
          onChange={(updated) => updateRow(row.id!, updated)}
          onRemove={() => removeRow(row.id!)}
        />
      ))}

      {value.length === 0 && (
        <p className="py-4 text-center text-sm text-gray-400 italic">
          Chưa có tài khoản ngân hàng nào. Nhấn "Thêm ngân hàng" để thêm.
        </p>
      )}
    </div>
  );
}

export { BankAccountInput };
