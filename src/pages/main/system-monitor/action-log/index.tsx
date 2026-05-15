import { BaseView } from "@/components/ui";

export default function ActionLogList() {
  return (
    <BaseView>
      <div style={{ padding: 40, textAlign: "center", color: "#6c757d" }}>
        <i className="pi pi-history" style={{ fontSize: "3rem", marginBottom: 16, opacity: 0.4 }} />
        <h3>Lịch sử hoạt động</h3>
      </div>
    </BaseView>
  );
}
