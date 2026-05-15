import {
  type ActionConfirmRef,
  GlobalLoading,
  BaseView,
  StatusTag,
  RowActions,
  CommonActions,
  ActionConfirm,
} from "@/components/ui";
import { useRoleDetail, useActivateRole, useDeactivateRole } from "@/hooks/role";
import { useRouter } from "@/routers/hooks";
import { PrimeIcons } from "primereact/api";
import { Card } from "primereact/card";
import { Divider } from "primereact/divider";
import { Tag } from "primereact/tag";
import { useRef, useMemo } from "react";
import { useParams } from "react-router-dom";

const DetailRow = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <div className="mb-3 grid">
    <div className="col-12 md:col-3">
      <strong className="text-gray-700">{label}:</strong>
    </div>
    <div className="col-12 md:col-9">{value || "-"}</div>
  </div>
);

export default function DetailRolePage() {
  const { id } = useParams();
  const router = useRouter();
  const { data, isLoading, refetch } = useRoleDetail(id);
  const { onActivateRole } = useActivateRole();
  const { onDeactivateRole } = useDeactivateRole();

  const activateConfirmRef = useRef<ActionConfirmRef>(null);
  const deactivateConfirmRef = useRef<ActionConfirmRef>(null);

  const handleActivate = async () => {
    if (!data?.id) return;
    await onActivateRole(data.id);
    refetch();
  };

  const handleDeactivate = async () => {
    if (!data?.id) return;
    await onDeactivateRole(data.id);
    refetch();
  };

  const handleBack = () => router.back();
  const groupedPermissions = useMemo(() => {
    if (!data?.rolePermissions) return {};
    const groups: Record<string, typeof data.rolePermissions> = {};
    for (const rp of data.rolePermissions) {
      const mod = rp.permission?.module || "Khác";
      if (!groups[mod]) groups[mod] = [];
      groups[mod].push(rp);
    }
    return groups;
  }, [data]);

  if (isLoading) return <GlobalLoading />;
  if (!data)
    return (
      <BaseView>
        <Card>
          <p>Không tìm thấy vai trò</p>
        </Card>
      </BaseView>
    );

  return (
    <BaseView>
      <Card
        title={
          <div className="align-items-center justify-content-between flex">
            <span>Chi tiết vai trò</span>
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
                  router.push(`/main/role-manager/role-manager/edit/${data.id}`),
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
            label="Mã vai trò"
            value={<Tag value={data.code} severity="info" style={{ fontWeight: 600 }} />}
          />
          <DetailRow label="Tên vai trò" value={data.name} />
          <DetailRow label="Mô tả" value={data.description} />
        </div>

        <Divider />

        <div className="mb-4">
          <h3 className="mb-3 text-xl font-semibold">
            Danh sách quyền
            {data.rolePermissions && (
              <span
                className="ml-2"
                style={{
                  fontSize: "0.8rem",
                  background: "#dee2e6",
                  color: "#6c757d",
                  padding: "1px 8px",
                  borderRadius: 10,
                  fontWeight: 600,
                  verticalAlign: "middle",
                }}
              >
                {data.rolePermissions.length}
              </span>
            )}
          </h3>
          {data.rolePermissions && data.rolePermissions.length > 0 ? (
            Object.entries(groupedPermissions).map(([module, perms]) => (
              <div key={module} className="mb-4">
                <div
                  style={{
                    fontWeight: 700,
                    fontSize: "0.88rem",
                    color: "#667eea",
                    marginBottom: 10,
                    padding: "6px 12px",
                    background: "#f0f4ff",
                    borderRadius: 8,
                    border: "1px solid #d0d9ff",
                  }}
                >
                  <i className="pi pi-folder-open mr-2" />
                  {module}
                  <span
                    className="ml-2"
                    style={{
                      fontSize: "0.75rem",
                      background: "rgba(102,126,234,0.15)",
                      color: "#4f46e5",
                      padding: "0 6px",
                      borderRadius: 6,
                      fontWeight: 600,
                    }}
                  >
                    {perms.length}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {perms.map((rp) => (
                    <div
                      key={rp.id}
                      style={{
                        padding: "6px 12px",
                        background: "rgba(102,126,234,0.06)",
                        border: "1px solid rgba(102,126,234,0.15)",
                        borderRadius: 8,
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 6,
                        fontSize: "0.85rem",
                        color: "#4f46e5",
                      }}
                    >
                      <i className="pi pi-check-circle" style={{ fontSize: "0.75rem" }} />
                      <span style={{ fontWeight: 500 }}>
                        {rp.permission?.name || rp.permission?.code}
                      </span>
                      {rp.permission?.action && (
                        <span
                          style={{
                            fontSize: "0.7rem",
                            background: "rgba(102,126,234,0.15)",
                            color: "#4f46e5",
                            padding: "0 5px",
                            borderRadius: 4,
                            fontWeight: 600,
                          }}
                        >
                          {rp.permission.action}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <p style={{ color: "#adb5bd", padding: 12 }}>Vai trò này chưa được gán quyền nào</p>
          )}
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
        title="Xác nhận kích hoạt vai trò"
        message="Bạn có chắc chắn muốn kích hoạt vai trò này không?"
        confirmText="Kích hoạt"
        cancelText="Hủy"
        onConfirm={handleActivate}
      />
      <ActionConfirm
        ref={deactivateConfirmRef}
        title="Xác nhận ngừng hoạt động"
        message="Bạn có chắc chắn muốn ngừng hoạt động vai trò này không?"
        confirmText="Ngừng hoạt động"
        cancelText="Hủy"
        onConfirm={handleDeactivate}
      />
    </BaseView>
  );
}
