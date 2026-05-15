import { type BaseDto } from "./common/base.dto";

export interface PermissionDto extends BaseDto {
  code: string;
  name?: string;
  description?: string;
  module?: string;
  action?: string;
}

export interface CreatePermissionDto {
  code: string;
  name?: string;
  description?: string;
  module?: string;
  action?: string;
}

export interface UpdatePermissionDto extends CreatePermissionDto {
  id: string;
}

export interface PermissionFilterDto {
  module?: string;
  code?: string;
  name?: string;
  action?: string;
}

export interface AssignPermissionsToRoleDto {
  roleId: string;
  permissionIds: string[];
}

export interface RemovePermissionFromRoleDto {
  roleId: string;
  permissionId: string;
}

export interface RolePermissionDto {
  id: string;
  roleId: string;
  permissionId: string;
  isDeleted: boolean;
  permission: PermissionDto;
}
