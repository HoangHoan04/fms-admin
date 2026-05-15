import { type FormRef, type FormField, BaseView, FormCustom } from "@/components/ui";
import type { PermissionDto } from "@/dto";
import { useCreatePermission, useModuleActions, useSyncPermissions } from "@/hooks/permission";
import { useRouter } from "@/routers/hooks";
import { Button } from "primereact/button";
import { useRef, useState, useMemo, useCallback } from "react";

const ACTION_LABELS: Record<string, string> = {
  VIEW_LIST: "Xem danh sách",
  VIEW_DETAIL: "Xem chi tiết",
  CREATED: "Thêm mới",
  EDITED: "Chỉnh sửa",
  DELETED: "Xoá",
  ACTIVATED: "Kích hoạt",
  DEACTIVATED: "Ngưng hoạt động",
  PUBLISHED: "Xuất bản",
  APPROVED: "Phê duyệt",
  REJECTED: "Từ chối",
  MODERATED: "Kiểm duyệt",
  ASSIGN: "Gán quyền",
  EXPORTED: "Xuất dữ liệu",
  IMPORTED: "Nhập dữ liệu",
  SELECT_BOX: "Danh sách select",
  LOGIN: "Đăng nhập",
  CHANGE_PASSWORD: "Đổi mật khẩu",
  CHANGE_STATUS: "Đổi trạng thái",
  ARCHIVED: "Lưu trữ",
  RESTORED: "Khôi phục",
};

function generateCode(module: string, action: string): string {
  return `${module.toUpperCase().replace(/\s+/g, "_")}:${action}`;
}

function generateName(module: string, action: string): string {
  const label = ACTION_LABELS[action] || action;
  return `${module} - ${label}`;
}

function AddPermissionPage({
  initData,
  isEdit = false,
  handleUpdate,
  title = "Tạo mới quyền",
  isLoadingUpdate = false,
  onCancel,
}: {
  initData?: PermissionDto;
  isEdit?: boolean;
  handleUpdate?: (data: any) => void;
  title?: string;
  isLoadingUpdate?: boolean;
  onCancel?: () => void;
}) {
  const { isLoading, onCreatePermission } = useCreatePermission();
  const { data: moduleActions, isLoading: loadingModules } = useModuleActions();
  const { onSyncPermissions, isLoading: syncing } = useSyncPermissions();
  const router = useRouter();
  const formRef = useRef<FormRef>(null);
  const [selectedModule, setSelectedModule] = useState<string>(initData?.module || "");

  const moduleOptions = useMemo(() => {
    return (moduleActions || []).map((m) => ({
      id: m.module,
      name: m.module,
      value: m.module,
    }));
  }, [moduleActions]);

  const actionOptions = useMemo(() => {
    const mod = (moduleActions || []).find((m) => m.module === selectedModule);
    return (mod?.actions || []).map((a) => ({
      id: a,
      name: a,
      value: a,
    }));
  }, [moduleActions, selectedModule]);

  const syncCodeAndName = useCallback((module: string, action: string) => {
    if (module && action && formRef.current) {
      formRef.current.setFieldsValue({
        code: generateCode(module, action),
        name: generateName(module, action),
      });
    }
  }, []);

  const formFields = useMemo((): FormField[] => {
    return [
      {
        name: "code",
        label: "Mã quyền",
        type: "input",
        required: true,
        disabled: true,
        placeholder: "Tự động sinh từ Module + Hành động",
        gridColumn: "span 3",
      },
      {
        name: "name",
        label: "Tên quyền",
        type: "input",
        required: true,
        disabled: true,
        placeholder: "Tự động sinh từ Module + Hành động",
        gridColumn: "span 3",
      },
      {
        name: "module",
        label: "Module/Chức năng",
        type: "select",
        required: true,
        placeholder: "Chọn module",
        options: moduleOptions,
        loading: loadingModules,
        gridColumn: "span 1",
      },
      {
        name: "action",
        label: "Hành động",
        type: "select",
        required: true,
        placeholder: "Chọn hành động",
        options: actionOptions,
        disabled: !selectedModule,
        gridColumn: "span 1",
      },
      {
        name: "description",
        label: "Mô tả",
        type: "textarea",
        placeholder: "Nhập mô tả về quyền này",
        gridColumn: "span 3",
      },
    ];
  }, [moduleOptions, actionOptions, loadingModules, selectedModule]);

  const handleFormChange = useCallback(
    (allValues: Record<string, any>) => {
      if (allValues.module !== selectedModule) {
        setSelectedModule(allValues.module || "");
      }
      if (allValues.module && allValues.action) {
        syncCodeAndName(allValues.module, allValues.action);
      }
    },
    [selectedModule, syncCodeAndName],
  );

  const handleSubmit = (values: any) => {
    const payload = { ...values };
    if (isEdit && handleUpdate) {
      handleUpdate(payload);
    } else {
      onCreatePermission(payload);
    }
  };

  const goBack = () => {
    router.back();
  };

  const handleSync = async () => {
    await onSyncPermissions();
  };

  return (
    <BaseView>
      <div className="mb-2 flex justify-end gap-2">
        <Button
          label="Đồng bộ quyền từ hệ thống"
          icon="pi pi-sync"
          className="p-button-help"
          style={{ height: 30, fontSize: 13 }}
          loading={syncing}
          onClick={handleSync}
        />
      </div>
      <FormCustom
        ref={formRef}
        title={title}
        showDivider={true}
        fields={formFields}
        initialValues={initData}
        loading={isLoading || isLoadingUpdate || loadingModules}
        onSubmit={handleSubmit}
        onCancel={onCancel || goBack}
        submitText="Lưu"
        cancelText="Hủy"
        gridColumns={3}
        onChangeValue={handleFormChange}
      />
    </BaseView>
  );
}

export default AddPermissionPage;
