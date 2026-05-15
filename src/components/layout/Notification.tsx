import { ROUTES } from "@/common/constants";
import { formatTimeAgo } from "@/common/helpers/formatHelper";
import { useAuth } from "@/context/AuthContext";
import {
  useMarkAllRead,
  useMarkReadList,
  usePaginationNotification,
  useUnreadCount,
} from "@/hooks/notification";
import { useRouter } from "@/routers/hooks";
import { Badge } from "primereact/badge";
import { Button } from "primereact/button";
import { OverlayPanel } from "primereact/overlaypanel";
import { type FC, useRef, useState } from "react";

const Notification: FC = () => {
  const op = useRef<OverlayPanel>(null);
  const router = useRouter();
  const [isRefetching, setIsRefetching] = useState(false);
  const { user } = useAuth();

  const isAdmin = user?.isAdmin;
  const userId = user?.id;
  const where = !isAdmin && userId ? { userId } : {};
  const { count: unreadCount } = useUnreadCount(where);
  const { data: notifications, refetch } = usePaginationNotification({
    skip: 0,
    take: 20,
    where,
  });
  const { onMarkReadList } = useMarkReadList();
  const { onMarkAllRead } = useMarkAllRead();

  const handleRefetch = async () => {
    setIsRefetching(true);
    await refetch();
    setIsRefetching(false);
  };

  const handleNotificationClick = (id: string, isSeen: boolean) => {
    if (!isSeen) {
      onMarkReadList([id]);
    }
  };

  const handleViewAll = () => {
    op.current?.hide();
    router.push(ROUTES.OTHER.NOTIFY.path);
  };

  const getIconByCategory = (category?: string) => {
    switch (category) {
      case "AUTH":
        return "pi pi-user text-blue-500";
      case "PAYMENT":
        return "pi pi-credit-card text-green-500";
      case "BOOKING":
        return "pi pi-calendar text-purple-500";
      case "PROMOTION":
        return "pi pi-tag text-orange-500";
      case "SYSTEM":
        return "pi pi-cog text-gray-500";
      case "GENERAL":
      default:
        return "pi pi-info-circle text-blue-500";
    }
  };

  return (
    <>
      <div className="relative inline-block">
        <Button
          icon="pi pi-bell"
          rounded
          text
          onClick={(e) => op.current?.toggle(e)}
          tooltip="Thông báo"
          tooltipOptions={{ position: "bottom" }}
          style={{
            background: "transparent",
            border: "none",
            boxShadow: "none",
          }}
        />
        {unreadCount > 0 && (
          <Badge
            value={unreadCount > 99 ? "99+" : unreadCount}
            severity="danger"
            className="pointer-events-none absolute top-0 right-0 origin-center scale-75"
          />
        )}
      </div>

      <OverlayPanel ref={op} className="w-96 shadow-lg">
        <div className="flex h-full flex-col">
          <div className="mb-3 flex items-center justify-between border-b pb-3">
            <h3 className="m-0 text-lg font-semibold">Thông báo</h3>
            <div className="flex gap-1">
              <Button
                icon={`pi ${isRefetching ? "pi-spin pi-spinner" : "pi-refresh"}`}
                rounded
                severity="info"
                size="small"
                onClick={handleRefetch}
                tooltip="Làm mới"
                disabled={isRefetching}
                outlined
                className="h-9! w-9! rounded-full!"
              />
              <Button
                icon="pi pi-check-square"
                rounded
                severity="info"
                size="small"
                onClick={() => onMarkAllRead()}
                tooltip="Đánh dấu tất cả là đã đọc"
                disabled={unreadCount === 0}
                outlined
                className="h-9! w-9! rounded-full!"
              />
            </div>
          </div>

          <div className="custom-scrollbar flex max-h-100 flex-col gap-1 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <i className="pi pi-inbox mb-3 text-4xl opacity-30" />
                <p className="m-0 text-sm">Không có thông báo nào</p>
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  onClick={() => handleNotificationClick(notification.id, notification.isRead)}
                  className={`flex cursor-pointer gap-3 rounded-lg p-3 transition-all ${
                    notification.isRead ? "bg-transparent opacity-70" : "bg-blue-50/40 shadow-sm"
                  }`}
                >
                  <div className="mt-0.5 shrink-0">
                    <i className={`${getIconByCategory(notification.payload?.category)} text-xl`} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="mb-0.5 flex items-start justify-between gap-2">
                      <h4
                        className={`m-0 truncate text-sm font-semibold ${
                          !notification.isRead ? "text-blue-700" : "text-gray-700"
                        }`}
                      >
                        {notification.title}
                      </h4>
                      {!notification.isRead && (
                        <div className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-blue-500" />
                      )}
                    </div>

                    {notification.body && (
                      <p className="m-0 mb-1 line-clamp-2 text-xs leading-relaxed text-gray-500">
                        {notification.body}
                      </p>
                    )}

                    <span className="mt-1 block text-xs text-gray-400">
                      {formatTimeAgo(notification.createdAt)}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="mt-3 border-t border-gray-100 pt-3">
            <Button
              label="Xem tất cả"
              size="small"
              className="w-full text-blue-600 hover:bg-blue-50"
              onClick={handleViewAll}
              rounded
              outlined
              severity="info"
            />
          </div>
        </div>
      </OverlayPanel>
    </>
  );
};

export { Notification };
