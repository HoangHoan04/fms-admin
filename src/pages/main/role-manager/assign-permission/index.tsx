// import { BaseView } from "@/components/ui";
// import { useTheme } from "@/context";
// import {
//   useAssignPermissionToUser,
//   useAssignPermissionsToRole,
//   usePermissionSelectBox,
//   usePermissionsByRole,
//   usePermissionsByUser,
//   useRemoveUserPermission,
//   type UserPermissionDto,
// } from "@/hooks/permission";
// import { useRoleSelectBox } from "@/hooks/role";
// import { Button } from "primereact/button";
// import { Checkbox } from "primereact/checkbox";
// import { Dropdown } from "primereact/dropdown";
// import { useCallback, useEffect, useMemo, useState } from "react";

// interface PermissionNode {
//   id: string;
//   code: string;
//   name: string;
//   action: string;
//   description?: string;
// }

// interface ModuleGroup {
//   module: string;
//   permissions: PermissionNode[];
// }

// function groupByModule(permissions: any[]): ModuleGroup[] {
//   const map: Record<string, PermissionNode[]> = {};
//   for (const p of permissions) {
//     const mod = p.module || "Khác";
//     if (!map[mod]) map[mod] = [];
//     map[mod].push({
//       id: p.id,
//       code: p.code,
//       name: p.name || p.code,
//       action: p.action || "",
//       description: p.description,
//     });
//   }
//   return Object.entries(map)
//     .map(([module, perms]) => ({ module, permissions: perms }))
//     .sort((a, b) => a.module.localeCompare(b.module));
// }

// function ModuleSection({
//   module,
//   permissions,
//   selectedIds,
//   onToggle,
//   onSelectAll,
// }: {
//   module: string;
//   permissions: PermissionNode[];
//   selectedIds: Set<string>;
//   onToggle: (id: string) => void;
//   onSelectAll: (checked: boolean) => void;
// }) {
//   const allChecked = permissions.every((p) => selectedIds.has(p.id));
//   const someChecked = permissions.some((p) => selectedIds.has(p.id)) && !allChecked;
//   const checkedCount = permissions.filter((p) => selectedIds.has(p.id)).length;

//   return (
//     <div
//       className="mb-3"
//       style={{
//         borderRadius: 10,
//         border: "1px solid #e9ecef",
//         overflow: "hidden",
//       }}
//     >
//       <div
//         className="flex items-center px-3 py-2"
//         style={{
//           background: allChecked
//             ? "linear-gradient(135deg, #667eea, #764ba2)"
//             : someChecked
//               ? "linear-gradient(135deg, #a78bfa, #818cf8)"
//               : "#f8f9fa",
//           borderBottom: "1px solid #e9ecef",
//         }}
//       >
//         <div className="flex items-center gap-2" style={{ flex: 1 }}>
//           <i
//             className="pi pi-folder-open"
//             style={{
//               fontSize: "0.9rem",
//               color: allChecked || someChecked ? "#fff" : "#667eea",
//             }}
//           />
//           <span
//             style={{
//               fontWeight: 700,
//               fontSize: "0.92rem",
//               color: allChecked || someChecked ? "#fff" : "#343a40",
//             }}
//           >
//             {module}
//           </span>
//           <span
//             className="ml-2"
//             style={{
//               fontSize: "0.75rem",
//               background: allChecked || someChecked ? "rgba(255,255,255,0.2)" : "#dee2e6",
//               color: allChecked || someChecked ? "rgba(255,255,255,0.9)" : "#6c757d",
//               padding: "1px 8px",
//               borderRadius: 10,
//               fontWeight: 600,
//             }}
//           >
//             {checkedCount}/{permissions.length}
//           </span>
//         </div>
//         <Checkbox
//           checked={allChecked}
//           onChange={(e) => onSelectAll(e.checked || false)}
//           style={{ opacity: someChecked ? 0.6 : 1 }}
//         />
//       </div>

