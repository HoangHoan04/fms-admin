import { ROUTES } from "@/common/constants";
import {
  ActionConfirm,
  type ActionConfirmRef,
  BaseView,
  CommonActions,
  GlobalLoading,
  RowActions,
  StatusTag,
} from "@/components/ui";
import { useActivateFund, useDeactivateFund, useFundDetail } from "@/hooks/fund";
import { useRouter } from "@/routers/hooks";
import { PrimeIcons } from "primereact/api";
import { Card } from "primereact/card";
import { Divider } from "primereact/divider";
import { Tag } from "primereact/tag";
import { useRef } from "react";
import { useParams } from "react-router-dom";

const statusSeverityMap: Record<string, "success" | "info" | "warning" | "danger" | "secondary"> = {
  active: "success",
  draft: "secondary",
  paused: "warning",
  closed: "danger",
};

const statusNameMap: Record<string, string> = {
  active: "Đang hoạt động",
  draft: "Bản nháp",
  paused: "Tạm dừng",
  closed: "Đã đóng",
};

const cycleTypeNameMap: Record<string, string> = {
  monthly: "Hàng tháng",
  quarterly: "Hàng quý",
  yearly: "Hàng năm",
  custom: "Tùy chỉnh",
};

const DetailRow = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <div className="mb-3 grid">
    <div className="col-12 md:col-3">
      <strong className="text-gray-700">{label}:</strong>
    </div>
    <div className="col-12 md:col-9">{value || "-"}</div>
  </div>
);

export default function DetailFundPage() {
  const { id } = useParams();
  const router = useRouter();
  const { data, isLoading, refetch } = useFundDetail(id);
  const { onActivateFund } = useActivateFund();
  const { onDeactivateFund } = useDeactivateFund();

  const activateConfirmRef = useRef<ActionConfirmRef>(null);
  const deactivateConfirmRef = useRef<ActionConfirmRef>(null);

  const handleActivate = async () => {
    if (!data?.id) return;
    await onActivateFund(data.id);
    refetch();
  };

  const handleDeactivate = async () => {
    if (!data?.id) return;
    await onDeactivateFund(data.id);
    refetch();
  };

  const handleBack = () => router.back();

  const currencyFormat = (value?: number) =>
    value != null ? value.toLocaleString("vi-VN", { style: "currency", currency: "VND" }) : "-";

  if (isLoading) return <GlobalLoading />;
  if (!data)
    return (
      <BaseView>
        <Card>
          <p>Không tìm thấy quỹ</p>
        </Card>
      </BaseView>
    );

  return (
    <BaseView>
      <Card
        title={
          <div className="align-items-center justify-content-between flex">
            <span>Chi tiết quỹ</span>
            <StatusTag
              severity={statusSeverityMap[data.status] || "info"}
              value={statusNameMap[data.status] || data.status}
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
                  router.push(
                    ROUTES.MAIN.FUND_MANAGER.children.EDIT_FUND.path.replace(":id", data.id),
                  ),
                ),
                label: "Chỉnh sửa",
                visible: !data.isDeleted && data.status !== "closed",
              },
              {
                key: "cycles",
                label: "Chu kỳ quỹ",
                icon: PrimeIcons.CALENDAR,
                severity: "info",
                onClick: () =>
                  router.push(
                    ROUTES.MAIN.FUND_MANAGER.children.FUND_CYCLES.path.replace(":fundId", data.id),
                  ),
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
            label="Mã quỹ"
            value={<Tag value={data.code} severity="info" style={{ fontWeight: 600 }} />}
          />
          <DetailRow label="Tên quỹ" value={data.name} />
          <DetailRow label="Mô tả" value={data.description} />
          <DetailRow label="Số tiền đóng mỗi kỳ" value={currencyFormat(data.contributionAmount)} />
          <DetailRow label="Đơn vị tiền tệ" value={data.currency || "VND"} />
          <DetailRow
            label="Loại chu kỳ"
            value={cycleTypeNameMap[data.cycleType] || data.cycleType}
          />
          <DetailRow label="Số ngày mỗi chu kỳ" value={data.cycleDurationDays} />
          <DetailRow label="Số người nhận tối đa/kỳ" value={data.maxRecipientPerCycle} />
          <DetailRow label="Số thành viên dự kiến" value={data.totalMembers} />
          <DetailRow
            label="Trạng thái"
            value={
              <StatusTag
                severity={statusSeverityMap[data.status] || "info"}
                value={statusNameMap[data.status] || data.status}
              />
            }
          />
        </div>

        <Divider />

        <div className="mb-4">
          <h3 className="mb-3 text-xl font-semibold">Nhân viên phụ trách</h3>
          <DetailRow
            label="Người quản lý"
            value={
              data.manager ? `${data.manager.code} - ${data.manager.fullName}` : "Chưa phân công"
            }
          />
        </div>

        <Divider />

        <div className="mb-4">
          <h3 className="mb-3 text-xl font-semibold">Thời gian</h3>
          <DetailRow
            label="Ngày bắt đầu"
            value={data.startDate ? new Date(data.startDate).toLocaleDateString("vi-VN") : "-"}
          />
          <DetailRow
            label="Ngày kết thúc"
            value={data.endDate ? new Date(data.endDate).toLocaleDateString("vi-VN") : "-"}
          />
        </div>

        <Divider />

        <div className="mb-4">
          <h3 className="mb-3 text-xl font-semibold">Thông tin hệ thống</h3>
          <DetailRow
            label="Trạng thái xóa"
            value={
              <StatusTag
                severity={data.isDeleted ? "danger" : "success"}
                value={data.isDeleted ? "Đã xóa" : "Chưa xóa"}
              />
            }
          />
          <DetailRow label="Ngày tạo" value={new Date(data.createdAt).toLocaleString("vi-VN")} />
          <DetailRow label="Người tạo" value={data.createdBy || "-"} />
          <DetailRow
            label="Ngày cập nhật"
            value={data.updatedAt ? new Date(data.updatedAt).toLocaleString("vi-VN") : "-"}
          />
          <DetailRow label="Người cập nhật" value={data.updatedBy || "-"} />
        </div>
      </Card>

      <ActionConfirm
        ref={activateConfirmRef}
        title="Xác nhận kích hoạt quỹ"
        message="Bạn có chắc chắn muốn kích hoạt quỹ này không?"
        confirmText="Kích hoạt"
        cancelText="Hủy"
        onConfirm={handleActivate}
      />
      <ActionConfirm
        ref={deactivateConfirmRef}
        title="Xác nhận ngừng hoạt động"
        message="Bạn có chắc chắn muốn ngừng hoạt động quỹ này không?"
        confirmText="Ngừng hoạt động"
        cancelText="Hủy"
        onConfirm={handleDeactivate}
      />
    </BaseView>
  );
}
