import {
  type ActionConfirmRef,
  GlobalLoading,
  BaseView,
  StatusTag,
  RowActions,
  CommonActions,
  ActionConfirm,
} from "@/components/ui";
import { useEmployeeDetail, useActivateEmployee, useDeactivateEmployee } from "@/hooks/employee";
import { useRouter } from "@/routers/hooks";
import { PrimeIcons } from "primereact/api";
import { Card } from "primereact/card";
import { Divider } from "primereact/divider";
import { Tag } from "primereact/tag";
import { useRef } from "react";
import { useParams } from "react-router-dom";

const DetailRow = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <div className="mb-3 grid">
    <div className="col-12 md:col-3">
      <strong className="text-gray-700">{label}:</strong>
    </div>
    <div className="col-12 md:col-9">{value || "-"}</div>
  </div>
);

export default function DetailEmployeePage() {
  const { id } = useParams();
  const router = useRouter();
  const { data, isLoading, refetch } = useEmployeeDetail(id);
  const { onActivateEmployee } = useActivateEmployee();
  const { onDeactivateEmployee } = useDeactivateEmployee();

  const activateConfirmRef = useRef<ActionConfirmRef>(null);
  const deactivateConfirmRef = useRef<ActionConfirmRef>(null);

  const handleActivate = async () => {
    if (!data?.id) return;
    await onActivateEmployee(data.id);
    refetch();
  };

  const handleDeactivate = async () => {
    if (!data?.id) return;
    await onDeactivateEmployee(data.id);
    refetch();
  };

  const handleBack = () => router.back();

  if (isLoading) return <GlobalLoading />;
  if (!data)
    return (
      <BaseView>
        <Card>
          <p>Không tìm thấy nhân viên</p>
        </Card>
      </BaseView>
    );

  return (
    <BaseView>
      <Card
        title={
          <div className="align-items-center justify-content-between flex">
            <span>Chi tiết nhân viên</span>
            <StatusTag
              severity={data.isDeleted ? "danger" : "success"}
              value={data.isDeleted ? "Ngừng hoạt động" : "Đang hoạt động"}
            />
          </div>
        }
      >
        <div className="mb-4">
          <RowActions
            actions={[
              { ...CommonActions.cancel(handleBack), label: "Quay lại" },
              {
                ...CommonActions.update(() =>
                  router.push(`/main/employee-manager/employee/edit/${data.id}`),
                ),
                label: "Chỉnh sửa",
                visible: !data.isDeleted,
              },
              {
                key: "activate",
                label: "Kích hoạt",
                icon: PrimeIcons.CHECK_CIRCLE,
                severity: "success",
                visible: !!data.isDeleted,
                onClick: () => activateConfirmRef.current?.show(),
              },
              {
                key: "deactivate",
                label: "Ngừng hoạt động",
                icon: PrimeIcons.BAN,
                severity: "warning",
                visible: !data.isDeleted,
                onClick: () => deactivateConfirmRef.current?.show(),
              },
            ]}
            justify="start"
            gap="medium"
          />
        </div>

        <Divider />

        <div className="mb-4">
          <h3 className="mb-3 text-xl font-semibold">Thông tin cơ bản</h3>
          <DetailRow
            label="Mã nhân viên"
            value={<Tag value={data.code} severity="info" style={{ fontWeight: 600 }} />}
          />
          <DetailRow label="Họ và tên" value={data.fullName} />
          <DetailRow label="Email" value={data.email} />
          <DetailRow label="Số điện thoại" value={data.phone} />
          <DetailRow label="Giới tính" value={data.gender} />
          <DetailRow
            label="Ngày sinh"
            value={data.birthday ? new Date(data.birthday).toLocaleDateString("vi-VN") : "-"}
          />
          <DetailRow label="Giới thiệu" value={data.bio} />
        </div>

        <Divider />

        <div className="mb-4">
          <h3 className="mb-3 text-xl font-semibold">Thông tin hệ thống</h3>
          <DetailRow label="Ngày tạo" value={new Date(data.createdAt).toLocaleString("vi-VN")} />
          <DetailRow
            label="Ngày cập nhật"
            value={data.updatedAt ? new Date(data.updatedAt).toLocaleString("vi-VN") : "-"}
          />
        </div>
      </Card>

      <ActionConfirm
        ref={activateConfirmRef}
        title="Xác nhận kích hoạt nhân viên"
        message="Bạn có chắc chắn muốn kích hoạt nhân viên này không?"
        confirmText="Kích hoạt"
        cancelText="Hủy"
        onConfirm={handleActivate}
      />
      <ActionConfirm
        ref={deactivateConfirmRef}
        title="Xác nhận ngừng hoạt động"
        message="Bạn có chắc chắn muốn ngừng hoạt động nhân viên này không?"
        confirmText="Ngừng hoạt động"
        cancelText="Hủy"
        onConfirm={handleDeactivate}
      />
    </BaseView>
  );
}