//       <div style={{ padding: "6px 0" }}>
//         {permissions.map((p) => {
//           const checked = selectedIds.has(p.id);
//           return (
//             <div
//               key={p.id}
//               className="flex items-center gap-2 px-3 py-1"
//               style={{
//                 cursor: "pointer",
//                 background: checked ? "rgba(102,126,234,0.06)" : "transparent",
//                 borderLeft: checked ? "3px solid #667eea" : "3px solid transparent",
//                 transition: "all 0.12s",
//               }}
//               onClick={() => onToggle(p.id)}
//             >
//               <Checkbox checked={checked} onChange={() => onToggle(p.id)} />
//               <div className="flex items-center gap-2" style={{ flex: 1, minWidth: 0 }}>
//                 <span
//                   style={{
//                     fontWeight: checked ? 600 : 400,
//                     fontSize: "0.88rem",
//                     color: checked ? "#4f46e5" : "#495057",
//                     whiteSpace: "nowrap",
//                     overflow: "hidden",
//                     textOverflow: "ellipsis",
//                   }}
//                 >
//                   {p.name}
//                 </span>
//                 {p.action && (
//                   <span
//                     style={{
//                       fontSize: "0.7rem",
//                       background: checked ? "rgba(102,126,234,0.15)" : "#e9ecef",
//                       color: checked ? "#4f46e5" : "#6c757d",
//                       padding: "0 6px",
//                       borderRadius: 4,
//                       fontWeight: 500,
//                       whiteSpace: "nowrap",
//                     }}
//                   >
//                     {p.action}
//                   </span>
//                 )}
//               </div>
//               <span
//                 style={{
//                   fontSize: "0.72rem",
//                   color: "#adb5bd",
//                   fontFamily: "monospace",
//                 }}
//               >
//                 {p.code}
//               </span>
//             </div>
//           );
//         })}
//       </div>
//     </div>
//   );
// }

// function Toolbar({
//   selectedCount,
//   totalCount,
//   onSelectAll,
//   onSave,
//   saving,
//   disabled,
// }: {
//   selectedCount: number;
//   totalCount: number;
//   onSelectAll: (checked: boolean) => void;
//   onSave: () => void;
//   saving: boolean;
//   disabled: boolean;
// }) {
//   const allSelected = totalCount > 0 && selectedCount === totalCount;
//   const someSelected = selectedCount > 0 && selectedCount < totalCount;

//   return (
//     <div className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-2xl border px-5 py-3">
//       <div className="flex items-center gap-3">
//         <Checkbox
//           checked={allSelected}
//           onChange={(e) => onSelectAll(e.checked || false)}
//           style={{ opacity: someSelected ? 0.6 : 1 }}
//         />
//         <label
//           style={{
//             fontWeight: 600,
//             cursor: "pointer",
//             color: "#495057",
//             fontSize: "0.9rem",
//           }}
//         >
//           Chọn tất cả
//         </label>
//         <span className="flex items-center gap-2 rounded-lg border p-2 px-3">
//           <span className="text-primary font-semibold">{selectedCount}</span>
//           <span className="font-semibold text-blue-600"> / {totalCount}</span>
//         </span>
//       </div>
//       <Button
//         label="Lưu thay đổi"
//         icon="pi pi-save"
//         onClick={onSave}
//         loading={saving}
//         disabled={disabled}
//         size="small"
//         severity="info"
//         text
//         outlined
//       />
//     </div>
//   );
// }

// function AssignByRole() {
//   const [selectedRoleId, setSelectedRoleId] = useState<string | null>(null);
//   const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
//   const [initialized, setInitialized] = useState(false);
//   const { theme } = useTheme();
//   const isDark = theme === "dark";

//   const { data: roles, isLoading: loadingRoles } = useRoleSelectBox();
//   const { data: allPermissions, isLoading: loadingPerms } = usePermissionSelectBox();
//   const {
//     data: rolePermissions,
//     isLoading: loadingAssigned,
//     refetch,
//   } = usePermissionsByRole(selectedRoleId);
//   const { onAssignPermissionsToRole, isLoading: saving } = useAssignPermissionsToRole();

