import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer/Footer';
import { CategoryCard } from '@/components/Card/CategoryCard';
import { JobCard } from '@/components/Card/JobCard';
import { FreelancerCard } from '@/components/Card/FreelancerCard';
import { StatsRow } from '@/components/Stats/StatsRow';
import { StepItem } from '@/components/Steps/StepItem';
import { 
  CATEGORIES, 
  FEATURED_JOBS, 
  TOP_FREELANCERS, 
  POPULAR_SEARCH_TAGS,
  STATS_DATA,
  HOW_IT_WORKS_STEPS
} from '@/constants';
import { 
  Search, 
  ArrowRight, 
  ShieldCheck, 
  Sparkles
} from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      {/* HERO SECTION */}
      <section className="relative pt-12 pb-24 lg:pt-20 lg:pb-32 overflow-hidden bg-gradient-to-b from-emerald-50/40 via-white to-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            
            {/* Pill Badge */}
            <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-emerald-100/80 border border-emerald-200 text-emerald-800 text-xs font-semibold uppercase tracking-wider shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>Nền Tảng Kết Nối Freelancer Uy Tín #1</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-tight sm:leading-tight">
              Kết Nối Chuyên Gia.<br />
              <span className="text-emerald-600">Hoàn Thành Dự Án Vượt Trội.</span>
            </h1>

            {/* Subheading */}
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
              Tìm kiếm hàng ngàn dự án công nghệ, thiết kế, marketing hoặc thuê chuyên gia trình độ cao làm việc ngay hôm nay.
            </p>

            {/* Search Box */}
            <div className="pt-4 max-w-2xl mx-auto">
              <div className="bg-white p-2 rounded-2xl sm:rounded-full border border-slate-200 shadow-xl flex flex-col sm:flex-row items-center gap-2">
                <div className="relative flex-1 w-full pl-3 flex items-center">
                  <Search className="w-5 h-5 text-slate-400 shrink-0" />
                  <input
                    type="text"
                    placeholder="Bạn cần làm gì? (vd: Next.js, Figma, Logo, Website...)"
                    className="w-full bg-transparent text-slate-800 placeholder-slate-400 px-3 py-3 text-sm focus:outline-none"
                  />
                </div>
                <button className="w-full sm:w-auto gradient-button text-white font-semibold text-sm px-8 py-3.5 rounded-xl sm:rounded-full flex items-center justify-center space-x-2 shrink-0 shadow-md">
                  <span>Tìm Việc Ngay</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {/* Popular Tags */}
              <div className="flex flex-wrap items-center justify-center gap-2 mt-4 text-xs text-slate-600">
                <span className="text-slate-400 font-medium">Gợi ý từ khóa:</span>
                {POPULAR_SEARCH_TAGS.map((tag) => (
                  <Link 
                    key={tag} 
                    href={`/jobs?q=${tag}`} 
                    className="px-3 py-1 rounded-full bg-white border border-slate-200 text-slate-600 hover:border-emerald-500 hover:text-emerald-600 transition-colors shadow-2xs"
                  >
                    {tag}
                  </Link>
                ))}
              </div>
            </div>

            {/* Stats Row Component */}
            <StatsRow stats={STATS_DATA} />

          </div>
        </div>
      </section>

      {/* CATEGORIES SECTION */}
      <section className="py-16 bg-white border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">Danh Mục Ngành Nghề Nổi Bật</h2>
              <p className="text-slate-500 text-sm mt-2">Khám phá công việc theo đúng chuyên môn và kỹ năng của bạn</p>
            </div>
            <Link href="/categories" className="inline-flex items-center space-x-2 text-emerald-600 hover:text-emerald-700 font-medium text-sm mt-4 md:mt-0 transition-colors">
              <span>Xem tất cả danh mục</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {CATEGORIES.map((cat, i) => (
              <CategoryCard
                key={i}
                index={i}
                title={cat.title}
                count={cat.count}
                color={cat.color}
                icon={cat.icon}
              />
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED JOBS SECTION */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <div className="text-emerald-600 font-semibold text-xs tracking-wider uppercase mb-1">Cơ hội công việc mới nhất</div>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">Dự Án Mới Đang Chờ Chào Thầu</h2>
            </div>
            <Link href="/jobs" className="inline-flex items-center space-x-2 text-emerald-600 hover:text-emerald-700 font-medium text-sm mt-4 md:mt-0 transition-colors">
              <span>Xem tất cả công việc</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="space-y-4">
            {FEATURED_JOBS.map((job) => (
              <JobCard key={job.id} {...job} />
            ))}
          </div>
        </div>
      </section>

      {/* TOP FREELANCERS SECTION */}
      <section className="py-20 bg-white border-t border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <div className="text-emerald-600 font-semibold text-xs tracking-wider uppercase">Chuyên gia xuất sắc</div>
            <h2 className="text-3xl font-bold text-slate-900">Top Freelancer Được Đánh Giá Cao</h2>
            <p className="text-slate-500 text-sm">Thuê những tài năng đầu ngành với kinh nghiệm thực chiến đã qua kiểm duyệt</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {TOP_FREELANCERS.map((fl) => (
              <FreelancerCard key={fl.id} {...fl} />
            ))}
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US / HOW IT WORKS */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            <div className="space-y-6">
              <div className="text-emerald-600 font-semibold text-xs tracking-wider uppercase">Quy trình minh bạch</div>
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 leading-tight">
                Làm Việc An Toàn.<br />Thanh Toán Khi Hài Lòng.
              </h2>
              <p className="text-slate-600 text-sm leading-relaxed">
                WorkHub cung cấp hệ thống Escrow (ký quỹ bảo đảm). Khách hàng chỉ nạp tiền ký quỹ cho dự án và chỉ giải ngân khi công việc hoàn thành đúng cam kết.
              </p>

              <div className="space-y-4 pt-2">
                {HOW_IT_WORKS_STEPS.map((item, idx) => (
                  <StepItem
                    key={idx}
                    step={item.step}
                    title={item.title}
                    description={item.description}
                  />
                ))}
              </div>
            </div>

            {/* Illustration Card */}
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xl space-y-6 relative overflow-hidden">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center space-x-3">
                  <ShieldCheck className="w-8 h-8 text-emerald-600" />
                  <div>
                    <div className="text-slate-900 font-bold text-sm">Hệ Thống Bảo Đảm WorkHub Escrow</div>
                    <div className="text-slate-500 text-xs">Bảo vệ 100% tài chính cho 2 bên</div>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex justify-between items-center text-xs">
                  <span className="text-slate-500">Trạng thái ký quỹ</span>
                  <span className="text-emerald-700 font-semibold bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">Đã khóa tiền ký quỹ</span>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex justify-between items-center text-xs">
                  <span className="text-slate-500">Tiến độ công việc</span>
                  <span className="text-blue-600 font-semibold">Giai đoạn 2/3 (80%)</span>
                </div>
              </div>

              <div className="pt-2 text-center">
                <Link href="/register" className="inline-block gradient-button text-white font-medium text-sm px-8 py-3 rounded-xl shadow-md">
                  Tham Gia Ngay Hôm Nay
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
