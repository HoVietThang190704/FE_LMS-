import type { Assignment, Course, Notification, Stats, UserProfile } from '@/lib/types/home';

export const mockStats: Stats = {
  enrolledCourses: 3,
  pendingAssignments: 2,
  averageGrade: '8.5/10',
  learningProgress: 65,
};

export const mockUserProfile: UserProfile = {
  name: 'Nguyễn Văn A',
};

export const mockClasses: Course[] = [
  {
    id: 1,
    courseCode: 'IT4409',
    courseName: 'Lập trình Web nâng cao',
    instructor: 'TS. Nguyễn Thị Lan',
    progress: 65,
    schedule: 'Thứ 3, 7:00 - 9:00',
    room: 'Phòng TC-205',
    lessonProgress: '16/24',
    image: 'test1.jpg',
  },
  {
    id: 2,
    courseCode: 'IT3230',
    courseName: 'Cấu trúc dữ liệu và Giải thuật',
    instructor: 'PGS.TS. Trần Văn Minh',
    progress: 42,
    schedule: 'Thứ 5, 13:00 - 15:00',
    room: 'Phòng D3-301',
    lessonProgress: '13/30',
    image: 'test2.jpg',
  },
  {
    id: 3,
    courseCode: 'IT4556',
    courseName: 'Trí tuệ nhân tạo',
    instructor: 'TS. Lê Hoàng Nam',
    progress: 88,
    schedule: 'Thứ 6, 9:00 - 11:00',
    room: 'Phòng D9-201',
    lessonProgress: '22/25',
    image: 'test3.jpg',
  },
];

export const mockAssignments: Assignment[] = [
  {
    id: 1,
    title: 'Bài tập lớn: Xây dựng website Portfolio',
    courseCode: 'IT4409',
    deadline: '28/11/2025',
    status: 'in-progress' as const,
  },
  {
    id: 2,
    title: 'Bài tập: Cài đặt cây nhị phân tìm kiếm',
    courseCode: 'IT3230',
    deadline: '30/11/2025',
    status: 'pending' as const,
  },
  {
    id: 3,
    title: 'Dự án: Nghiên cứu người dùng',
    courseCode: 'IT4556',
    deadline: '02/12/2025',
    status: 'pending' as const,
  },
];

export const mockNotifications: Notification[] = [
  {
    id: 1,
    title: 'Bài giảng mới đã được đăng tải',
    description: 'Môn học IT4409',
    time: '2 giờ trước',
  },
  {
    id: 2,
    title: 'Nhắc nhở: Bài tập sắp hết hạn',
    description: 'Bài tập IT3230 - Hạn: 30/11/2025',
    time: '5 giờ trước',
  },
];
