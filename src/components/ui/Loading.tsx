import { loading } from "@/assets/animations";
import Lottie from "lottie-react";
import { ProgressSpinner } from "primereact/progressspinner";

function GlobalLoading() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center">
      <div className="h-52 w-52">
        <Lottie animationData={loading} loop />
      </div>

      <span className="mt-4 text-xl font-semibold">Đang tải dữ liệu...</span>

      <div className="mt-4">
        <ProgressSpinner style={{ width: 50, height: 50 }} strokeWidth="4" />
      </div>
    </div>
  );
}

export { GlobalLoading };