//   useEffect(() => {
//     if (!loadingAssigned && selectedRoleId) {
//       setSelectedIds(new Set(rolePermissions.map((rp) => rp.permissionId)));
//       setInitialized(true);
//     }
//   }, [rolePermissions, loadingAssigned, selectedRoleId]);

//   useEffect(() => {
//     setInitialized(false);
//     setSelectedIds(new Set());
//   }, [selectedRoleId]);

//   const groups = useMemo(() => groupByModule(allPermissions), [allPermissions]);
//   const totalCount = allPermissions.length;

//   const onToggle = useCallback((id: string) => {
//     setSelectedIds((prev) => {
//       const next = new Set(prev);
//       if (next.has(id)) next.delete(id);
//       else next.add(id);
//       return next;
//     });
//   }, []);

//   const onSelectAllInModule = useCallback(
//     (module: string, checked: boolean) => {
//       setSelectedIds((prev) => {
//         const next = new Set(prev);
//         const modulePerms = allPermissions.filter((p) => (p.module || "Khác") === module);
//         for (const p of modulePerms) {
//           if (checked) next.add(p.id);
//           else next.delete(p.id);
//         }
//         return next;
//       });
//     },
//     [allPermissions],
//   );

//   const onSelectAll = useCallback(
//     (checked: boolean) => {
//       if (checked) setSelectedIds(new Set(allPermissions.map((p) => p.id)));
//       else setSelectedIds(new Set());
//     },
//     [allPermissions],
//   );

//   const handleSave = async () => {
//     if (!selectedRoleId) return;
//     await onAssignPermissionsToRole({
//       roleId: selectedRoleId,
//       permissionIds: Array.from(selectedIds),
//     });
//     refetch();
//   };

//   const selectedRole = roles.find((r) => r.id === selectedRoleId);

//   return (
//     <div className={`m-4 rounded-xl p-4 shadow-lg ${isDark ? "bg-white/10" : "bg-gray-100"}`}>
//       <div className={`mb-6 px-5 py-4 ${isDark ? "bg-white/10" : "bg-gray-100"}`}>
//         <label className={`mb-2 block font-semibold ${isDark ? "text-white/80" : "text-gray-700"}`}>
//           <i className="pi pi-users mr-2" style={{ color: "#667eea" }} />
//           Chọn vai trò cần phân quyền
//         </label>
//         <div className="flex items-center gap-3">
//           <Dropdown
//             value={selectedRoleId}
//             options={roles}
//             optionLabel="name"
//             optionValue="id"
//             placeholder={loadingRoles ? "Đang tải..." : "-- Chọn vai trò --"}
//             onChange={(e) => setSelectedRoleId(e.value)}
//             disabled={loadingRoles}
//             filter
//             filterPlaceholder="Tìm vai trò..."
//             style={{ minWidth: 300 }}
//           />
//           {selectedRole && (
//             <span className="flex items-center rounded-full border px-3.5 py-1 text-xs font-semibold">
//               <i className="pi pi-tag mr-1" />
//               {selectedRole.code}
//             </span>
//           )}
//         </div>
//       </div>

//       {!selectedRoleId ? (
//         <div className="flex flex-col items-center px-5 py-16 text-center text-gray-400">
//           <i className="pi pi-lock mb-4 text-5xl opacity-40" />
//           <p className="m-0 text-base">Vui lòng chọn vai trò để phân quyền</p>
//         </div>
//       ) : loadingPerms || loadingAssigned ? (
//         <div className="flex flex-col items-center py-10 text-gray-500">
//           <i className="pi pi-spin pi-spinner mb-3 text-3xl" style={{ color: "#667eea" }} />
//           <p>Đang tải quyền...</p>
//         </div>
//       ) : (
//         <>
//           <Toolbar
//             selectedCount={selectedIds.size}
//             totalCount={totalCount}
//             onSelectAll={onSelectAll}
//             onSave={handleSave}
//             saving={saving}
//             disabled={!initialized}
//           />
//           <div className="max-h-[calc(100vh-380px)] overflow-y-auto pr-1">
//             {groups.map((g) => (
//               <ModuleSection
//                 key={g.module}
//                 module={g.module}
//                 permissions={g.permissions}
//                 selectedIds={selectedIds}
//                 onToggle={onToggle}
//                 onSelectAll={(checked) => onSelectAllInModule(g.module, checked)}
//               />
//             ))}
//           </div>
//         </>
//       )}
//     </div>
//   );
// }

