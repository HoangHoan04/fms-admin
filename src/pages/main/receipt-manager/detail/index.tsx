import {
  type ActionConfirmRef,
  GlobalLoading,
  BaseView,
  StatusTag,
  RowActions,
  CommonActions,
  ActionConfirm,
} from "@/components/ui";
import { useReceiptDetail, useApproveReceipt, useRejectReceipt } from "@/hooks/receipt";
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

export default function DetailReceiptPage() {
  const { id } = useParams();
  const router = useRouter();
  const { data, isLoading, refetch } = useReceiptDetail(id);
  const { onApproveReceipt } = useApproveReceipt();
  const { onRejectReceipt } = useRejectReceipt();

  const approveConfirmRef = useRef<ActionConfirmRef>(null);
  const rejectConfirmRef = useRef<ActionConfirmRef>(null);

  const handleApprove = async () => {
    if (!data?.id) return;
    await onApproveReceipt(data.id);
    refetch();
  };

  const handleReject = async () => {
    if (!data?.id) return;
    await onRejectReceipt(data.id);
    refetch();
  };

  const handleBack = () => router.back();

  if (isLoading) return <GlobalLoading />;
  if (!data)
    return (
      <BaseView>
        <Card>
          <p>Không tìm thấy biên lai</p>
        </Card>
      </BaseView>
    );

  return (
    <BaseView>
      <Card
        title={
          <div className="align-items-center justify-content-between flex">
            <span>Chi tiết biên lai</span>
            <StatusTag
              severity={data.status === "APPROVED" ? "success" : data.status === "REJECTED" ? "danger" : "warning"}
              value={data.status === "APPROVED" ? "Đã duyệt" : data.status === "REJECTED" ? "Từ chối" : "Chờ duyệt"}
            />
          </div>
        }
      >
        <div className="mb-4">
          <RowActions
            actions={[
              { ...CommonActions.cancel(handleBack), label: "Quay lại" },
              {
                key: "approve",
                label: "Duyệt",
                icon: PrimeIcons.CHECK_CIRCLE,
                severity: "success",
                visible: data.status === "PENDING",
                onClick: () => approveConfirmRef.current?.show(),
              },
              {
                key: "reject",
                label: "Từ chối",
                icon: PrimeIcons.BAN,
                severity: "danger",
                visible: data.status === "PENDING",
                onClick: () => rejectConfirmRef.current?.show(),
              },
            ]}
            justify="start"
            gap="medium"
          />
        </div>

        <Divider />

        <div className="mb-4">
          <h3 className="mb-3 text-xl font-semibold">Thông tin biên lai</h3>
          <DetailRow label="Mã biên lai" value={data.code} />
          <DetailRow label="Mã quỹ" value={data.fundId} />
          <DetailRow label="Tên quỹ" value={data.fundName} />
          <DetailRow label="Mã thành viên" value={data.memberId} />
          <DetailRow label="Tên thành viên" value={data.memberName} />
          <DetailRow
            label="Số tiền"
            value={
              new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(data.amount)
            }
          />
          <DetailRow label="Ngày biên lai" value={data.receiptDate} />
          <DetailRow label="Ghi chú" value={data.note} />
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
        ref={approveConfirmRef}
        title="Xác nhận duyệt biên lai"
        message="Bạn có chắc chắn muốn duyệt biên lai này không?"
        confirmText="Duyệt"
        cancelText="Hủy"
        onConfirm={handleApprove}
      />

      <ActionConfirm
        ref={rejectConfirmRef}
        title="Xác nhận từ chối biên lai"
        message="Bạn có chắc chắn muốn từ chối biên lai này không?"
        confirmText="Từ chối"
        cancelText="Hủy"
        onConfirm={handleReject}
      />
    </BaseView>
  );
}
