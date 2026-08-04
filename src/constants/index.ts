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

export const FEATURED_JOBS = [
  {
    id: 1,
    title: 'Xây dựng Website E-commerce sử dụng Next.js & TailwindCSS',
    client: 'TechCorp Vietnam',
    type: 'Dự án trọn gói',
    budget: '15.000.000 - 25.000.000 VNĐ',
    location: 'Toàn quốc (Remote)',
    postedAt: '2 giờ trước',
    proposals: 8,
    skills: ['Next.js', 'React', 'TailwindCSS', 'TypeScript', 'RESTful API'],
    urgent: true
  },
  {
    id: 2,
    title: 'Thiết kế UI/UX App Mobile Quản lý Tài chính Cá nhân',
    client: 'Fintech Startup',
    type: 'Theo giờ',
    budget: '250.000 - 350.000 VNĐ / giờ',
    location: 'Remote',
    postedAt: '5 giờ trước',
    proposals: 14,
    skills: ['Figma', 'Mobile UI', 'Prototyping', 'User Research'],
    urgent: false
  },
  {
    id: 3,
    title: 'Lập trình Backend Spring Boot cho Hệ thống Đặt vé',
    client: 'Global Logistics JSC',
    type: 'Dự án trọn gói',
    budget: '30.000.000 - 45.000.000 VNĐ',
    location: 'TP. Hồ Chí Minh / Remote',
    postedAt: '1 ngày trước',
    proposals: 6,
    skills: ['Java', 'Spring Boot', 'PostgreSQL', 'Microservices', 'Docker'],
    urgent: true
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