// function AssignByEmployee() {
//   const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
//   const [addingPermissionId, setAddingPermissionId] = useState<string>("");
//   const [addingGrantType, setAddingGrantType] = useState<"Allow" | "Deny">("Allow");

//   const { data: allPermissions, isLoading: loadingPerms } = usePermissionSelectBox();
//   const {
//     data: userPerms,
//     isLoading: loadingUserPerms,
//     refetch,
//   } = usePermissionsByUser(selectedUserId);
//   const { onAssignToUser, isLoading: assigning } = useAssignPermissionToUser();
//   const { onRemoveUserPermission, isLoading: removing } = useRemoveUserPermission();

//   const [editingGrantType, setEditingGrantType] = useState<Record<string, "Allow" | "Deny">>({});

//   useEffect(() => {
//     setAddingPermissionId("");
//     setAddingGrantType("Allow");
//     setEditingGrantType({});
//   }, [selectedUserId]);

//   const groups = useMemo(() => groupByModule(allPermissions), [allPermissions]);
//   const userPermMap = useMemo(() => {
//     const map: Record<string, UserPermissionDto> = {};
//     for (const up of userPerms) {
//       map[up.permissionId] = up;
//     }
//     return map;
//   }, [userPerms]);

//   const filteredGroups = useMemo(() => {
//     return groups
//       .map((g) => ({
//         ...g,
//         permissions: g.permissions.filter((p) => {
//           const up = userPermMap[p.id];
//           const grantType = editingGrantType[p.id] || up?.grantType;
//           return up || grantType;
//         }),
//       }))
//       .filter((g) => g.permissions.length > 0);
//   }, [groups, userPermMap, editingGrantType]);

//   const handleAddOverride = async () => {
//     if (!selectedUserId || !addingPermissionId) return;
//     await onAssignToUser({
//       userId: selectedUserId,
//       permissionId: addingPermissionId,
//       grantType: addingGrantType,
//     });
//     setAddingPermissionId("");
//     refetch();
//   };

//   const handleRemove = async (id: string) => {
//     await onRemoveUserPermission(id);
//     refetch();
//   };

//   const handleToggleGrantType = async (up: UserPermissionDto) => {
//     const newType = up.grantType === "Allow" ? "Deny" : "Allow";
//     await onAssignToUser({
//       userId: selectedUserId!,
//       permissionId: up.permissionId,
//       grantType: newType,
//     });
//     refetch();
//   };

//   const selectedEmployee = employees.find((e) => e.id === selectedUserId);

//   return (
//     <div
//       style={{
//         background: "#fff",
//         borderRadius: 12,
//         padding: 24,
//         boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
//       }}
//     >
//       <div
//         style={{
//           background: "#f8f9fa",
//           borderRadius: 10,
//           padding: "16px 20px",
//           marginBottom: 24,
//           border: "1px solid #e9ecef",
//         }}
//       >
//         <label
//           style={{
//             display: "block",
//             fontWeight: 600,
//             marginBottom: 8,
//             color: "#495057",
//             fontSize: "0.9rem",
//           }}
//         >
//           <i className="pi pi-user mr-2" style={{ color: "#667eea" }} />
//           Chọn nhân viên cần phân quyền
//         </label>
//         <Dropdown
//           value={selectedUserId}
//           options={employees.map((e) => ({
//             label: `${e.fullName}${e.code ? ` (${e.code})` : ""}`,
//             value: e.id,
//           }))}
//           placeholder={loadingEmployees ? "Đang tải..." : "-- Chọn nhân viên --"}
//           onChange={(e) => setSelectedUserId(e.value)}
//           disabled={loadingEmployees}
//           filter
//           filterPlaceholder="Tìm nhân viên..."
//           style={{ minWidth: 350 }}
//         />
//         {selectedEmployee && (
//           <span
//             className="ml-3"
//             style={{
//               background: "linear-gradient(135deg, #667eea, #764ba2)",
//               color: "#fff",
//               padding: "4px 14px",
//               borderRadius: 20,
//               fontSize: "0.82rem",
//               fontWeight: 600,
//               display: "inline-block",
//               marginTop: 8,
//             }}
//           >
//             <i className="pi pi-user mr-1" />
//             {selectedEmployee.fullName}
//           </span>
//         )}
//       </div>

