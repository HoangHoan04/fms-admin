import { type FormField, FormCustom } from "@/components/ui";
import { useMemberSelectBox } from "@/hooks/member";
import { Button } from "primereact/button";
import { useMemo } from "react";

let tempId = 0;
const nextId = () => `fm_${++tempId}_${Date.now()}`;

export interface FundMemberEntry {
  id: string;
  memberId: string;
  note?: string;
  memberCode?: string;
  memberName?: string;
}

function FundMemberRow({
  value,
  memberOptions,
  onChange,
  onRemove,
  title = "Thông tin thành viên",
}: {
  value: FundMemberEntry;
  memberOptions: { id: string; name: string; value: string }[];
  onChange: (val: FundMemberEntry) => void;
  onRemove: () => void;
  title?: string;
}) {
  const initialValues = useMemo(
    () => ({
      memberId: value.memberId || "",
      note: value.note || "",
    }),
    [value.memberId, value.note],
  );

  const selectedMemberLabel = useMemo(() => {
    const matchedOption = memberOptions.find((option) => option.value === value.memberId);
    if (matchedOption) return matchedOption.name;
    if (value.memberCode || value.memberName) {
      return [value.memberCode, value.memberName].filter(Boolean).join(" - ");
    }
    return "";
  }, [memberOptions, value.memberCode, value.memberId, value.memberName]);

  const formFields = useMemo((): FormField[] => {
    return [
      {
        name: "memberId",
        label: "Thành viên",
        type: "select",
        required: true,
        placeholder: "Chọn thành viên",
        options: memberOptions,
        showSearch: true,
      },
      {
        name: "note",
        label: "Ghi chú",
        type: "input",
        placeholder: "Ghi chú (không bắt buộc)",
      },
    ];
  }, [memberOptions]);

  return (
    <div className="relative flex gap-3 rounded border border-gray-200 p-4">
      <div className="flex-1">
        <FormCustom
          title={title}
          showDivider={true}
          fields={formFields}
          initialValues={initialValues}
          showSubmitButton={false}
          gridColumns={2}
          onChangeValue={(vals: any) => onChange({ ...value, ...vals })}
        />
        {selectedMemberLabel && (
          <p className="mt-2 text-xs text-gray-500">
            Đã chọn: <span className="font-medium text-gray-700">{selectedMemberLabel}</span>
          </p>
        )}
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
  value?: FundMemberEntry[];
  onChange?: (value: FundMemberEntry[]) => void;
}

function FundMembersInput({ value = [], onChange }: Props) {
  const { data: members, isLoading } = useMemberSelectBox();

  const addRow = () => {
    onChange?.([...value, { id: nextId(), memberId: "", note: "" }]);
  };

  const removeRow = (id: string) => {
    onChange?.(value.filter((r) => r.id !== id));
  };

  const updateRow = (id: string, updated: FundMemberEntry) => {
    onChange?.(value.map((r) => (r.id === id ? updated : r)));
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex justify-end">
        <Button
          type="button"
          icon="pi pi-plus"
          label="Thêm thành viên"
          size="small"
          severity="info"
          outlined
          onClick={addRow}
          disabled={isLoading}
        />
      </div>

      {value.map((row) => (
        <FundMemberRow
          key={row.id}
          title={`Thành viên ${value.indexOf(row) + 1}`}
          value={row}
          memberOptions={
            members.map((m) => ({
              id: m.id,
              name: `${m.code} - ${m.fullName}`,
              value: m.id,
            })) || []
          }
          onChange={(updated) => updateRow(row.id!, updated)}
          onRemove={() => removeRow(row.id!)}
        />
      ))}

      {value.length === 0 && (
        <p className="py-4 text-center text-sm text-gray-400 italic">
          {isLoading
            ? "Đang tải danh sách thành viên..."
            : `Chưa có thành viên nào. Nhấn "Thêm thành viên" để thêm.`}
        </p>
      )}
    </div>
  );
}

export { FundMembersInput };
