import { useToast } from "@/context/ToastContext";
import { Button } from "primereact/button";
import { Tooltip } from "primereact/tooltip";
import { useEffect, useState } from "react";
import screenfull from "screenfull";

const FullScreen = () => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const { showToast } = useToast();

  const handleChange = () => {
    setIsFullscreen(screenfull.isFullscreen);
  };

  const handleToggle = () => {
    if (!screenfull.isEnabled) {
      showToast({
        type: "warn",
        title: "Chế độ toàn màn hình không được hỗ trợ",
        message: "Trình duyệt của bạn không hỗ trợ chế độ toàn màn hình.",
        timeout: 2000,
      });
      return;
    }
    screenfull.toggle();
  };

  useEffect(() => {
    if (screenfull.isEnabled) {
      screenfull.on("change", handleChange);
    }
    return () => {
      if (screenfull.isEnabled) {
        screenfull.off("change", handleChange);
      }
    };
  }, []);

  const title = isFullscreen ? "Thoát chế độ toàn màn hình" : "Vào chế độ toàn màn hình";

  return (
    <>
      <Tooltip target=".fullscreen-btn" content={title} position="bottom" />
      <Button
        icon={isFullscreen ? "pi pi-window-minimize" : "pi pi-window-maximize"}
        onClick={handleToggle}
        className="fullscreen-btn flex h-10 w-10 cursor-pointer items-center justify-center rounded-full p-2 transition-colors duration-200"
        style={{
          background: "transparent",
          border: "none",
          boxShadow: "none",
          color: "var(--text-color-secondary, #555)",
        }}
        text
      />
    </>
  );
};

export { FullScreen };
