import { ROUTES } from "@/common/constants";
import {
  ActionConfirm,
  BaseView,
  CommonActions,
  GlobalLoading,
  RowActions,
  StatusTag,
  TableCustom,
  type ActionConfirmRef,
  type RowAction,
  type TableColumn,
} from "@/components/ui";
import { useConfirmContribution, usePaginationContribution } from "@/hooks/contribution";
import { useFundCycleDetail } from "@/hooks/fund-cycle";
import { useRouter } from "@/routers/hooks";
import { PrimeIcons } from "primereact/api";
import { Card } from "primereact/card";
import { Divider } from "primereact/divider";
import { Tag } from "primereact/tag";
import { useRef, useState } from "react";
import { useParams } from "react-router-dom";

const cycleStatusSeverity: Record<string, "success" | "info" | "warning" | "danger" | "secondary"> =
  {
    open: "info",
    collecting: "warning",
    closed: "success",
    paid_out: "success",
    cancelled: "danger",
  };
const cycleStatusName: Record<string, string> = {
  open: "Mở",
  collecting: "Đang thu",
  closed: "Đã đóng",
  paid_out: "Đã giải ngân",
  cancelled: "Đã hủy",
};
const contribStatusSeverity: Record<
  string,
  "success" | "info" | "warning" | "danger" | "secondary"
> = {
  paid: "success",
  pending: "info",
  late: "warning",
  overdue: "danger",
  waived: "secondary",
};
const contribStatusName: Record<string, string> = {
  paid: "Đã đóng",
  pending: "Chưa đóng",
  late: "Trễ hạn",
  overdue: "Quá hạn",
  waived: "Miễn",
};

const DetailRow = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <div className="mb-3 grid">
    <div className="col-12 md:col-3">
      <strong className="text-gray-700">{label}:</strong>
    </div>
    <div className="col-12 md:col-9">{value || "-"}</div>
  </div>
);

