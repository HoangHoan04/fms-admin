import { type BaseDto } from "./common/base.dto";
import { type PermissionDto } from "./permission.dto";

export interface RoleDto extends BaseDto {
  code: string;
  name: string;
  description?: string;
  rolePermissions?: {
    id: string;
    roleId: string;
    permissionId: string;
    permission: PermissionDto;
  }[];
}

export interface CreateRoleDto {
  code: string;
  name: string;
  description?: string;
}

export interface UpdateRoleDto extends CreateRoleDto {
  id: string;
}

export interface RoleFilterDto {
  code?: string;
  name?: string;
}

export interface RoleSelectBoxDto {
  id: string;
  code: string;
  name: string;
}
