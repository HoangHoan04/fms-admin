import {
  type ActionConfirmRef,
  GlobalLoading,
  BaseView,
  StatusTag,
  RowActions,
  CommonActions,
  ActionConfirm,
} from "@/components/ui";
import {
  usePermissionDetail,
  useActivatePermission,
  useDeactivatePermission,
} from "@/hooks/permission";
import { useRouter } from "@/routers/hooks";
import { PrimeIcons } from "primereact/api";
import { Card } from "primereact/card";
import { Divider } from "primereact/divider";
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

export default function DetailPermissionPage() {
  const { id } = useParams();
  const router = useRouter();
  const { data, isLoading, refetch } = usePermissionDetail(id);
  const { onActivatePermission } = useActivatePermission();
  const { onDeactivatePermission } = useDeactivatePermission();

  const activateConfirmRef = useRef<ActionConfirmRef>(null);
  const deactivateConfirmRef = useRef<ActionConfirmRef>(null);

  const handleActivate = async () => {
    if (!data?.id) return;
    await onActivatePermission(data.id);
    refetch();
  };

  const handleDeactivate = async () => {
    if (!data?.id) return;
    await onDeactivatePermission(data.id);
    refetch();
  };

  const handleBack = () => router.back();

  if (isLoading) return <GlobalLoading />;
  if (!data)
    return (
      <BaseView>
        <Card>
          <p>Không tìm thấy quyền</p>
        </Card>
      </BaseView>
    );

  return (
    <BaseView>
      <Card
        title={
          <div className="align-items-center justify-content-between flex">
            <span>Chi tiết quyền</span>
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
          <DetailRow label="Mã quyền" value={data.code} />
          <DetailRow label="Tên quyền" value={data.name} />
          <DetailRow label="Module" value={data.module} />
          <DetailRow label="Hành động" value={data.action} />
          <DetailRow label="Mô tả" value={data.description} />
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
        title="Xác nhận kích hoạt quyền"
        message="Bạn có chắc chắn muốn kích hoạt quyền này không?"
        confirmText="Kích hoạt"
        cancelText="Hủy"
        onConfirm={handleActivate}
      />
      <ActionConfirm
        ref={deactivateConfirmRef}
        title="Xác nhận ngừng hoạt động"
        message="Bạn có chắc chắn muốn ngừng hoạt động quyền này không?"
        confirmText="Ngừng hoạt động"
        cancelText="Hủy"
        onConfirm={handleDeactivate}
      />
    </BaseView>
  );
}