//       {!selectedUserId ? (
//         <div
//           className="flex-column flex items-center"
//           style={{
//             padding: "60px 20px",
//             color: "#adb5bd",
//             textAlign: "center",
//           }}
//         >
//           <i className="pi pi-lock" style={{ fontSize: "3rem", marginBottom: 16, opacity: 0.4 }} />
//           <p style={{ fontSize: "1.05rem", margin: 0 }}>Vui lòng chọn nhân viên để phân quyền</p>
//         </div>
//       ) : (
//         <>
//           <div
//             style={{
//               background: "#f0f4ff",
//               borderRadius: 10,
//               padding: "14px 18px",
//               marginBottom: 20,
//               border: "1px solid #d0d9ff",
//             }}
//           >
//             <label
//               style={{
//                 fontWeight: 600,
//                 fontSize: "0.88rem",
//                 color: "#495057",
//                 display: "block",
//                 marginBottom: 10,
//               }}
//             >
//               <i className="pi pi-plus-circle mr-2" style={{ color: "#667eea" }} />
//               Thêm quyền đặc biệt
//             </label>
//             <div className="flex flex-wrap items-center gap-2">
//               <Dropdown
//                 value={addingPermissionId}
//                 options={allPermissions.map((p) => ({
//                   label: `${p.code} - ${p.name}`,
//                   value: p.id,
//                 }))}
//                 placeholder="Chọn quyền..."
//                 onChange={(e) => setAddingPermissionId(e.value)}
//                 filter
//                 filterPlaceholder="Tìm quyền..."
//                 style={{ minWidth: 280 }}
//               />
//               <Dropdown
//                 value={addingGrantType}
//                 options={[
//                   { label: "Cho phép (Allow)", value: "Allow" },
//                   { label: "Từ chối (Deny)", value: "Deny" },
//                 ]}
//                 placeholder="Loại"
//                 onChange={(e) => setAddingGrantType(e.value)}
//                 style={{ minWidth: 160 }}
//               />
//               <Button
//                 label="Thêm"
//                 icon="pi pi-plus"
//                 onClick={handleAddOverride}
//                 loading={assigning}
//                 disabled={!addingPermissionId}
//                 style={{
//                   background: "linear-gradient(135deg, #667eea, #764ba2)",
//                   border: "none",
//                   borderRadius: 8,
//                   fontWeight: 600,
//                   padding: "8px 16px",
//                 }}
//               />
//             </div>
//           </div>

