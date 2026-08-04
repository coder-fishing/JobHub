import { ProjectResponse } from '@/types/api';
import { 
  Code2, 
  Palette, 
  Megaphone, 
  PenTool, 
  Video, 
  Smartphone, 
  Database, 
  TrendingUp 
} from 'lucide-react';

export const CATEGORIES = [
  { icon: Code2, title: 'Lập Trình & IT', count: '1,240+ việc làm', color: 'bg-blue-50 text-blue-600 border-blue-100' },
  { icon: Palette, title: 'Thiết Kế & Graphic', count: '850+ việc làm', color: 'bg-purple-50 text-purple-600 border-purple-100' },
  { icon: Megaphone, title: 'Digital Marketing', count: '620+ việc làm', color: 'bg-amber-50 text-amber-600 border-amber-100' },
  { icon: PenTool, title: 'Viết Lách & Dịch Thuật', count: '430+ việc làm', color: 'bg-emerald-50 text-emerald-600 border-emerald-100' },
  { icon: Video, title: 'Video & Âm Thanh', count: '310+ việc làm', color: 'bg-rose-50 text-rose-600 border-rose-100' },
  { icon: Smartphone, title: 'Mobile App', count: '540+ việc làm', color: 'bg-indigo-50 text-indigo-600 border-indigo-100' },
  { icon: Database, title: 'Phân Tích Dữ Liệu', count: '290+ việc làm', color: 'bg-cyan-50 text-cyan-600 border-cyan-100' },
  { icon: TrendingUp, title: 'Kinh Doanh & Tư Vấn', count: '380+ việc làm', color: 'bg-teal-50 text-teal-600 border-teal-100' },
];

// Mock API Projects khớp đúng cấu trúc của Spring Boot ProjectResponse
export const MOCK_PROJECTS_API: ProjectResponse[] = [
  {
    id: 1,
    clientId: 101,
    clientEmail: 'client.techcorp@gmail.com',
    title: 'Xây dựng Website E-commerce sử dụng Next.js & TailwindCSS',
    description: 'Cần tìm Freelancer lập trình giao diện Website bán hàng tốc độ cao, tối ưu SEO, hỗ trợ Responsive.',
    budget: 25000000,
    requiredSkills: 'Next.js, React, TailwindCSS, TypeScript, RESTful API',
    maxFreelancers: 2,
    status: 'OPEN',
    deadline: '2026-09-15',
    createdAt: '2026-08-04T10:00:00'
  },
  {
    id: 2,
    clientId: 102,
    clientEmail: 'startup.fintech@gmail.com',
    title: 'Thiết kế UI/UX App Mobile Quản lý Tài chính Cá nhân',
    description: 'Thiết kế Wireframe và Prototype cho ứng dụng Android/iOS với màu sắc chủ đạo xanh lá hiện đại.',
    budget: 18000000,
    requiredSkills: 'Figma, Mobile UI, Prototyping, User Research',
    maxFreelancers: 1,
    status: 'OPEN',
    deadline: '2026-08-30',
    createdAt: '2026-08-04T12:30:00'
  },
  {
    id: 3,
    clientId: 103,
    clientEmail: 'logistics.global@gmail.com',
    title: 'Lập trình Backend Spring Boot cho Hệ thống Đặt vé',
    description: 'Xây dựng RESTful API kết nối PostgreSQL, phân quyền JWT, quản lý lịch đặt vé và thanh toán trực tuyến.',
    budget: 45000000,
    requiredSkills: 'Java, Spring Boot, PostgreSQL, Microservices, Docker',
    maxFreelancers: 3,
    status: 'OPEN',
    deadline: '2026-10-01',
    createdAt: '2026-08-03T15:45:00'
  }
];

