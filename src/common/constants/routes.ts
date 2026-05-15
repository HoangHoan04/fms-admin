export const ROUTES = {
  AUTH: {
    LOGIN: {
      key: "LOGIN",
      label: "Đăng nhập",
      path: "/login",
      isShow: false,
    },
  },

  OTHER: {
    NOTIFICATION: {
      key: "NOTIFICATION",
      label: "Thông báo",
      path: "/notifications",
      isShow: false,
      permission: "NOTIFICATION:VIEW_LIST",
    },
  },

  MAIN: {
    HOME: {
      key: "HOME",
      label: "Trang chủ",
      path: "/",
      icon: "pi pi-home",
      permission: "HOME:VIEW",
    },

    //  Quản lý người dùng
    USER_MANAGER: {
      key: "USER_MANAGER",
      label: "Quản lý người dùng",
      icon: "pi pi-users",
      path: "/user-manager",
      permission: "USER:VIEW_LIST",
      children: {
        STUDENT_MANAGER: {
          key: "STUDENT_MANAGER",
          label: "Học viên",
          path: "/student-manager",
          permission: "STUDENT:VIEW_LIST",
          children: {
            ADD_STUDENT: {
              key: "ADD_STUDENT",
              label: "Thêm học viên",
              path: "/student/add",
              isShow: false,
              permission: "STUDENT:CREATED",
            },
            EDIT_STUDENT: {
              key: "EDIT_STUDENT",
              label: "Chỉnh sửa học viên",
              path: "/student/edit/:id",
              isShow: false,
              permission: "STUDENT:EDITED",
            },
            DETAIL_STUDENT: {
              key: "DETAIL_STUDENT",
              label: "Chi tiết học viên",
              path: "/student/detail/:id",
              isShow: false,
              permission: "STUDENT:VIEW_DETAIL",
            },
          },
        },
        TEACHER_MANAGER: {
          key: "TEACHER_MANAGER",
          label: "Giảng viên",
          path: "/teacher-manager",
          permission: "TEACHER:VIEW_LIST",
          children: {
            ADD_TEACHER: {
              key: "ADD_TEACHER",
              label: "Thêm giảng viên",
              path: "/teacher/add",
              isShow: false,
              permission: "TEACHER:CREATED",
            },
            EDIT_TEACHER: {
              key: "EDIT_TEACHER",
              label: "Chỉnh sửa giảng viên",
              path: "/teacher/edit/:id",
              isShow: false,
              permission: "TEACHER:EDITED",
            },
            DETAIL_TEACHER: {
              key: "DETAIL_TEACHER",
              label: "Chi tiết giảng viên",
              path: "/teacher/detail/:id",
              isShow: false,
              permission: "TEACHER:VIEW_DETAIL",
            },
          },
        },
      },
    },

    //  Quản lý đào tạo
    TRAINING_MANAGER: {
      key: "TRAINING_MANAGER",
      label: "Quản lý đào tạo",
      icon: "pi pi-book",
      path: "/training-manager",
      permission: "TRAINING:VIEW_LIST",
      children: {
        COURSE_MANAGER: {
          key: "COURSE_MANAGER",
          label: "Khóa học",
          path: "/course-manager",
          permission: "COURSE:VIEW_LIST",
          children: {
            ADD_COURSE: {
              key: "ADD_COURSE",
              label: "Thêm khóa học",
              path: "/course/add",
              isShow: false,
              permission: "COURSE:CREATED",
            },
            EDIT_COURSE: {
              key: "EDIT_COURSE",
              label: "Chỉnh sửa khóa học",
              path: "/course/edit/:id",
              isShow: false,
              permission: "COURSE:EDITED",
            },
            DETAIL_COURSE: {
              key: "DETAIL_COURSE",
              label: "Chi tiết khóa học",
              path: "/course/detail/:id",
              isShow: false,
              permission: "COURSE:VIEW_DETAIL",
            },
          },
        },
        LESSON_MANAGER: {
          key: "LESSON_MANAGER",
          label: "Bài học",
          path: "/lesson-manager",
          permission: "LESSON:VIEW_LIST",
          children: {
            ADD_LESSON: {
              key: "ADD_LESSON",
              label: "Thêm bài học",
              path: "/lesson/add",
              isShow: false,
              permission: "LESSON:CREATED",
            },
            EDIT_LESSON: {
              key: "EDIT_LESSON",
              label: "Chỉnh sửa bài học",
              path: "/lesson/edit/:id",
              isShow: false,
              permission: "LESSON:EDITED",
            },
            DETAIL_LESSON: {
              key: "DETAIL_LESSON",
              label: "Chi tiết bài học",
              path: "/lesson/detail/:id",
              isShow: false,
              permission: "LESSON:VIEW_DETAIL",
            },
          },
        },
        TOPIC_MANAGER: {
          key: "TOPIC_MANAGER",
          label: "Chủ đề",
          path: "/topic-manager",
          permission: "TOPIC:VIEW_LIST",
          children: {
            ADD_TOPIC: {
              key: "ADD_TOPIC",
              label: "Thêm chủ đề",
              path: "/topic/add",
              isShow: false,
              permission: "TOPIC:CREATED",
            },
            EDIT_TOPIC: {
              key: "EDIT_TOPIC",
              label: "Chỉnh sửa chủ đề",
              path: "/topic/edit/:id",
              isShow: false,
              permission: "TOPIC:EDITED",
            },
            DETAIL_TOPIC: {
              key: "DETAIL_TOPIC",
              label: "Chi tiết chủ đề",
              path: "/topic/detail/:id",
              isShow: false,
              permission: "TOPIC:VIEW_DETAIL",
            },
          },
        },
        CERT_TYPE_MANAGER: {
          key: "CERT_TYPE_MANAGER",
          label: "Loại chứng chỉ",
          path: "/cert-type-manager",
          permission: "CERT_TYPE:VIEW_LIST",
          children: {
            ADD_CERT_TYPE: {
              key: "ADD_CERT_TYPE",
              label: "Thêm loại chứng chỉ",
              path: "/cert-type/add",
              isShow: false,
              permission: "CERT_TYPE:CREATED",
            },
            EDIT_CERT_TYPE: {
              key: "EDIT_CERT_TYPE",
              label: "Chỉnh sửa loại chứng chỉ",
              path: "/cert-type/edit/:id",
              isShow: false,
              permission: "CERT_TYPE:EDITED",
            },
            DETAIL_CERT_TYPE: {
              key: "DETAIL_CERT_TYPE",
              label: "Chi tiết loại chứng chỉ",
              path: "/cert-type/detail/:id",
              isShow: false,
              permission: "CERT_TYPE:VIEW_DETAIL",
            },
          },
        },
        CERT_SKILL_MANAGER: {
          key: "CERT_SKILL_MANAGER",
          label: "Kỹ năng chứng chỉ",
          path: "/cert-skill-manager",
          permission: "CERT_SKILL:VIEW_LIST",
          children: {
            ADD_CERT_SKILL: {
              key: "ADD_CERT_SKILL",
              label: "Thêm kỹ năng",
              path: "/cert-skill/add",
              isShow: false,
              permission: "CERT_SKILL:CREATED",
            },
            EDIT_CERT_SKILL: {
              key: "EDIT_CERT_SKILL",
              label: "Chỉnh sửa kỹ năng",
              path: "/cert-skill/edit/:id",
              isShow: false,
              permission: "CERT_SKILL:EDITED",
            },
            DETAIL_CERT_SKILL: {
              key: "DETAIL_CERT_SKILL",
              label: "Chi tiết kỹ năng",
              path: "/cert-skill/detail/:id",
              isShow: false,
              permission: "CERT_SKILL:VIEW_DETAIL",
            },
          },
        },
        //  Đề thi & Câu hỏi
        EXAM_TEMPLATE_MANAGER: {
          key: "EXAM_TEMPLATE_MANAGER",
          label: "Đề thi mẫu",
          path: "/exam-template-manager",
          permission: "EXAM_TEMPLATE:VIEW_LIST",
          children: {
            ADD_EXAM_TEMPLATE: {
              key: "ADD_EXAM_TEMPLATE",
              label: "Thêm đề thi mẫu",
              path: "/exam-template/add",
              isShow: false,
              permission: "EXAM_TEMPLATE:CREATED",
            },
            EDIT_EXAM_TEMPLATE: {
              key: "EDIT_EXAM_TEMPLATE",
              label: "Chỉnh sửa đề thi mẫu",
              path: "/exam-template/edit/:id",
              isShow: false,
              permission: "EXAM_TEMPLATE:EDITED",
            },
            DETAIL_EXAM_TEMPLATE: {
              key: "DETAIL_EXAM_TEMPLATE",
              label: "Chi tiết đề thi mẫu",
              path: "/exam-template/detail/:id",
              isShow: false,
              permission: "EXAM_TEMPLATE:VIEW_DETAIL",
            },
          },
        },
        EXAM_PART_MANAGER: {
          key: "EXAM_PART_MANAGER",
          label: "Phần thi",
          path: "/exam-part-manager",
          permission: "EXAM_PART:VIEW_LIST",
          children: {
            ADD_EXAM_PART: {
              key: "ADD_EXAM_PART",
              label: "Thêm phần thi",
              path: "/exam-part/add",
              isShow: false,
              permission: "EXAM_PART:CREATED",
            },
            EDIT_EXAM_PART: {
              key: "EDIT_EXAM_PART",
              label: "Chỉnh sửa phần thi",
              path: "/exam-part/edit/:id",
              isShow: false,
              permission: "EXAM_PART:EDITED",
            },
            DETAIL_EXAM_PART: {
              key: "DETAIL_EXAM_PART",
              label: "Chi tiết phần thi",
              path: "/exam-part/detail/:id",
              isShow: false,
              permission: "EXAM_PART:VIEW_DETAIL",
            },
          },
        },
        EXAM_SESSION_MANAGER: {
          key: "EXAM_SESSION_MANAGER",
          label: "Buổi thi",
          path: "/exam-session-manager",
          permission: "EXAM_SESSION:VIEW_LIST",
          children: {
            DETAIL_EXAM_SESSION: {
              key: "DETAIL_EXAM_SESSION",
              label: "Chi tiết buổi thi",
              path: "/exam-session/detail/:id",
              isShow: false,
              permission: "EXAM_SESSION:VIEW_DETAIL",
            },
          },
        },
        QUESTION_MANAGER: {
          key: "QUESTION_MANAGER",
          label: "Câu hỏi",
          path: "/question-manager",
          permission: "QUESTION:VIEW_LIST",
          children: {
            ADD_QUESTION: {
              key: "ADD_QUESTION",
              label: "Thêm câu hỏi",
              path: "/question/add",
              isShow: false,
              permission: "QUESTION:CREATED",
            },
            EDIT_QUESTION: {
              key: "EDIT_QUESTION",
              label: "Chỉnh sửa câu hỏi",
              path: "/question/edit/:id",
              isShow: false,
              permission: "QUESTION:EDITED",
            },
            DETAIL_QUESTION: {
              key: "DETAIL_QUESTION",
              label: "Chi tiết câu hỏi",
              path: "/question/detail/:id",
              isShow: false,
              permission: "QUESTION:VIEW_DETAIL",
            },
          },
        },
        PASSAGE_MANAGER: {
          key: "PASSAGE_MANAGER",
          label: "Bài đọc",
          path: "/passage-manager",
          permission: "PASSAGE:VIEW_LIST",
          children: {
            ADD_PASSAGE: {
              key: "ADD_PASSAGE",
              label: "Thêm bài đọc",
              path: "/passage/add",
              isShow: false,
              permission: "PASSAGE:CREATED",
            },
            EDIT_PASSAGE: {
              key: "EDIT_PASSAGE",
              label: "Chỉnh sửa bài đọc",
              path: "/passage/edit/:id",
              isShow: false,
              permission: "PASSAGE:EDITED",
            },
            DETAIL_PASSAGE: {
              key: "DETAIL_PASSAGE",
              label: "Chi tiết bài đọc",
              path: "/passage/detail/:id",
              isShow: false,
              permission: "PASSAGE:VIEW_DETAIL",
            },
          },
        },
        PRACTICE_SET_MANAGER: {
          key: "PRACTICE_SET_MANAGER",
          label: "Bộ đề luyện tập",
          path: "/practice-set-manager",
          permission: "PRACTICE_SET:VIEW_LIST",
          children: {
            ADD_PRACTICE_SET: {
              key: "ADD_PRACTICE_SET",
              label: "Thêm bộ đề",
              path: "/practice-set/add",
              isShow: false,
              permission: "PRACTICE_SET:CREATED",
            },
            EDIT_PRACTICE_SET: {
              key: "EDIT_PRACTICE_SET",
              label: "Chỉnh sửa bộ đề",
              path: "/practice-set/edit/:id",
              isShow: false,
              permission: "PRACTICE_SET:EDITED",
            },
            DETAIL_PRACTICE_SET: {
              key: "DETAIL_PRACTICE_SET",
              label: "Chi tiết bộ đề",
              path: "/practice-set/detail/:id",
              isShow: false,
              permission: "PRACTICE_SET:VIEW_DETAIL",
            },
          },
        },
      },
    },

    //  Quản lý đơn hàng
    ORDER_MANAGER: {
      key: "ORDER_MANAGER",
      label: "Quản lý đơn hàng",
      icon: "pi pi-shopping-cart",
      path: "/order-manager",
      permission: "ORDER:VIEW_LIST",
      children: {
        ADD_ORDER: {
          key: "ADD_ORDER",
          label: "Thêm đơn hàng",
          path: "/order/add",
          isShow: false,
          permission: "ORDER:CREATED",
        },
        EDIT_ORDER: {
          key: "EDIT_ORDER",
          label: "Chỉnh sửa đơn hàng",
          path: "/order/edit/:id",
          isShow: false,
          permission: "ORDER:EDITED",
        },
        DETAIL_ORDER: {
          key: "DETAIL_ORDER",
          label: "Chi tiết đơn hàng",
          path: "/order/detail/:id",
          isShow: false,
          permission: "ORDER:VIEW_DETAIL",
        },
      },
    },

    //  Quản lý thành tích
    ACHIEVEMENT_MANAGER: {
      key: "ACHIEVEMENT_MANAGER",
      label: "Quản lý thành tích",
      icon: "pi pi-star",
      path: "/achievement-manager",
      permission: "ACHIEVEMENT:VIEW_LIST",
      children: {
        ADD_ACHIEVEMENT: {
          key: "ADD_ACHIEVEMENT",
          label: "Thêm thành tích",
          path: "/achievement/add",
          isShow: false,
          permission: "ACHIEVEMENT:CREATED",
        },
        EDIT_ACHIEVEMENT: {
          key: "EDIT_ACHIEVEMENT",
          label: "Chỉnh sửa thành tích",
          path: "/achievement/edit/:id",
          isShow: false,
          permission: "ACHIEVEMENT:EDITED",
        },
        DETAIL_ACHIEVEMENT: {
          key: "DETAIL_ACHIEVEMENT",
          label: "Chi tiết thành tích",
          path: "/achievement/detail/:id",
          isShow: false,
          permission: "ACHIEVEMENT:VIEW_DETAIL",
        },
      },
    },

    //  Quản lý đấu trường
    ARENA_MANAGER: {
      key: "ARENA_MANAGER",
      label: "Quản lý đấu trường",
      icon: "pi pi-crown",
      path: "/arena-match-manager",
      permission: "ARENA_MATCH:VIEW_LIST",
      children: {
        ADD_ARENA_MATCH: {
          key: "ADD_ARENA_MATCH",
          label: "Thêm trận đấu",
          path: "/arena-match/add",
          isShow: false,
          permission: "ARENA_MATCH:CREATED",
        },
        EDIT_ARENA_MATCH: {
          key: "EDIT_ARENA_MATCH",
          label: "Chỉnh sửa trận đấu",
          path: "/arena-match/edit/:id",
          isShow: false,
          permission: "ARENA_MATCH:EDITED",
        },
        DETAIL_ARENA_MATCH: {
          key: "DETAIL_ARENA_MATCH",
          label: "Chi tiết trận đấu",
          path: "/arena-match/detail/:id",
          isShow: false,
          permission: "ARENA_MATCH:VIEW_DETAIL",
        },
      },
    },

    //  Quản lý AI
    AI_MANAGER: {
      key: "AI_MANAGER",
      label: "Quản lý AI",
      icon: "pi pi-android",
      path: "/ai-grading-job-manager",
      permission: "AI_GRADING:VIEW_LIST",
      children: {
        ADD_AI_GRADING_JOB: {
          key: "ADD_AI_GRADING_JOB",
          label: "Thêm chấm điểm",
          path: "/ai-grading-job/add",
          isShow: false,
          permission: "AI_GRADING:CREATED",
        },
        DETAIL_AI_GRADING_JOB: {
          key: "DETAIL_AI_GRADING_JOB",
          label: "Chi tiết chấm điểm",
          path: "/ai-grading-job/detail/:id",
          isShow: false,
          permission: "AI_GRADING:VIEW_DETAIL",
        },
      },
    },

    //  Quản lý nội dung
    CONTENT_MANAGER: {
      key: "CONTENT_MANAGER",
      label: "Quản lý nội dung",
      icon: "pi pi-images",
      path: "/content-manager",
      permission: "CONTENT:VIEW_LIST",
      children: {
        BANNER_MANAGER: {
          key: "BANNER_MANAGER",
          label: "Banner",
          path: "/banner-manager",
          permission: "BANNER:VIEW_LIST",
          children: {
            ADD_BANNER: {
              key: "ADD_BANNER",
              label: "Thêm banner",
              path: "/banner/add",
              isShow: false,
              permission: "BANNER:CREATED",
            },
            EDIT_BANNER: {
              key: "EDIT_BANNER",
              label: "Chỉnh sửa banner",
              path: "/banner/edit/:id",
              isShow: false,
              permission: "BANNER:EDITED",
            },
            DETAIL_BANNER: {
              key: "DETAIL_BANNER",
              label: "Chi tiết banner",
              path: "/banner/detail/:id",
              isShow: false,
              permission: "BANNER:VIEW_DETAIL",
            },
          },
        },
        NEWS_MANAGER: {
          key: "NEWS_MANAGER",
          label: "Tin tức",
          path: "/news-manager",
          permission: "NEWS:VIEW_LIST",
          children: {
            ADD_NEWS: {
              key: "ADD_NEWS",
              label: "Thêm tin tức",
              path: "/news/add",
              isShow: false,
              permission: "NEWS:CREATED",
            },
            EDIT_NEWS: {
              key: "EDIT_NEWS",
              label: "Chỉnh sửa tin tức",
              path: "/news/edit/:id",
              isShow: false,
              permission: "NEWS:EDITED",
            },
            DETAIL_NEWS: {
              key: "DETAIL_NEWS",
              label: "Chi tiết tin tức",
              path: "/news/detail/:id",
              isShow: false,
              permission: "NEWS:VIEW_DETAIL",
            },
          },
        },
        BLOG_MANAGER: {
          key: "BLOG_MANAGER",
          label: "Bài viết",
          path: "/blog-manager",
          permission: "BLOG:VIEW_LIST",
          children: {
            ADD_BLOG: {
              key: "ADD_BLOG",
              label: "Thêm bài viết",
              path: "/blog/add",
              isShow: false,
              permission: "BLOG:CREATED",
            },
            EDIT_BLOG: {
              key: "EDIT_BLOG",
              label: "Chỉnh sửa bài viết",
              path: "/blog/edit/:id",
              isShow: false,
              permission: "BLOG:EDITED",
            },
            DETAIL_BLOG: {
              key: "DETAIL_BLOG",
              label: "Chi tiết bài viết",
              path: "/blog/detail/:id",
              isShow: false,
              permission: "BLOG:VIEW_DETAIL",
            },
          },
        },
      },
    },

    //  Quản lý vai trò - quyền
    ROLE_MANAGER: {
      key: "ROLE_MANAGER",
      label: "Quản lý vai trò",
      icon: "pi pi-shield",
      permission: "ROLE:VIEW_LIST",
      children: {
        ROLE_MANAGER: {
          key: "ROLE_MANAGER",
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
        PERMISSION_MANAGER: {
          key: "PERMISSION_MANAGER",
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
          isShow: true,
          permission: "PERMISSION:ASSIGN",
        },
      },
    },

    //  Giám sát hệ thống
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
      },
    },

    //  Cài đặt hệ thống
    SETTING_SYSTEM: {
      key: "SETTING_SYSTEM",
      label: "Cài đặt hệ thống",
      icon: "pi pi-cog",
      permission: "SETTING:VIEW_LIST",
      children: {
        SETTING_STRING: {
          key: "SETTING_STRING",
          label: "Thiết lập động",
          path: "setting-system/setting-string",
          permission: "SETTING:VIEW_LIST",
        },
      },
    },
  },
};
