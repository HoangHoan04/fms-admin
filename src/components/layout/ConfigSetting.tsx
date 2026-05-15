import { useConfig } from "@/context/ConfigContext";
import { useTheme } from "@/context/ThemeContext";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { InputNumber } from "primereact/inputnumber";
import { InputSwitch } from "primereact/inputswitch";
import { InputText } from "primereact/inputtext";
import { Sidebar } from "primereact/sidebar";
import { useRef, type FC } from "react";
import { type ActionConfirmRef, SmoothSlider, ActionConfirm } from "../ui";

type ConfigSettingProps = {
  visible: boolean;
  onHide: () => void;
};

const ConfigSetting: FC<ConfigSettingProps> = ({ visible, onHide }) => {
  const { theme, setTheme } = useTheme();
  const isDark = theme === "dark";
  const { settings, footerSettings, updateSettings, updateFooterSettings, resetSettings } =
    useConfig();

  const resetConfirmRef = useRef<ActionConfirmRef>(null);

  const fontSizeOptions = [
    { label: "Nhỏ", value: "small" },
    { label: "Trung bình", value: "medium" },
    { label: "Lớn", value: "large" },
  ];

  const sidebarPositionOptions = [
    { label: "Trái", value: "left" },
    { label: "Phải", value: "right" },
  ];

  const settingsPanelPositionOptions = [
    { label: "Trái", value: "left" },
    { label: "Phải", value: "right" },
  ];

  const handleFooterSettingChange = (key: keyof typeof footerSettings, value: any) => {
    updateFooterSettings({ ...footerSettings, [key]: value });
  };

  const handleResetSettings = () => {
    resetConfirmRef.current?.show();
  };

  const hrClass = `my-4 border-t ${isDark ? "border-[#404040]" : "border-[#e0e6ed]"}`;

  const sectionTitleClass = `text-sm font-bold mb-3 flex items-center gap-2 ${
    isDark ? "text-blue-400" : "text-blue-600"
  }`;

  return (
    <Sidebar
      visible={visible}
      onHide={onHide}
      position={settings.settingsPanelPosition || "right"}
      className={`w-full transition-all duration-300 sm:w-125! md:w-150! ${
        isDark ? "bg-[#1a1a1a]" : "bg-white"
      }`}
      header={
        <div className="flex items-center gap-2">
          <i className="pi pi-cog text-xl text-[#1890ff]"></i>
          <h2 className={`text-xl font-semibold ${isDark ? "text-[#f0f0f0]" : "text-[#262626]"}`}>
            Cài đặt cấu hình
          </h2>
        </div>
      }
      style={{ backgroundColor: isDark ? "#1a1a1a" : "white" }}
    >
      <div
        className={`max-h-[calc(100vh-100px)] space-y-5 overflow-y-auto p-6 ${
          isDark ? "bg-[#1a1a1a]" : "bg-white"
        }`}
      >
        <div
          className={`rounded-xl border p-4 ${
            isDark ? "border-[#404040] bg-[#1a1a1a]" : "border-[#e0e6ed] bg-gray-50/50"
          }`}
        >
          <h3 className={sectionTitleClass}>
            <i className="pi pi-palette"></i>
            Cài đặt giao diện
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between rounded-lg p-2">
              <div className="flex items-center gap-3">
                <i
                  className={`pi pi-moon text-lg ${isDark ? "text-yellow-400" : "text-blue-500"}`}
                ></i>
                <span className="font-medium">Chế độ tối</span>
              </div>
              <InputSwitch
                checked={isDark}
                onChange={(e) => setTheme(e.value ? "dark" : "light")}
              />
            </div>

            <div className="flex items-center justify-between p-2">
              <span className="text-sm font-medium">Cỡ chữ</span>
              <Dropdown
                value={settings.fontSize || "medium"}
                onChange={(e) => updateSettings("fontSize", e.value)}
                options={fontSizeOptions}
                className="w-56!"
              />
            </div>

            <div className="flex items-center justify-between p-2">
              <span className="text-sm font-medium">Vị trí thanh bên</span>
              <Dropdown
                value={settings.sidebarPosition || "left"}
                onChange={(e) => updateSettings("sidebarPosition", e.value)}
                options={sidebarPositionOptions}
                className="w-56!"
              />
            </div>

            <div className="flex items-center justify-between p-2">
              <span className="text-sm font-medium">Vị trí bảng cài đặt</span>
              <Dropdown
                value={settings.settingsPanelPosition || "right"}
                onChange={(e) => updateSettings("settingsPanelPosition", e.value)}
                options={settingsPanelPositionOptions}
                className="w-56!"
              />
            </div>
          </div>
        </div>

        <div className={hrClass} />

        <div
          className={`rounded-xl border p-4 ${
            isDark ? "border-[#404040] bg-[#1a1a1a]" : "border-[#e0e6ed] bg-gray-50/50"
          }`}
        >
          <h3 className={sectionTitleClass}>
            <i className="pi pi-sliders-h"></i>
            Giới hạn tab và hiển thị tab
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between rounded-lg p-2">
              <div className="flex flex-col gap-1">
                <span className="font-medium">Giới hạn tab</span>
                <p className="text-xs opacity-70">Giới hạn từ 3 đến 20 tab</p>
              </div>

              <InputNumber
                value={settings.maxTabs || 10}
                onValueChange={(e) => {
                  if (e.value !== null) updateSettings("maxTabs", e.value);
                }}
                showButtons
                buttonLayout="horizontal"
                step={1}
                min={3}
                max={20}
                inputClassName="w-12 text-center font-semibold"
                incrementButtonClassName="p-button-text p-1"
                decrementButtonClassName="p-button-text p-1"
                incrementButtonIcon="pi pi-plus"
                decrementButtonIcon="pi pi-minus"
                size={2}
              />
            </div>

            <div className="flex items-center justify-between rounded-lg p-2">
              <span className="font-medium">Hiển thị tab</span>
              <InputSwitch
                checked={settings.showTabHeader}
                onChange={(e) => updateSettings("showTabHeader", e.value)}
              />
            </div>
          </div>
        </div>
        <div className={hrClass} />

        <div
          className={`rounded-xl border p-4 ${
            isDark ? "border-[#404040] bg-[#1a1a1a]" : "border-[#e0e6ed] bg-gray-50/50"
          }`}
        >
          <h3 className={sectionTitleClass}>
            <i className="pi pi-bell"></i>
            Thông báo
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between rounded-lg p-2">
              <span className="font-medium">Thông báo</span>
              <InputSwitch
                checked={settings.notifications}
                onChange={(e) => updateSettings("notifications", e.value)}
              />
            </div>
          </div>
        </div>

        <div className={hrClass} />

        <div
          className={`rounded-xl border p-4 ${
            isDark ? "border-[#404040] bg-[#1a1a1a]" : "border-[#e0e6ed] bg-gray-50/50"
          }`}
        >
          <h3 className={sectionTitleClass}>
            <i className="pi pi-bars"></i>
            Tùy chỉnh Sidebar
          </h3>
          <div className="space-y-4">
            <div className="space-y-2">
              <SmoothSlider
                label={`Độ rộng Sidebar (${settings.sidebarWidth} px)`}
                value={settings.sidebarWidth || 270}
                unit={"px"}
                min={200}
                max={350}
                onChange={(val) => updateSettings("sidebarWidth", val)}
              />
            </div>

            <div className="flex items-center justify-between p-2">
              <span className="text-sm font-medium">Hiển thị Icon</span>
              <InputSwitch
                checked={settings.showSidebarIcon}
                onChange={(e) => updateSettings("showSidebarIcon", e.value)}
              />
            </div>

            <div className="flex items-center justify-between p-2">
              <div className="flex flex-col">
                <span className="text-sm font-medium">Chế độ Accordion</span>
                <p className="text-[10px] opacity-60">Chỉ mở duy nhất 1 menu con</p>
              </div>
              <InputSwitch
                checked={settings.sidebarAccordion}
                onChange={(e) => updateSettings("sidebarAccordion", e.value)}
              />
            </div>
          </div>
        </div>

        <div className={hrClass} />

        <div
          className={`rounded-xl border p-4 ${
            isDark ? "border-[#404040] bg-[#1a1a1a]" : "border-[#e0e6ed] bg-gray-50/50"
          }`}
        >
          <h3 className={sectionTitleClass}>
            <i className="pi pi-window-maximize"></i>
            Tùy chỉnh footer
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">Hiển thị footer</p>
              <InputSwitch
                checked={footerSettings.showFooter}
                onChange={(e) => handleFooterSettingChange("showFooter", e.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase opacity-60">Nội dung footer</label>
              <InputText
                value={footerSettings.footerContent}
                onChange={(e) => handleFooterSettingChange("footerContent", e.target.value)}
                placeholder="Nhập nội dung footer tùy chỉnh"
                className="w-full text-sm"
                disabled={!footerSettings.showFooter}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center justify-between rounded-md bg-black/5 p-2 dark:bg-white/5">
                <span className="text-xs">Hiển thị phiên bản</span>
                <InputSwitch
                  className="scale-75"
                  checked={footerSettings.showVersion}
                  onChange={(e) => handleFooterSettingChange("showVersion", e.value)}
                  disabled={!footerSettings.showFooter}
                />
              </div>
              <div className="flex items-center justify-between rounded-md bg-black/5 p-2 dark:bg-white/5">
                <span className="text-xs">Hiển thị bản quyền</span>
                <InputSwitch
                  className="scale-75"
                  checked={footerSettings.showCopyright}
                  onChange={(e) => handleFooterSettingChange("showCopyright", e.value)}
                  disabled={!footerSettings.showFooter}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4 pt-4">
          <Button
            label="Đặt lại cài đặt"
            icon="pi pi-refresh"
            severity="danger"
            outlined
            onClick={handleResetSettings}
            className="w-full! border-red-500! bg-red-500! text-white!"
          />
          <div
            className={`flex items-start gap-3 rounded-lg border border-dashed p-3 ${
              isDark ? "border-gray-700 bg-gray-800/30" : "border-gray-300 bg-gray-50"
            }`}
          >
            <i className="pi pi-info-circle mt-0.5 text-blue-500"></i>
            <p className="text-xs leading-relaxed opacity-80">
              Các cài đặt ở đây sẽ được lưu vào bộ nhớ của trình duyệt. Nếu bạn muốn đặt lại về mặc
              định, hãy nhấn nút "Đặt lại cài đặt" ở trên.
            </p>
          </div>
        </div>
      </div>

      <ActionConfirm
        ref={resetConfirmRef}
        title="Xác nhận đặt lại cài đặt về mặc định"
        confirmText="Đặt lại"
        cancelText="Hủy"
        onConfirm={() => {
          resetSettings();
        }}
      />
    </Sidebar>
  );
};

export default ConfigSetting;
