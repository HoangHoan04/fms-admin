import { ROUTES } from "@/common/constants";
import { AuthGuard } from "@/components/ui";
import AppLayout from "@/layout/AppLayout";
import LoginPage from "@/pages/auth/LoginPage";
import Dashboard from "@/pages/main/dashboard";
// import AssignPermission from "@/pages/main/role-manager/assign-permission";
import PermissionManager from "@/pages/main/role-manager/permission-manager";
import AddPermissionPage from "@/pages/main/role-manager/permission-manager/add";
import DetailPermissionPage from "@/pages/main/role-manager/permission-manager/detail";
import EditPermissionPage from "@/pages/main/role-manager/permission-manager/edit";
import RoleManager from "@/pages/main/role-manager/role-manager";
import AddRolePage from "@/pages/main/role-manager/role-manager/add";
import DetailRolePage from "@/pages/main/role-manager/role-manager/detail";
import EditRolePage from "@/pages/main/role-manager/role-manager/edit";
import SettingStringPage from "@/pages/main/setting-system/setting-string";
import ActionLogList from "@/pages/main/system-monitor/action-log";
// import StudentManager from "@/pages/main/user-manager/student-manager";
// import AddStudentPage from "@/pages/main/user-manager/student-manager/add";
// import DetailStudentPage from "@/pages/main/user-manager/student-manager/detail";
// import EditStudentPage from "@/pages/main/user-manager/student-manager/edit";
// import TeacherManager from "@/pages/main/user-manager/teacher-manager";
// import AddTeacherPage from "@/pages/main/user-manager/teacher-manager/add";
// import DetailTeacherPage from "@/pages/main/user-manager/teacher-manager/detail";
// import EditTeacherPage from "@/pages/main/user-manager/teacher-manager/edit";
import NotFound from "@/pages/other/NotFound";
import NotificationListPage from "@/pages/other/NotificationList";
import { Route, Routes } from "react-router-dom";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path={ROUTES.AUTH.LOGIN.path} element={<LoginPage />} />

      <Route>
        <Route element={<AppLayout />}>
          <Route index path={ROUTES.MAIN.HOME.path} element={<Dashboard />} />

          <Route path={ROUTES.OTHER.NOTIFICATION.path} element={<NotificationListPage />} />

          {/* ========== NGƯỜI DÙNG ========== */}
          {/* <Route
            path={ROUTES.MAIN.USER_MANAGER.children.STUDENT_MANAGER.path}
            element={
              <AuthGuard>
                <StudentManager />
              </AuthGuard>
            }
          />
          <Route
            path={ROUTES.MAIN.USER_MANAGER.children.STUDENT_MANAGER.children.ADD_STUDENT.path}
            element={
              <AuthGuard>
                <AddStudentPage />
              </AuthGuard>
            }
          />
          <Route
            path={ROUTES.MAIN.USER_MANAGER.children.STUDENT_MANAGER.children.EDIT_STUDENT.path}
            element={
              <AuthGuard>
                <EditStudentPage />
              </AuthGuard>
            }
          />
          <Route
            path={ROUTES.MAIN.USER_MANAGER.children.STUDENT_MANAGER.children.DETAIL_STUDENT.path}
            element={
              <AuthGuard>
                <DetailStudentPage />
              </AuthGuard>
            }
          />

          <Route
            path={ROUTES.MAIN.USER_MANAGER.children.TEACHER_MANAGER.path}
            element={
              <AuthGuard>
                <TeacherManager />
              </AuthGuard>
            }
          />
          <Route
            path={ROUTES.MAIN.USER_MANAGER.children.TEACHER_MANAGER.children.ADD_TEACHER.path}
            element={
              <AuthGuard>
                <AddTeacherPage />
              </AuthGuard>
            }
          />
          <Route
            path={ROUTES.MAIN.USER_MANAGER.children.TEACHER_MANAGER.children.EDIT_TEACHER.path}
            element={
              <AuthGuard>
                <EditTeacherPage />
              </AuthGuard>
            }
          />
          <Route
            path={ROUTES.MAIN.USER_MANAGER.children.TEACHER_MANAGER.children.DETAIL_TEACHER.path}
            element={
              <AuthGuard>
                <DetailTeacherPage />
              </AuthGuard>
            }
          /> */}

          {/* ========== VAI TRÒ ========== */}
          <Route
            path={ROUTES.MAIN.ROLE_MANAGER.children.ROLE_MANAGER.path}
            element={
              <AuthGuard>
                <RoleManager />
              </AuthGuard>
            }
          />
          <Route
            path={ROUTES.MAIN.ROLE_MANAGER.children.ROLE_MANAGER.children.ADD_ROLE.path}
            element={
              <AuthGuard>
                <AddRolePage />
              </AuthGuard>
            }
          />
          <Route
            path={ROUTES.MAIN.ROLE_MANAGER.children.ROLE_MANAGER.children.EDIT_ROLE.path}
            element={
              <AuthGuard>
                <EditRolePage />
              </AuthGuard>
            }
          />
          <Route
            path={ROUTES.MAIN.ROLE_MANAGER.children.ROLE_MANAGER.children.DETAIL_ROLE.path}
            element={
              <AuthGuard>
                <DetailRolePage />
              </AuthGuard>
            }
          />

          <Route
            path={ROUTES.MAIN.ROLE_MANAGER.children.PERMISSION_MANAGER.path}
            element={
              <AuthGuard>
                <PermissionManager />
              </AuthGuard>
            }
          />
          <Route
            path={ROUTES.MAIN.ROLE_MANAGER.children.PERMISSION_MANAGER.children.ADD_PERMISSION.path}
            element={
              <AuthGuard>
                <AddPermissionPage />
              </AuthGuard>
            }
          />
          <Route
            path={
              ROUTES.MAIN.ROLE_MANAGER.children.PERMISSION_MANAGER.children.EDIT_PERMISSION.path
            }
            element={
              <AuthGuard>
                <EditPermissionPage />
              </AuthGuard>
            }
          />
          <Route
            path={
              ROUTES.MAIN.ROLE_MANAGER.children.PERMISSION_MANAGER.children.DETAIL_PERMISSION.path
            }
            element={
              <AuthGuard>
                <DetailPermissionPage />
              </AuthGuard>
            }
          />

          {/* <Route
            path={ROUTES.MAIN.ROLE_MANAGER.children.ASSIGN_PERMISSION.path}
            element={
              <AuthGuard>
                <AssignPermission />
              </AuthGuard>
            }
          /> */}

          {/* ========== GIÁM SÁT ========== */}
          <Route
            path={ROUTES.MAIN.SYSTEM_MONITOR.children.ACTION_LOG.path}
            element={
              <AuthGuard>
                <ActionLogList />
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
