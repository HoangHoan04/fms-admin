import { ROUTES } from "@/common/constants";
import { enumData } from "@/common/enums";
import { formatDate } from "@/common/helpers";
import {
  ActionConfirm,
  type ActionConfirmRef,
  BaseView,
  DocumentFile,
  GlobalLoading,
  StatusTag,
} from "@/components/ui";
import ActionLog from "@/components/ui/ActionLog";
import { useActivateMember, useDeactivateMember, useMemberDetail } from "@/hooks/member";
import { useRouter } from "@/routers/hooks";
import { PrimeIcons } from "primereact/api";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { useRef } from "react";
import { useParams } from "react-router-dom";

export default function DetailMemberPage() {
  const { id } = useParams();
  const router = useRouter();
  const { data, isLoading, refetch } = useMemberDetail(id);
  const { onActivateMember } = useActivateMember();
  const { onDeactivateMember } = useDeactivateMember();

  const activateConfirmRef = useRef<ActionConfirmRef>(null);
  const deactivateConfirmRef = useRef<ActionConfirmRef>(null);

  const handleActivate = async () => {
    if (!data?.id) return;
    await onActivateMember(data.id);
    refetch();
  };

  const handleDeactivate = async () => {
    if (!data?.id) return;
    await onDeactivateMember(data.id);
    refetch();
  };

  if (isLoading) return <GlobalLoading />;

  if (!data) {
    return (
      <BaseView>
        <div className="flex h-full flex-col items-center justify-center gap-4">
          <p className="font-medium">Không tìm thấy thành viên</p>
          <Button
            label="Quay lại danh sách"
            icon={PrimeIcons.ARROW_LEFT}
            size="small"
            onClick={() => router.back()}
          />
        </div>
      </BaseView>
    );
  }

  const genderObj = enumData.GENDER[data.gender as keyof typeof enumData.GENDER];
  const genderName = genderObj ? genderObj.name : "---";

  const avatarImages =
    data.avatar && data.avatar.length > 0
      ? data.avatar.map((item: any) => ({
          id: item.id || "avatar",
          fileName: item.fileName || "avatar",
          fileUrl: item.fileUrl,
        }))
      : data.avatarUrl
        ? [
            {
              id: "avatar",
              fileName: data.fullName ? `Avatar_${data.fullName}` : "avatar",
              fileUrl: data.avatarUrl,
            },
          ]
        : [];

  const renderDetailView = () => {
    return (
      <div className="flex flex-col gap-6 p-6">
        <Card
          pt={{
            title: { className: "text-lg! font-bold! border-b pb-3 m-0" },
            body: { className: "p-6" },
          }}
          title="I. Thông tin liên hệ"
          className="rounded-xl border border-gray-100 shadow-xs"
        >
          <div className="grid grid-cols-1 gap-x-4 gap-y-6 md:grid-cols-3">
            <div className="flex flex-col gap-1">
              <span className="text-sm font-semibold text-gray-500">Mã thành viên</span>
              <span className="text-base font-bold">{data.code}</span>
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-sm font-semibold text-gray-500">Họ và tên</span>
              <span className="text-base font-bold">{data.fullName}</span>
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-sm font-semibold text-gray-500">Giới tính</span>
              <span className="text-base font-bold">{genderName}</span>
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-sm font-semibold text-gray-500">Ngày sinh</span>
              <span className="text-base font-bold">{formatDate(data.birthday)}</span>
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-sm font-semibold text-gray-500">Số điện thoại</span>
              <span className="text-base font-bold">{data.phone || "---"}</span>
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-sm font-semibold text-gray-500">Email</span>
              <span className="text-base font-bold break-all">{data.email || "---"}</span>
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-sm font-semibold text-gray-500">Ảnh đại diện</span>
              <div className="mt-1">
                <DocumentFile documents={avatarImages} />
              </div>
            </div>
          </div>
        </Card>

        <Card
          pt={{
            title: { className: "text-lg! font-bold! border-b! pb-3! m-0!" },
            body: { className: "p-6" },
          }}
          title="II. Thông tin chuyển khoản"
          className="rounded-xl border border-gray-100 shadow-xs"
        >
          {data.bankAccounts && data.bankAccounts.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {data.bankAccounts.map((account) => (
                <div
                  key={account.id}
                  className="rounded-xl border border-gray-200 bg-gray-50/50 p-5 transition-shadow hover:shadow-sm"
                >
                  <div className="mb-4 flex items-center gap-2 border-b border-gray-200 pb-3">
                    <i className="pi pi-building-columns text-xl text-blue-600" />
                    <span className="text-base font-bold">{account.bankName}</span>
                  </div>

                  <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">Số tài khoản</span>
                      <span className="font-mono text-sm font-bold">{account.bankAccountNo}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">Chủ tài khoản</span>
                      <span className="text-sm font-semibold">{account.bankAccountName}</span>
                    </div>

                    {account.qrCode?.fileUrl && (
                      <div className="mt-3 flex flex-col items-center gap-2 border-t border-gray-200 pt-3">
                        <span className="text-xs text-gray-400">Mã QR chuyển khoản</span>
                        <DocumentFile
                          documents={[
                            {
                              id: account.qrCode.fileUrl,
                              fileName: account.qrCode.fileName || `QR_${account.bankName}`,
                              fileUrl: account.qrCode.fileUrl,
                            },
                          ]}
                        />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2 rounded-lg border border-dashed py-10 text-gray-400">
              <i className="pi pi-credit-card text-3xl" />
              <p className="italic">Thành viên chưa có thông tin chuyển khoản</p>
            </div>
          )}
        </Card>

        <div className="flex items-center justify-center gap-4">
          <Button
            label="Quay lại"
            icon={PrimeIcons.ARROW_LEFT}
            severity="secondary"
            outlined
            className="px-6"
            onClick={() => router.back()}
          />
          {!data.isDeleted && (
            <Button
              label="Chỉnh sửa"
              icon={PrimeIcons.PENCIL}
              className="px-6"
              onClick={() =>
                router.push(
                  ROUTES.MAIN.MEMBER_MANAGER.children.MEMBER_LIST.children.EDIT_MEMBER.path.replace(
                    ":id",
                    data.id,
                  ),
                )
              }
            />
          )}
          {data.isDeleted ? (
            <Button
              label="Kích hoạt"
              icon={PrimeIcons.CHECK_CIRCLE}
              severity="success"
              className="px-6"
              onClick={() => activateConfirmRef.current?.show()}
            />
          ) : (
            <Button
              label="Ngừng hoạt động"
              icon={PrimeIcons.BAN}
              severity="warning"
              className="px-6"
              onClick={() => deactivateConfirmRef.current?.show()}
            />
          )}
        </div>

        <ActionConfirm
          ref={activateConfirmRef}
          title="Xác nhận kích hoạt thành viên"
          message="Bạn có chắc chắn muốn kích hoạt thành viên này không?"
          confirmText="Kích hoạt"
          cancelText="Hủy"
          onConfirm={handleActivate}
        />
        <ActionConfirm
          ref={deactivateConfirmRef}
          title="Xác nhận ngừng hoạt động"
          message="Bạn có chắc chắn muốn ngừng hoạt động thành viên này không?"
          confirmText="Ngừng hoạt động"
          cancelText="Hủy"
          onConfirm={handleDeactivate}
        />
      </div>
    );
  };

  const renderAccountView = () => {
    return (
      <div className="p-6">
        <Card
          pt={{
            title: { className: "text-base font-bold border-b pb-3 m-0" },
            body: { className: "p-6" },
          }}
          title="Thông tin tài khoản"
          className="rounded-xl border border-gray-100 bg-gray-50/50 shadow-xs"
        >
          <div className="grid grid-cols-1 gap-x-4 gap-y-6 md:grid-cols-3">
            <div className="flex flex-col gap-1">
              <span className="text-sm font-semibold">Tên đăng nhập</span>
              <span className="text-base font-bold">{data?.user?.username || "---"}</span>
            </div>

            <div className="flex flex-col items-start gap-1">
              <span className="mb-1 text-sm font-semibold">Trạng thái</span>
              <StatusTag
                severity={data?.user?.isActive ? "success" : "danger"}
                value={data?.user?.isActive ? "Đang hoạt động" : "Ngưng hoạt động"}
                style={{ fontSize: "14px", padding: "4px 12px" }}
              />
            </div>

            <div className="flex flex-col items-start gap-1">
              <span className="mb-1 text-sm font-semibold">Quyền quản trị</span>
              <StatusTag
                severity={data?.user?.isAdmin ? "warning" : "info"}
                value={data?.user?.isAdmin ? "Admin" : "User thường"}
                style={{ fontSize: "14px", padding: "4px 12px" }}
              />
            </div>

            <div className="flex flex-col items-start gap-1">
              <span className="mb-1 text-sm font-semibold">Ngày tạo tài khoản</span>
              <span className="text-base font-bold">
                {data?.user?.createdAt ? formatDate(data.user.createdAt) : "---"}
              </span>
            </div>

            <div className="flex flex-col items-start gap-1">
              <span className="mb-1 text-sm font-semibold">Ngày cập nhật tài khoản</span>
              <span className="text-base font-bold">
                {data?.user?.updatedAt ? formatDate(data.user.updatedAt) : "---"}
              </span>
            </div>
          </div>
        </Card>
      </div>
    );
  };

  const tabs = [
    {
      key: "1",
      title: "Chi tiết",
      icon: PrimeIcons.USER,
      content: renderDetailView(),
    },
    {
      key: "2",
      title: "Thông tin tài khoản",
      icon: PrimeIcons.ID_CARD,
      content: renderAccountView(),
    },
    {
      key: "3",
      title: "Lịch sử thao tác",
      icon: PrimeIcons.HISTORY,
      content: (
        <div className="h-full py-4">
          <Card className="h-full rounded-xl border border-gray-100 shadow-xs">
            <ActionLog entityName="MEMBER" entityId={data.id} />
          </Card>
        </div>
      ),
    },
  ];

  return <BaseView tabs={tabs} />;
}
