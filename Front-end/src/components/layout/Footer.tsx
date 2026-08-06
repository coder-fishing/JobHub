import Link from 'next/link';
import { Sparkles, Mail, Phone, MapPin, Globe, Share2, MessageCircle } from 'lucide-react';
import { CLIENT_FOOTER_LINKS, FREELANCER_FOOTER_LINKS, LEGAL_FOOTER_LINKS } from '@/constants';
import { SocialButton } from './SocialButton';
import { FooterColumn } from './FooterColumn';

export default function Footer() {
  return (
    <footer className="bg-slate-900 border-t border-slate-800 text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-6">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-500 flex items-center justify-center shadow-md">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white">
                Work<span className="text-emerald-400">Hub</span>
              </span>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              Nền tảng kết nối Doanh nghiệp & Nhà tuyển dụng với hàng ngàn Freelancer tài năng hàng đầu Việt Nam. Nhanh chóng, minh bạch và an toàn.
            </p>
            <div className="flex items-center space-x-3 pt-2">
              <SocialButton href="#" ariaLabel="GitHub" icon={<Globe className="w-4.5 h-4.5" />} />
              <SocialButton href="#" ariaLabel="Website" icon={<Globe className="w-4.5 h-4.5" />} />
              <SocialButton href="#" ariaLabel="Community" icon={<MessageCircle className="w-4.5 h-4.5" />} />
              <SocialButton href="#" ariaLabel="Share" icon={<Share2 className="w-4.5 h-4.5" />} />
            </div>
          </div>

          {/* Nav Links Column 1: Client */}
          <FooterColumn title="Dành Cho Client" links={CLIENT_FOOTER_LINKS} />

          {/* Nav Links Column 2: Freelancer */}
          <FooterColumn title="Dành Cho Freelancer" links={FREELANCER_FOOTER_LINKS} />

          {/* Nav Links Column 3: Contact */}
          <div className="space-y-4">
            <h4 className="text-white text-sm font-semibold tracking-wider uppercase">Hỗ Trợ & Liên Hệ</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center space-x-3 text-slate-400">
                <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>support@workhub.vn</span>
              </li>
              <li className="flex items-center space-x-3 text-slate-400">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>0797 526 054 (8:00 - 20:00)</span>
              </li>
              <li className="flex items-start space-x-3 text-slate-400">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-1" />
                <span>Nam Hải Lăng, Quảng Trị</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-12 mt-12 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <p>© 2026 WorkHub Inc. Tất cả quyền được bảo lưu.</p>
          <div className="flex space-x-6">
            {LEGAL_FOOTER_LINKS.map((item, i) => (
              <Link key={i} href={item.href} className="hover:text-white transition-colors">
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