export default function FundCycleDetail() {
  const { id } = useParams();
  const router = useRouter();
  const { data: cycle, isLoading } = useFundCycleDetail(id);
  const { onConfirmContribution } = useConfirmContribution();
  const [contribPagination, setContribPagination] = useState<any>({
    skip: 0,
    take: 10,
    where: { cycleId: id },
  });
  const {
    data: contributions,
    total: contribTotal,
    refetch: refetchContrib,
  } = usePaginationContribution(contribPagination);
  const confirmRef = useRef<ActionConfirmRef>(null);
  const [selectedContrib, setSelectedContrib] = useState<any>(null);

  if (isLoading) return <GlobalLoading />;
  if (!cycle)
    return (
      <BaseView>
        <Card>
          <p>Không tìm thấy chu kỳ</p>
        </Card>
      </BaseView>
    );

  const handleConfirm = async () => {
    if (!selectedContrib) return;
    await onConfirmContribution({ id: selectedContrib.id });
    await refetchContrib();
    setSelectedContrib(null);
  };

  const handleOpenContributions = () => {
    router.push(
      `${ROUTES.MAIN.CONTRIBUTION_MANAGER.children.CONTRIBUTION_LIST.path}?cycleId=${cycle.id}`,
    );
  };

  const currency = (v?: number) =>
    v != null ? v.toLocaleString("vi-VN", { style: "currency", currency: "VND" }) : "-";

  const contribColumns: TableColumn<any>[] = [
    {
      field: "fundMember.member.code",
      header: "Mã TV",
      width: 100,
      body: (r: any) => r.fundMember?.member?.code || "-",
    },
    {
      field: "fundMember.member.fullName",
      header: "Tên thành viên",
      width: 180,
      body: (r: any) => r.fundMember?.member?.fullName || "-",
    },
    {
      field: "requiredAmount",
      header: "Cần đóng",
      width: 120,
      align: "right",
      body: (r: any) => currency(r.requiredAmount),
    },
    {
      field: "amount",
      header: "Đã đóng",
      width: 120,
      align: "right",
      body: (r: any) => currency(r.amount),
    },
    {
      field: "status",
      header: "Trạng thái",
      width: 120,
      align: "center",
      body: (r: any) => (
        <StatusTag
          severity={contribStatusSeverity[r.status] || "info"}
          value={contribStatusName[r.status] || r.status}
        />
      ),
    },
    {
      field: "paidAt",
      header: "Ngày đóng",
      width: 160,
      body: (r: any) => (r.paidAt ? new Date(r.paidAt).toLocaleString("vi-VN") : "-"),
    },
    {
      field: "paymentMethod",
      header: "Phương thức",
      width: 140,
      body: (r: any) => r.paymentMethod || "-",
    },
  ];

  const contribActions: RowAction<any>[] = [
    {
      key: "confirm",
      icon: PrimeIcons.CHECK_CIRCLE,
      tooltip: "Xác nhận đã đóng",
      severity: "success",
      visible: (r: any) => r.status === "pending" || r.status === "late",
      onClick: (r: any) => {
        setSelectedContrib(r);
        confirmRef.current?.show();
      },
    },
  ];

  return (
    <BaseView>
      <Card
        title={
          <div className="flex items-center justify-between">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="text-2xl font-semibold">Chi tiết chu kỳ: {cycle.name}</div>
                <div className="mt-1 text-sm text-gray-500">
                  Quỹ: {cycle.fund?.code || cycle.fundCode || "-"}
                </div>
              </div>
              <StatusTag
                severity={cycleStatusSeverity[cycle.status] || "info"}
                value={cycleStatusName[cycle.status] || cycle.status}
              />
            </div>
            <RowActions
              actions={[
                { ...CommonActions.cancel(() => router.back()), label: "Quay lại" },
                {
                  ...CommonActions.update(() =>
                    router.push(
                      ROUTES.MAIN.FUND_MANAGER.children.FUND_CYCLES.children.EDIT_FUND_CYCLE.path.replace(
                        ":id",
                        cycle.id,
                      ),
                    ),
                  ),
                  label: "Chỉnh sửa",
                  visible: cycle.status !== "closed" && cycle.status !== "cancelled",
                },
                {
                  key: "contributions",
                  label: "Xem đóng góp",
                  icon: PrimeIcons.SIGN_IN,
                  severity: "info",
                  onClick: handleOpenContributions,
                },
              ]}
              justify="start"
              gap="medium"
            />
          </div>
        }
      >
        <Divider />
        <div className="mb-4 grid grid-cols-1 gap-4 xl:grid-cols-2">
          <Card>
            <h3 className="mb-3 text-xl font-semibold">Thông tin chu kỳ</h3>
            <DetailRow
              label="Mã chu kỳ"
              value={<Tag value={cycle.code} severity="info" style={{ fontWeight: 600 }} />}
            />
            <DetailRow label="Tên chu kỳ" value={cycle.name} />
            <DetailRow label="Kỳ thứ" value={cycle.cycleIndex} />
            <DetailRow label="Số tiền đóng/kỳ" value={currency(cycle.contributionAmount)} />
            <DetailRow label="Tổng dự thu" value={currency(cycle.totalExpected)} />
            <DetailRow
              label="Đã thu"
              value={
                <span style={{ fontWeight: 600, color: "#22c55e" }}>
                  {currency(cycle.totalCollected)}
                </span>
              }
            />
            <DetailRow label="Đã giải ngân" value={currency(cycle.totalPaidOut)} />
            <DetailRow label="Ghi chú" value={cycle.note} />
          </Card>

          <Card>
            <h3 className="mb-3 text-xl font-semibold">Mốc thời gian</h3>
            <DetailRow
              label="Ngày bắt đầu thu"
              value={cycle.startDate ? new Date(cycle.startDate).toLocaleDateString("vi-VN") : "-"}
            />
            <DetailRow
              label="Hạn chót đóng"
              value={cycle.endDate ? new Date(cycle.endDate).toLocaleDateString("vi-VN") : "-"}
            />
            <DetailRow
              label="Ngày giải ngân"
              value={
                cycle.payoutDate ? new Date(cycle.payoutDate).toLocaleDateString("vi-VN") : "-"
              }
            />
            <DetailRow
              label="Trạng thái"
              value={
                <StatusTag
                  severity={cycleStatusSeverity[cycle.status] || "info"}
                  value={cycleStatusName[cycle.status] || cycle.status}
                />
              }
            />
          </Card>
        </div>

        <Divider />
        <div className="mb-3 flex items-center justify-between gap-3">
          <h3 className="text-xl font-semibold">Danh sách đóng tiền</h3>
          <StatusTag severity="info" value={`${contribTotal || 0} khoản`} />
        </div>
        <TableCustom<any>
          data={contributions || []}
          columns={contribColumns}
          rowActions={contribActions}
          loading={isLoading}
          stripedRows
          showGridlines
          scrollable
          emptyText="Chưa có khoản đóng nào"
          pagination={{
            current: Math.floor(contribPagination.skip / contribPagination.take) + 1,
            pageSize: contribPagination.take,
            total: contribTotal || 0,
            showTotal: true,
          }}
          onPageChange={(page, pageSize) =>
            setContribPagination((prev: any) => ({
              ...prev,
              skip: (page - 1) * pageSize,
              take: pageSize,
            }))
          }
        />
      </Card>

      <ActionConfirm
        ref={confirmRef}
        title="Xác nhận đóng tiền"
        message={`Xác nhận thành viên ${selectedContrib?.fundMember?.member?.fullName || ""} đã đóng ${currency(selectedContrib?.requiredAmount)}?`}
        confirmText="Xác nhận"
        cancelText="Hủy"
        onConfirm={handleConfirm}
      />
    </BaseView>
  );
}
