import {
  type ActionConfirmRef,
  GlobalLoading,
  BaseView,
  StatusTag,
  RowActions,
  CommonActions,
  ActionConfirm,
} from "@/components/ui";
import { useContributionDetail, useConfirmContribution } from "@/hooks/contribution";
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

export default function DetailContributionPage() {
  const { id } = useParams();
  const router = useRouter();
  const { data, isLoading, refetch } = useContributionDetail(id);
  const { onConfirmContribution } = useConfirmContribution();

  const confirmConfirmRef = useRef<ActionConfirmRef>(null);

  const handleConfirm = async () => {
    if (!data?.id) return;
    await onConfirmContribution(data.id);
    refetch();
  };

  const handleBack = () => router.back();

  if (isLoading) return <GlobalLoading />;
  if (!data)
    return (
      <BaseView>
        <Card>
          <p>Không tìm thấy đóng góp</p>
        </Card>
      </BaseView>
    );

  return (
    <BaseView>
      <Card
        title={
          <div className="align-items-center justify-content-between flex">
            <span>Chi tiết đóng góp</span>
            <StatusTag
              severity={data.isConfirmed ? "success" : "warning"}
              value={data.isConfirmed ? "Đã xác nhận" : "Chờ xác nhận"}
            />
          </div>
        }
      >
        <div className="mb-4">
          <RowActions
            actions={[
              { ...CommonActions.cancel(handleBack), label: "Quay lại" },
              {
                key: "confirm",
                label: "Xác nhận",
                icon: PrimeIcons.CHECK_CIRCLE,
                severity: "success",
                visible: !data.isConfirmed,
                onClick: () => confirmConfirmRef.current?.show(),
              },
            ]}
            justify="start"
            gap="medium"
          />
        </div>

        <Divider />

        <div className="mb-4">
          <h3 className="mb-3 text-xl font-semibold">Thông tin đóng góp</h3>
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
          <DetailRow label="Ngày đóng góp" value={data.contributionDate} />
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
        ref={confirmConfirmRef}
        title="Xác nhận đóng góp"
        message="Bạn có chắc chắn muốn xác nhận khoản đóng góp này không?"
        confirmText="Xác nhận"
        cancelText="Hủy"
        onConfirm={handleConfirm}
      />
    </BaseView>
  );
}
