export const ROUTES = {
  AUTH: {
    LOGIN: {
      key: "LOGIN",
      label: "Đăng nhập",
      path: "/login",
      isShow: false,
    },
    FORGOT_PASSWORD: {
      key: "FORGOT_PASSWORD",
      label: "Quên mật khẩu",
      path: "/forgot-password",
      isShow: false,
    },
    RESET_PASSWORD: {
      key: "RESET_PASSWORD",
      label: "Đặt lại mật khẩu",
      path: "/reset-password",
      isShow: false,
    },
    REGISTER: {
      key: "REGISTER",
      label: "Đăng ký",
      path: "/register",
      isShow: false,
    },
  },

  OTHER: {
    NOTIFY: {
      key: "NOTIFY",
      label: "Thông báo",
      path: "/notifYs",
      isShow: false,
      permission: "NOTIFY:VIEW_LIST",
      children: {
        NOTIFY_DETAIL: {
          key: "NOTIFY_DETAIL",
          label: "Chi tiết thông báo",
          path: "/notifYs/:id",
          isShow: false,
          permission: "NOTIFY:VIEW_LIST",
        },
      },
    },
    NOTIFY_TEMPLATE: {
      key: "NOTIFY_TEMPLATE",
      label: "Mẫu thông báo",
      path: "/notifY-templates",
      isShow: false,
      permission: "NOTIFY:VIEW_LIST",
      children: {
        NOTIFY_TEMPLATE_ADD: {
          key: "NOTIFY_TEMPLATE_ADD",
          label: "Thêm mẫu",
          path: "/notifY-templates/add",
          isShow: false,
          permission: "NOTIFY:CREATED",
        },
        NOTIFY_TEMPLATE_EDIT: {
          key: "NOTIFY_TEMPLATE_EDIT",
          label: "Sửa mẫu",
          path: "/notifY-templates/edit/:id",
          isShow: false,
          permission: "NOTIFY:EDITED",
        },
        NOTIFY_TEMPLATE_DETAIL: {
          key: "NOTIFY_TEMPLATE_DETAIL",
          label: "Chi tiết mẫu",
          path: "/notifY-templates/detail/:id",
          isShow: false,
          permission: "NOTIFY:VIEW_DETAIL",
        },
      },
    },
  },

  MAIN: {
    HOME: {
      key: "HOME",
      label: "Trang chủ",
      path: "/",
      icon: "pi pi-home",
    },

    // Quản lý thành viên
    MEMBER_MANAGER: {
      key: "MEMBER_MANAGER",
      label: "Quản lý thành viên",
      icon: "pi pi-users",
      path: "/member-manager",
      permission: "MEMBER:VIEW_LIST",
      children: {
        MEMBER_LIST: {
          key: "MEMBER_LIST",
          label: "Thành viên",
          path: "/member",
          permission: "MEMBER:VIEW_LIST",
          children: {
            ADD_MEMBER: {
              key: "ADD_MEMBER",
              label: "Thêm thành viên",
              path: "/member/add",
              isShow: false,
              permission: "MEMBER:CREATED",
            },
            EDIT_MEMBER: {
              key: "EDIT_MEMBER",
              label: "Chỉnh sửa thành viên",
              path: "/member/edit/:id",
              isShow: false,
              permission: "MEMBER:EDITED",
            },
            DETAIL_MEMBER: {
              key: "DETAIL_MEMBER",
              label: "Chi tiết thành viên",
              path: "/member/detail/:id",
              isShow: false,
              permission: "MEMBER:VIEW_DETAIL",
            },
          },
        },
        EMPLOYEE_LIST: {
          key: "EMPLOYEE_LIST",
          label: "Nhân viên",
          path: "/employee",
          permission: "EMPLOYEE:VIEW_LIST",
          children: {
            ADD_EMPLOYEE: {
              key: "ADD_EMPLOYEE",
              label: "Thêm nhân viên",
              path: "/employee/add",
              isShow: false,
              permission: "EMPLOYEE:CREATED",
            },
            EDIT_EMPLOYEE: {
              key: "EDIT_EMPLOYEE",
              label: "Chỉnh sửa nhân viên",
              path: "/employee/edit/:id",
              isShow: false,
              permission: "EMPLOYEE:EDITED",
            },
            DETAIL_EMPLOYEE: {
              key: "DETAIL_EMPLOYEE",
              label: "Chi tiết nhân viên",
              path: "/employee/detail/:id",
              isShow: false,
              permission: "EMPLOYEE:VIEW_DETAIL",
            },
          },
        },
      },
    },

    // Quản lý quỹ
    FUND_MANAGER: {
      key: "FUND_MANAGER",
      label: "Quản lý quỹ",
      icon: "pi pi-wallet",
      path: "/fund-manager",
      permission: "FUND:VIEW_LIST",
      children: {
        ADD_FUND: {
          key: "ADD_FUND",
          label: "Thêm quỹ",
          path: "/fund/add",
          isShow: false,
          permission: "FUND:CREATED",
        },
        EDIT_FUND: {
          key: "EDIT_FUND",
          label: "Chỉnh sửa quỹ",
          path: "/fund/edit/:id",
          isShow: false,
          permission: "FUND:EDITED",
        },
        DETAIL_FUND: {
          key: "DETAIL_FUND",
          label: "Chi tiết quỹ",
          path: "/fund/detail/:id",
          isShow: false,
          permission: "FUND:VIEW_DETAIL",
        },
        FUND_CYCLES: {
          key: "FUND_CYCLES",
          label: "Chu kỳ quỹ",
          path: "/fund/cycles/:fundId",
          isShow: false,
          permission: "FUND:VIEW_LIST",
          children: {
            ADD_FUND_CYCLE: {
              key: "ADD_FUND_CYCLE",
              label: "Thêm chu kỳ",
              path: "/fund/cycles/add/:fundId",
              isShow: false,
              permission: "FUND:CREATED",
            },
            EDIT_FUND_CYCLE: {
              key: "EDIT_FUND_CYCLE",
              label: "Chỉnh sửa chu kỳ",
              path: "/fund/cycles/edit/:id",
              isShow: false,
              permission: "FUND:EDITED",
            },
            DETAIL_FUND_CYCLE: {
              key: "DETAIL_FUND_CYCLE",
              label: "Chi tiết chu kỳ",
              path: "/fund/cycles/detail/:id",
              isShow: false,
              permission: "FUND:VIEW_DETAIL",
            },
          },
        },
        FUND_MEMBERS: {
          key: "FUND_MEMBERS",
          label: "Thành viên quỹ",
          path: "/fund/members",
          isShow: false,
          permission: "FUND:VIEW_LIST",
        },
      },
    },

    // Quản lý đóng góp
    CONTRIBUTION_MANAGER: {
      key: "CONTRIBUTION_MANAGER",
      label: "Quản lý đóng góp",
      icon: "pi pi-sign-in",
      path: "/contribution-manager",
      permission: "CONTRIBUTION:VIEW_LIST",
      children: {
        CONTRIBUTION_LIST: {
          key: "CONTRIBUTION_LIST",
          label: "Đóng góp",
          path: "/contribution",
          permission: "CONTRIBUTION:VIEW_LIST",
          children: {
            ADD_CONTRIBUTION: {
              key: "ADD_CONTRIBUTION",
              label: "Thêm đóng góp",
              path: "/contribution/add",
              isShow: false,
              permission: "CONTRIBUTION:CREATED",
            },
            DETAIL_CONTRIBUTION: {
              key: "DETAIL_CONTRIBUTION",
              label: "Chi tiết đóng góp",
              path: "/contribution/detail/:id",
              isShow: false,
              permission: "CONTRIBUTION:VIEW_DETAIL",
            },
          },
        },
      },
    },

    // Quản lý biên lai
    RECEIPT_MANAGER: {
      key: "RECEIPT_MANAGER",
      label: "Quản lý biên lai",
      icon: "pi pi-receipt",
      path: "/receipt-manager",
      permission: "RECEIPT:VIEW_LIST",
      children: {
        ADD_RECEIPT: {
          key: "ADD_RECEIPT",
          label: "Thêm biên lai",
          path: "/receipt/add",
          isShow: false,
          permission: "RECEIPT:CREATED",
        },
        DETAIL_RECEIPT: {
          key: "DETAIL_RECEIPT",
          label: "Chi tiết biên lai",
          path: "/receipt/detail/:id",
          isShow: false,
          permission: "RECEIPT:VIEW_DETAIL",
        },
      },
    },

    // Quản lý giải ngân
    DISBURSEMENT_MANAGER: {
      key: "DISBURSEMENT_MANAGER",
      label: "Quản lý giải ngân",
      icon: "pi pi-sign-out",
      path: "/disbursement-manager",
      permission: "DISBURSEMENT:VIEW_LIST",
      children: {
        ADD_DISBURSEMENT: {
          key: "ADD_DISBURSEMENT",
          label: "Thêm giải ngân",
          path: "/disbursement/add",
          isShow: false,
          permission: "DISBURSEMENT:CREATED",
        },
        DETAIL_DISBURSEMENT: {
          key: "DETAIL_DISBURSEMENT",
          label: "Chi tiết giải ngân",
          path: "/disbursement/detail/:id",
          isShow: false,
          permission: "DISBURSEMENT:VIEW_DETAIL",
        },
      },
    },

    // Quản lý giao dịch & Số dư
    TRANSACTION_MANAGER: {
      key: "TRANSACTION_MANAGER",
      label: "Giao dịch & Số dư",
      icon: "pi pi-chart-line",
      path: "/transaction-manager",
      permission: "TRANSACTION:VIEW_LIST",
      children: {
        TRANSACTION_LIST: {
          key: "TRANSACTION_LIST",
          label: "Sổ cái thu chi",
          path: "/transaction",
          permission: "TRANSACTION:VIEW_LIST",
        },
        FUND_BALANCE: {
          key: "FUND_BALANCE",
          label: "Số dư quỹ",
          path: "/transaction/balance",
          permission: "TRANSACTION:VIEW_LIST",
        },
      },
    },

    // Quản lý vai trò - quyền
    ROLE_MANAGER: {
      key: "ROLE_MANAGER",
      label: "Quản lý vai trò",
      icon: "pi pi-shield",
      permission: "ROLE:VIEW_LIST",
      children: {
        ROLE_LIST: {
          key: "ROLE_LIST",
          label: "Vai trò",
          path: "/role",
          permission: "ROLE:VIEW_LIST",
          children: {
            ADD_ROLE: {
              key: "ADD_ROLE",
              label: "Thêm vai trò",
              path: "/role/add",
              isShow: false,
              permission: "ROLE:CREATED",
            },
            EDIT_ROLE: {
              key: "EDIT_ROLE",
              label: "Chỉnh sửa vai trò",
              path: "/role/edit/:id",
              isShow: false,
              permission: "ROLE:EDITED",
            },
            DETAIL_ROLE: {
              key: "DETAIL_ROLE",
              label: "Chi tiết vai trò",
              path: "/role/detail/:id",
              isShow: false,
              permission: "ROLE:VIEW_DETAIL",
            },
          },
        },
        PERMISSION_LIST: {
          key: "PERMISSION_LIST",
          label: "Quyền hạn",
          path: "/permission",
          permission: "PERMISSION:VIEW_LIST",
          children: {
            ADD_PERMISSION: {
              key: "ADD_PERMISSION",
              label: "Thêm quyền",
              path: "/permission/add",
              isShow: false,
              permission: "PERMISSION:CREATED",
            },
            EDIT_PERMISSION: {
              key: "EDIT_PERMISSION",
              label: "Chỉnh sửa quyền",
              path: "/permission/edit/:id",
              isShow: false,
              permission: "PERMISSION:EDITED",
            },
            DETAIL_PERMISSION: {
              key: "DETAIL_PERMISSION",
              label: "Chi tiết quyền",
              path: "/permission/detail/:id",
              isShow: false,
              permission: "PERMISSION:VIEW_DETAIL",
            },
          },
        },
        ASSIGN_PERMISSION: {
          key: "ASSIGN_PERMISSION",
          label: "Gán quyền",
          path: "/assign-permission",
          permission: "PERMISSION:ASSIGN",
        },
      },
    },

    // Giám sát hệ thống
    SYSTEM_MONITOR: {
      key: "SYSTEM_MONITOR",
      label: "Giám sát hệ thống",
      icon: "pi pi-chart-bar",
      path: "/system-monitor",
      permission: "SYSTEM_MONITOR:VIEW",
      children: {
        ACTION_LOG: {
          key: "ACTION_LOG",
          label: "Lịch sử hoạt động",
          path: "/action-log",
          permission: "ACTION_LOG:VIEW_LIST",
        },
        LOGIN_LOG: {
          key: "LOGIN_LOG",
          label: "Lịch sử đăng nhập",
          path: "/login-log",
          permission: "LOGIN_LOG:VIEW_LIST",
        },
      },
    },

    // Cài đặt hệ thống
    SETTING_SYSTEM: {
      key: "SETTING_SYSTEM",
      label: "Cấu hình",
      icon: "pi pi-cog",
      children: {
        SETTING_STRING: {
          key: "SETTING_STRING",
          label: "Cấu hình hệ thống",
          path: "/setting-system/setting-string",
          permission: "SYSTEM_CONFIG:VIEW_LIST",
        },
        SETTING_ACCOUNT: {
          key: "SETTING_ACCOUNT",
          label: "Cấu hình tài khoản",
          path: "/setting-system/setting-account",
          permission: "SYSTEM_CONFIG:VIEW_LIST",
        },
      },
    },
  },
};