//           {loadingPerms || loadingUserPerms ? (
//             <div
//               className="flex-column flex items-center"
//               style={{ padding: 40, color: "#6c757d" }}
//             >
//               <i
//                 className="pi pi-spin pi-spinner"
//                 style={{
//                   fontSize: "1.8rem",
//                   marginBottom: 12,
//                   color: "#667eea",
//                 }}
//               />
//               <p>Đang tải quyền...</p>
//             </div>
//           ) : filteredGroups.length === 0 ? (
//             <div
//               className="flex-column flex items-center"
//               style={{ padding: "40px", color: "#adb5bd" }}
//             >
//               <i className="pi pi-inbox" style={{ fontSize: "2.5rem", marginBottom: 12 }} />
//               <p>Chưa có quyền đặc biệt nào</p>
//             </div>
//           ) : (
//             <div
//               style={{
//                 maxHeight: "calc(100vh - 480px)",
//                 overflowY: "auto",
//                 paddingRight: 4,
//               }}
//             >
//               {filteredGroups.map((g) => (
//                 <div
//                   key={g.module}
//                   className="mb-3"
//                   style={{
//                     borderRadius: 10,
//                     border: "1px solid #e9ecef",
//                     overflow: "hidden",
//                   }}
//                 >
//                   <div
//                     className="flex items-center px-3 py-2"
//                     style={{
//                       background: "#f8f9fa",
//                       borderBottom: "1px solid #e9ecef",
//                     }}
//                   >
//                     <i
//                       className="pi pi-folder-open mr-2"
//                       style={{ fontSize: "0.9rem", color: "#667eea" }}
//                     />
//                     <span
//                       style={{
//                         fontWeight: 700,
//                         fontSize: "0.92rem",
//                         color: "#343a40",
//                       }}
//                     >
//                       {g.module}
//                     </span>
//                     <span
//                       className="ml-2"
//                       style={{
//                         fontSize: "0.75rem",
//                         background: "#dee2e6",
//                         color: "#6c757d",
//                         padding: "1px 8px",
//                         borderRadius: 10,
//                         fontWeight: 600,
//                       }}
//                     >
//                       {g.permissions.length}
//                     </span>
//                   </div>
//                   <div style={{ padding: "6px 0" }}>
//                     {g.permissions.map((p) => {
//                       const up = userPermMap[p.id];
//                       const grantType = editingGrantType[p.id] || up?.grantType || "Allow";
//                       const isAllow = grantType === "Allow";

//                       return (
//                         <div
//                           key={p.id}
//                           className="flex items-center gap-2 px-3 py-1"
//                           style={{
//                             borderLeft: isAllow ? "3px solid #22c55e" : "3px solid #ef4444",
//                             background: isAllow ? "rgba(34,197,94,0.04)" : "rgba(239,68,68,0.04)",
//                             transition: "all 0.12s",
//                           }}
//                         >
//                           <i
//                             className={`pi ${isAllow ? "pi-check-circle" : "pi-ban"}`}
//                             style={{
//                               color: isAllow ? "#22c55e" : "#ef4444",
//                               fontSize: "0.95rem",
//                               cursor: "pointer",
//                             }}
//                             onClick={() => up && handleToggleGrantType(up)}
//                           />
//                           <div className="flex items-center gap-2" style={{ flex: 1, minWidth: 0 }}>
//                             <span
//                               style={{
//                                 fontWeight: 500,
//                                 fontSize: "0.88rem",
//                                 color: "#495057",
//                                 whiteSpace: "nowrap",
//                                 overflow: "hidden",
//                                 textOverflow: "ellipsis",
//                               }}
//                             >
//                               {p.name}
//                             </span>
//                             <span
//                               style={{
//                                 fontSize: "0.7rem",
//                                 background: "#e9ecef",
//                                 color: "#6c757d",
//                                 padding: "0 6px",
//                                 borderRadius: 4,
//                                 fontWeight: 500,
//                               }}
//                             >
//                               {p.action}
//                             </span>
//                           </div>
//                           <span
//                             style={{
//                               fontSize: "0.72rem",
//                               color: "#adb5bd",
//                               fontFamily: "monospace",
//                             }}
//                           >
//                             {p.code}
//                           </span>
//                           {up && (
//                             <Button
//                               icon="pi pi-trash"
//                               className="p-button-rounded p-button-text p-button-danger"
//                               style={{ width: 28, height: 28, minWidth: 28 }}
//                               onClick={() => handleRemove(up.id)}
//                               loading={removing}
//                               tooltip="Thu hồi"
//                               tooltipOptions={{ position: "top" }}
//                             />
//                           )}
//                         </div>
//                       );
//                     })}
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}
//         </>
//       )}
//     </div>
//   );
// }

// export default function AssignPermission() {
//   const tabs = [
//     {
//       key: "by-role",
//       title: "Theo vai trò",
//       icon: "pi pi-users",
//       content: <AssignByRole />,
//     },
//     {
//       key: "by-employee",
//       title: "Theo nhân viên",
//       icon: "pi pi-user",
//       content: <AssignByEmployee />,
//     },
//   ];

//   return <BaseView tabs={tabs} />;
// }