export const TOP_FREELANCERS = [
  {
    id: 1,
    name: 'Nguyễn Văn Minh',
    role: 'Senior Fullstack Developer',
    rating: 4.9,
    reviews: 48,
    hourlyRate: '350.000 VNĐ/giờ',
    completedJobs: 52,
    skills: ['React', 'Next.js', 'Node.js', 'Spring Boot'],
    avatarBg: 'from-emerald-400 to-teal-600'
  },
  {
    id: 2,
    name: 'Trần Thị Thu Hà',
    role: 'Lead UI/UX Designer',
    rating: 5.0,
    reviews: 64,
    hourlyRate: '400.000 VNĐ/giờ',
    completedJobs: 71,
    skills: ['Figma', 'UI/UX Design', 'Design System', 'Wireframing'],
    avatarBg: 'from-purple-400 to-indigo-600'
  },
  {
    id: 3,
    name: 'Lê Hoàng Nam',
    role: 'DevOps & Cloud Engineer',
    rating: 4.8,
    reviews: 32,
    hourlyRate: '450.000 VNĐ/giờ',
    completedJobs: 39,
    skills: ['AWS', 'Docker', 'Kubernetes', 'CI/CD', 'Terraform'],
    avatarBg: 'from-blue-400 to-cyan-600'
  }
];

export const POPULAR_SEARCH_TAGS = ['Next.js', 'Spring Boot', 'Figma Design', 'React Native', 'SEO Content'];

export const CLIENT_FOOTER_LINKS = [
  { label: 'Đăng dự án mới', href: '/post-job' },
  { label: 'Tìm kiếm Freelancer', href: '/freelancers' },
  { label: 'Giải pháp Doanh nghiệp', href: '/enterprise' },
  { label: 'Bảng giá dịch vụ', href: '/pricing' },
];

export const FREELANCER_FOOTER_LINKS = [
  { label: 'Tìm việc làm online', href: '/jobs' },
  { label: 'Tạo hồ sơ năng lực', href: '/profile/setup' },
  { label: 'Kinh nghiệm chào thầu', href: '/resources' },
  { label: 'Hệ thống chứng chỉ', href: '/badges' },
];

export const LEGAL_FOOTER_LINKS = [
  { label: 'Chính sách bảo mật', href: '/privacy' },
  { label: 'Điều khoản dịch vụ', href: '/terms' },
  { label: 'An toàn & Bảo mật', href: '/security' },
];

export const NAV_ITEMS = [
  {
    label: 'Tìm Việc Làm',
    subItems: [
      { label: 'Tất cả công việc', href: '/jobs' },
      { label: 'Dự án trọn gói', href: '/jobs?type=fixed' },
      { label: 'Công việc theo giờ', href: '/jobs?type=hourly' },
    ],
  },
  {
    label: 'Tìm Freelancer',
    subItems: [
      { label: 'Freelancers hàng đầu', href: '/freelancers' },
      { label: 'Theo kỹ năng & Ngành nghề', href: '/categories' },
    ],
  },
  {
    label: 'Cách Hoạt Động',
    href: '/how-it-works',
  },
];

export const STATS_DATA = [
  { value: '10.000+', label: 'Dự án đã hoàn thành' },
  { value: '5.000+', label: 'Freelancers uy tín' },
  { value: '99.2%', label: 'Tỷ lệ hài lòng' },
  { value: '24/7', label: 'Hỗ trợ khách hàng' },
];

export const HOW_IT_WORKS_STEPS = [
  {
    step: '1',
    title: 'Đăng dự án miễn phí',
    description: 'Tạo yêu cầu dự án trong 2 phút và nhận ngay đề xuất từ các Freelancer phù hợp.',
  },
  {
    step: '2',
    title: 'Lựa chọn ứng viên tốt nhất',
    description: 'Xem hồ sơ, đánh giá từ khách hàng cũ, lịch sử công việc và phỏng vấn trước khi trao dự án.',
  },
  {
    step: '3',
    title: 'Ký quỹ & Nghiệm thu an toàn',
    description: 'Tiền được giữ an toàn trên hệ thống cho tới khi dự án được nghiệm thu đạt yêu cầu.',
  },
];
