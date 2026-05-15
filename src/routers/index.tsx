import { ROUTES } from "@/common/constants";
import { AuthGuard } from "@/components";
import AppLayout from "@/layout/AppLayout";
import ForgotPasswordPage from "@/pages/auth/ForgotPasswordPage";
import LoginPage from "@/pages/auth/LoginPage";
import RegisterPage from "@/pages/auth/RegisterPage";
import ContributionManager from "@/pages/main/contribution-manager";
import AddContributionPage from "@/pages/main/contribution-manager/add";
import DetailContributionPage from "@/pages/main/contribution-manager/detail";
import Dashboard from "@/pages/main/dashboard";
import DisbursementManager from "@/pages/main/disbursement-manager/disbursement";
import AddDisbursementPage from "@/pages/main/disbursement-manager/disbursement/add";
import DetailDisbursementPage from "@/pages/main/disbursement-manager/disbursement/detail";
import EmployeeManager from "@/pages/main/employee-manager/employee";
import AddEmployeePage from "@/pages/main/employee-manager/employee/add";
import DetailEmployeePage from "@/pages/main/employee-manager/employee/detail";
import EditEmployeePage from "@/pages/main/employee-manager/employee/edit";
import FundManager from "@/pages/main/fund-manager";
import AddFundPage from "@/pages/main/fund-manager/add";
import FundCycleList from "@/pages/main/fund-manager/cycles";
import AddFundCyclePage from "@/pages/main/fund-manager/cycles/add";
import DetailFundCyclePage from "@/pages/main/fund-manager/cycles/detail";
import EditFundCyclePage from "@/pages/main/fund-manager/cycles/edit";
import DetailFundPage from "@/pages/main/fund-manager/detail";
import EditFundPage from "@/pages/main/fund-manager/edit";
import ReceiptManager from "@/pages/main/receipt-manager";
import AddReceiptPage from "@/pages/main/receipt-manager/add";
import DetailReceiptPage from "@/pages/main/receipt-manager/detail";
import PermissionManager from "@/pages/main/role-manager/permission-manager";
import AddPermissionPage from "@/pages/main/role-manager/permission-manager/add";
import DetailPermissionPage from "@/pages/main/role-manager/permission-manager/detail";
import EditPermissionPage from "@/pages/main/role-manager/permission-manager/edit";
import RoleManager from "@/pages/main/role-manager/role-manager";
import AddRolePage from "@/pages/main/role-manager/role-manager/add";
import DetailRolePage from "@/pages/main/role-manager/role-manager/detail";
import EditRolePage from "@/pages/main/role-manager/role-manager/edit";
import ActionLogList from "@/pages/main/setting-system/action-log";
import LoginLogManager from "@/pages/main/setting-system/login-log";
import SettingStringPage from "@/pages/main/setting-system/setting-string";
import TransactionManager from "@/pages/main/transaction-manager";
import MemberManager from "@/pages/main/user-manager/member-manager";
import AddMemberPage from "@/pages/main/user-manager/member-manager/add";
import DetailMemberPage from "@/pages/main/user-manager/member-manager/detail";
import EditMemberPage from "@/pages/main/user-manager/member-manager/edit";
import NotFound from "@/pages/other/NotFound";
import NotifyTemplateManager from "@/pages/other/notification-manager/notify-template";
import AddNotifyTemplate from "@/pages/other/notification-manager/notify-template/add";
import EditNotifyTemplate from "@/pages/other/notification-manager/notify-template/edit";
import NotifyListPage from "@/pages/other/notification-manager/notity";
import { Route, Routes } from "react-router-dom";
import PrivateRoute from "./PrivateRoute";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path={ROUTES.AUTH.LOGIN.path} element={<LoginPage />} />
      <Route path={ROUTES.AUTH.REGISTER.path} element={<RegisterPage />} />
      <Route path={ROUTES.AUTH.FORGOT_PASSWORD.path} element={<ForgotPasswordPage />} />

      <Route element={<PrivateRoute />}>
        <Route element={<AppLayout />}>
          <Route index path={ROUTES.MAIN.HOME.path} element={<Dashboard />} />
          <Route
            path={ROUTES.MAIN.FUND_MANAGER.path}
            element={
              <AuthGuard>
                <FundManager />
              </AuthGuard>
            }
          />
          <Route
            path={ROUTES.OTHER.NOTIFY.path}
            element={
              <AuthGuard>
                <NotifyListPage />
              </AuthGuard>
            }
          />
          <Route
            path={ROUTES.OTHER.NOTIFY_TEMPLATE.path}
            element={
              <AuthGuard>
                <NotifyTemplateManager />
              </AuthGuard>
            }
          />
          <Route
            path={ROUTES.OTHER.NOTIFY_TEMPLATE.children.NOTIFY_TEMPLATE_ADD.path}
            element={
              <AuthGuard>
                <AddNotifyTemplate />
              </AuthGuard>
            }
          />
          <Route
            path={ROUTES.OTHER.NOTIFY_TEMPLATE.children.NOTIFY_TEMPLATE_EDIT.path}
            element={
              <AuthGuard>
                <EditNotifyTemplate />
              </AuthGuard>
            }
          />

          {/* ========== THÀNH VIÊN ========== */}
          <Route
            path={ROUTES.MAIN.MEMBER_MANAGER.children.MEMBER_LIST.path}
            element={
              <AuthGuard>
                <MemberManager />
              </AuthGuard>
            }
          />
          <Route
            path={ROUTES.MAIN.MEMBER_MANAGER.children.MEMBER_LIST.children.ADD_MEMBER.path}
            element={
              <AuthGuard>
                <AddMemberPage />
              </AuthGuard>
            }
          />
          <Route
            path={ROUTES.MAIN.MEMBER_MANAGER.children.MEMBER_LIST.children.EDIT_MEMBER.path}
            element={
              <AuthGuard>
                <EditMemberPage />
              </AuthGuard>
            }
          />
          <Route
            path={ROUTES.MAIN.MEMBER_MANAGER.children.MEMBER_LIST.children.DETAIL_MEMBER.path}
            element={
              <AuthGuard>
                <DetailMemberPage />
              </AuthGuard>
            }
          />

          {/* ========== NHÂN VIÊN ========== */}
          <Route
            path={ROUTES.MAIN.MEMBER_MANAGER.children.EMPLOYEE_LIST.path}
            element={
              <AuthGuard>
                <EmployeeManager />
              </AuthGuard>
            }
          />
          <Route
            path={ROUTES.MAIN.MEMBER_MANAGER.children.EMPLOYEE_LIST.children.ADD_EMPLOYEE.path}
            element={
              <AuthGuard>
                <AddEmployeePage />
              </AuthGuard>
            }
          />
          <Route
            path={ROUTES.MAIN.MEMBER_MANAGER.children.EMPLOYEE_LIST.children.EDIT_EMPLOYEE.path}
            element={
              <AuthGuard>
                <EditEmployeePage />
              </AuthGuard>
            }
          />
          <Route
            path={ROUTES.MAIN.MEMBER_MANAGER.children.EMPLOYEE_LIST.children.DETAIL_EMPLOYEE.path}
            element={
              <AuthGuard>
                <DetailEmployeePage />
              </AuthGuard>
            }
          />

          {/* ========== QUỸ ========== */}
          <Route
            path={ROUTES.MAIN.FUND_MANAGER.path}
            element={
              <AuthGuard>
                <FundManager />
              </AuthGuard>
            }
          />
          <Route
            path={ROUTES.MAIN.FUND_MANAGER.children.ADD_FUND.path}
            element={
              <AuthGuard>
                <AddFundPage />
              </AuthGuard>
            }
          />
          <Route
            path={ROUTES.MAIN.FUND_MANAGER.children.EDIT_FUND.path}
            element={
              <AuthGuard>
                <EditFundPage />
              </AuthGuard>
            }
          />
          <Route
            path={ROUTES.MAIN.FUND_MANAGER.children.DETAIL_FUND.path}
            element={
              <AuthGuard>
                <DetailFundPage />
              </AuthGuard>
            }
          />
          <Route
            path={ROUTES.MAIN.FUND_MANAGER.children.FUND_CYCLES.path}
            element={
              <AuthGuard>
                <FundCycleList />
              </AuthGuard>
            }
          />
          <Route
            path={ROUTES.MAIN.FUND_MANAGER.children.FUND_CYCLES.children.ADD_FUND_CYCLE.path}
            element={
              <AuthGuard>
                <AddFundCyclePage />
              </AuthGuard>
            }
          />
          <Route
            path={ROUTES.MAIN.FUND_MANAGER.children.FUND_CYCLES.children.EDIT_FUND_CYCLE.path}
            element={
              <AuthGuard>
                <EditFundCyclePage />
              </AuthGuard>
            }
          />
          <Route
            path={ROUTES.MAIN.FUND_MANAGER.children.FUND_CYCLES.children.DETAIL_FUND_CYCLE.path}
            element={
              <AuthGuard>
                <DetailFundCyclePage />
              </AuthGuard>
            }
          />

          {/* ========== ĐÓNG GÓP ========== */}
          <Route
            path={ROUTES.MAIN.CONTRIBUTION_MANAGER.children.CONTRIBUTION_LIST.path}
            element={
              <AuthGuard>
                <ContributionManager />
              </AuthGuard>
            }
          />
          <Route
            path={ROUTES.MAIN.CONTRIBUTION_MANAGER.path}
            element={
              <AuthGuard>
                <ContributionManager />
              </AuthGuard>
            }
          />
          <Route
            path={
              ROUTES.MAIN.CONTRIBUTION_MANAGER.children.CONTRIBUTION_LIST.children.ADD_CONTRIBUTION
                .path
            }
            element={
              <AuthGuard>
                <AddContributionPage />
              </AuthGuard>
            }
          />
          <Route
            path={
              ROUTES.MAIN.CONTRIBUTION_MANAGER.children.CONTRIBUTION_LIST.children
                .DETAIL_CONTRIBUTION.path
            }
            element={
              <AuthGuard>
                <DetailContributionPage />
              </AuthGuard>
            }
          />

          {/* ========== BIÊN LAI ========== */}
          <Route
            path={ROUTES.MAIN.RECEIPT_MANAGER.path}
            element={
              <AuthGuard>
                <ReceiptManager />
              </AuthGuard>
            }
          />
          <Route
            path={ROUTES.MAIN.RECEIPT_MANAGER.children.ADD_RECEIPT.path}
            element={
              <AuthGuard>
                <AddReceiptPage />
              </AuthGuard>
            }
          />
          <Route
            path={ROUTES.MAIN.RECEIPT_MANAGER.children.DETAIL_RECEIPT.path}
            element={
              <AuthGuard>
                <DetailReceiptPage />
              </AuthGuard>
            }
          />

          {/* ========== GIẢI NGÂN ========== */}
          <Route
            path={ROUTES.MAIN.DISBURSEMENT_MANAGER.path}
            element={
              <AuthGuard>
                <DisbursementManager />
              </AuthGuard>
            }
          />
          <Route
            path={ROUTES.MAIN.DISBURSEMENT_MANAGER.children.ADD_DISBURSEMENT.path}
            element={
              <AuthGuard>
                <AddDisbursementPage />
              </AuthGuard>
            }
          />
          <Route
            path={ROUTES.MAIN.DISBURSEMENT_MANAGER.children.DETAIL_DISBURSEMENT.path}
            element={
              <AuthGuard>
                <DetailDisbursementPage />
              </AuthGuard>
            }
          />

          {/* ========== GIAO DỊCH ========== */}
          <Route
            path={ROUTES.MAIN.TRANSACTION_MANAGER.children.TRANSACTION_LIST.path}
            element={
              <AuthGuard>
                <TransactionManager />
              </AuthGuard>
            }
          />

          {/* ========== VAI TRÒ - QUYỀN ========== */}
          <Route
            path={ROUTES.MAIN.ROLE_MANAGER.children.ROLE_LIST.path}
            element={
              <AuthGuard>
                <RoleManager />
              </AuthGuard>
            }
          />
          <Route
            path={ROUTES.MAIN.ROLE_MANAGER.children.ROLE_LIST.children.ADD_ROLE.path}
            element={
              <AuthGuard>
                <AddRolePage />
              </AuthGuard>
            }
          />
          <Route
            path={ROUTES.MAIN.ROLE_MANAGER.children.ROLE_LIST.children.EDIT_ROLE.path}
            element={
              <AuthGuard>
                <EditRolePage />
              </AuthGuard>
            }
          />
          <Route
            path={ROUTES.MAIN.ROLE_MANAGER.children.ROLE_LIST.children.DETAIL_ROLE.path}
            element={
              <AuthGuard>
                <DetailRolePage />
              </AuthGuard>
            }
          />
          <Route
            path={ROUTES.MAIN.ROLE_MANAGER.children.PERMISSION_LIST.path}
            element={
              <AuthGuard>
                <PermissionManager />
              </AuthGuard>
            }
          />
          <Route
            path={ROUTES.MAIN.ROLE_MANAGER.children.PERMISSION_LIST.children.ADD_PERMISSION.path}
            element={
              <AuthGuard>
                <AddPermissionPage />
              </AuthGuard>
            }
          />
          <Route
            path={ROUTES.MAIN.ROLE_MANAGER.children.PERMISSION_LIST.children.EDIT_PERMISSION.path}
            element={
              <AuthGuard>
                <EditPermissionPage />
              </AuthGuard>
            }
          />
          <Route
            path={ROUTES.MAIN.ROLE_MANAGER.children.PERMISSION_LIST.children.DETAIL_PERMISSION.path}
            element={
              <AuthGuard>
                <DetailPermissionPage />
              </AuthGuard>
            }
          />

          {/* ========== GIÁM SÁT ========== */}
          <Route
            path={ROUTES.MAIN.SYSTEM_MONITOR.children.ACTION_LOG.path}
            element={
              <AuthGuard>
                <ActionLogList />
              </AuthGuard>
            }
          />
          <Route
            path={ROUTES.MAIN.SYSTEM_MONITOR.children.LOGIN_LOG.path}
            element={
              <AuthGuard>
                <LoginLogManager />
              </AuthGuard>
            }
          />

          {/* ========== CÀI ĐẶT ========== */}
          <Route
            path={ROUTES.MAIN.SETTING_SYSTEM.children.SETTING_STRING.path}
            element={
              <AuthGuard>
                <SettingStringPage />
              </AuthGuard>
            }
          />
        </Route>
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
