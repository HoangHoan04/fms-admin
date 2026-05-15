import { ROUTES } from "@/common/constants";

const MODULE_MAPPING: Record<string, string> = {
  STUDENT_MANAGER: "STUDENT",
  TEACHER_MANAGER: "TEACHER",
  BANNER_MANAGER: "BANNER",
  NEW_LIST: "NEWS",
  BLOG_MANAGER: "BLOG",
  ROLE_MANAGER: "ROLE",
  PERMISSION_MANAGER: "PERMISSION",
  ASSIGN_PERMISSION: "PERMISSION",
  SETTING_STRING: "SETTING",
  HOME: "DASHBOARD",
  USER_MANAGER: "USER",
};

interface ModuleOption {
  code: string;
  name: string;
}

const extractModulesFromRoutes = (
  routes: any,
  modules: Map<string, ModuleOption> = new Map(),
): ModuleOption[] => {
  if (!routes || typeof routes !== "object") return [];

  Object.entries(routes).forEach(([key, value]: [string, any]) => {
    if (value.isShow === false) return;
    if (value.path && value.label) {
      const hasVisibleChildren =
        value.children &&
        Object.values(value.children).some((child: any) => child.isShow !== false);

      if (!hasVisibleChildren) {
        const moduleCode = MODULE_MAPPING[key] || key.toUpperCase();
        if (!modules.has(moduleCode)) {
          modules.set(moduleCode, {
            code: moduleCode,
            name: value.label,
          });
        }
      }
    }

    if (value.children) {
      extractModulesFromRoutes(value.children, modules);
    }
  });

  return Array.from(modules.values());
};

export const getModuleOptions = (): ModuleOption[] => {
  const modules = extractModulesFromRoutes(ROUTES.MAIN);
  return modules.sort((a, b) => a.name.localeCompare(b.name, "vi"));
};

export const getModuleName = (code: string): string => {
  const modules = getModuleOptions();
  const module = modules.find((m) => m.code === code);
  return module?.name || code;
};

export const isValidPermissionCode = (code: string): boolean => {
  const pattern = /^[A-Z_]+:[A-Z_]+$/;
  return pattern.test(code);
};

export const getModuleFromPermissionCode = (code: string): string => {
  const parts = code.split(":");
  return parts.length === 2 ? parts[0] : "";
};

export const getActionFromPermissionCode = (code: string): string => {
  const parts = code.split(":");
  return parts.length === 2 ? parts[1] : "";
};
