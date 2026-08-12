'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Search, ChevronDown, Sparkles, Menu, X } from 'lucide-react';
import { NAV_ITEMS } from '@/constants';
import { usePathname, useRouter } from 'next/navigation';

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [authRole, setAuthRole] = useState<'CLIENT' | 'FREELANCER' | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
// 🟢 THÊM DÒNG NÀY: State lưu chữ người dùng gõ trên Navbar
  const [navSearchTerm, setNavSearchTerm] = useState('');

  const [userProfile, setUserProfile] = useState<{
    email?: string;
    fullName?: string;
    avatarUrl?: string;
  }>({});
  const router = useRouter();
  const pathname = usePathname();

// 🟢 THÊM HÀM NÀY: Xử lý khi nhấn Enter trên ô tìm kiếm Navbar
  const handleNavSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (navSearchTerm.trim()) {
      router.push(`/jobs?skills=${encodeURIComponent(navSearchTerm.trim())}`);
      setNavSearchTerm(''); // Reset ô nhập sau khi tìm
    } else {
      router.push('/jobs');
    }
  };
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setIsAuthenticated(false);
        setAuthRole(null);
        setUserProfile({});
        return;
      }
      try {
        const res = await fetch('http://localhost:8080/api/auth/me', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setIsAuthenticated(true);
          setAuthRole(data.role);
          setUserProfile({
            email: data.email,
            fullName: data.fullName || localStorage.getItem('user_fullname') || '',
            avatarUrl: data.avatarUrl || localStorage.getItem('user_avatar') || ''
          });

          if (data.role) localStorage.setItem('user_role', data.role);
          if (data.fullName) localStorage.setItem('user_fullname', data.fullName);
          if (data.avatarUrl) localStorage.setItem('user_avatar', data.avatarUrl);
        } else {
          setIsAuthenticated(false);
          setAuthRole(null);
          setUserProfile({});
        }
      } catch (e) {
        console.error("Lỗi xác thực Navbar", e);
      }
    };
    checkAuth();
  }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user_role');
    localStorage.removeItem('user_fullname');
    localStorage.removeItem('user_avatar');
    window.location.href = '/login';
  };

  const getInitial = () => {
    if (userProfile.fullName && userProfile.fullName.trim()) {
      return userProfile.fullName.trim().charAt(0).toUpperCase();
    }
    if (userProfile.email) {
      return userProfile.email.charAt(0).toUpperCase();
    }
    return 'U';
  };

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Brand */}
          <div className="flex items-center space-x-10">
            <Link href="/" className="flex items-center space-x-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-600 flex items-center justify-center shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform duration-200">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-2xl font-bold tracking-tight text-slate-900">
                Work<span className="text-emerald-600">Hub</span>
              </span>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center space-x-8">
              {NAV_ITEMS.map((item, index) => {
                if (item.subItems) {
                  return (
                    <div key={index} className="relative group">
                      <button className="flex items-center space-x-1 text-slate-600 hover:text-slate-900 font-medium text-sm py-2 transition-colors">
                        <span>{item.label}</span>
                        <ChevronDown className="w-4 h-4 text-slate-400 group-hover:rotate-180 transition-transform duration-200" />
                      </button>
                      <div className="absolute top-full left-0 w-56 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                        <div className="bg-white rounded-2xl p-2 shadow-xl border border-slate-100 space-y-1">
                          {item.subItems.map((sub, sIdx) => (
                            <Link
                              key={sIdx}
                              href={sub.href}
                              className="block px-4 py-2.5 rounded-xl text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors"
                            >
                              {sub.label}
                            </Link>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                }

                return (
                  <Link
                    key={index}
                    href={item.href || '#'}
                    className="text-slate-600 hover:text-slate-900 font-medium text-sm transition-colors"
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Search & Actions */}
          <div className="hidden lg:flex items-center space-x-6">
            {/* <div className="relative">
              <input
                type="text"
                placeholder="Tìm dự án, kỹ năng..."
                className="w-64 bg-slate-50 border border-slate-200 text-slate-800 text-sm rounded-full pl-10 pr-4 py-2.5 focus:outline-none focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500/10 transition-all placeholder:text-slate-400"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div> */}

            {/* 🟢 [SỬA]: Bọc input bằng form và gắn onSubmit={handleNavSearch} */}
            <form onSubmit={handleNavSearch} className="relative">
              <input
                type="text"
                placeholder="Tìm dự án, kỹ năng..."
                value={navSearchTerm} // 🟢 Gán value
                onChange={(e) => setNavSearchTerm(e.target.value)} // 🟢 Bắt sự kiện gõ phím
                className="w-64 bg-slate-50 border border-slate-200 text-slate-800 text-sm rounded-full pl-10 pr-4 py-2.5 focus:outline-none focus:border-emerald-500 focus:bg-white focus:ring-2 focus:ring-emerald-500/10 transition-all placeholder:text-slate-400"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            </form>

            <div className="flex items-center space-x-3">
              {isAuthenticated ? (
                <>
                  {/* <Link
                    href="/dashboard"
                    className="text-slate-700 hover:text-slate-900 font-medium text-sm px-4 py-2.5 rounded-full transition-colors hover:bg-slate-100"
                  >
                    Dashboard
                  </Link> */}

                  {authRole === 'CLIENT' && (
                    <Link
                      href="/jobs/create"
                      className="bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-medium text-sm px-5 py-2.5 rounded-full border border-emerald-200 transition-all"
                    >
                      Đăng Dự Án
                    </Link>
                  )}

                  {/* Profile & Avatar Menu Dropdown */}
                  <div className="relative group pl-2">
                    <button className="flex items-center space-x-3 p-1.5 rounded-full border border-slate-200 hover:border-emerald-500 transition-all bg-white shadow-xs">
                      {userProfile.avatarUrl ? (
                        <img
                          src={userProfile.avatarUrl}
                          alt="User Avatar"
                          className="w-9 h-9 rounded-full object-cover border border-emerald-500"
                        />
                      ) : (
                        <div className="w-9 h-9 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-sm shadow-inner">
                          {getInitial()}
                        </div>
                      )}
                      <div className="flex flex-col text-left pr-1">
                        <span className="text-xs font-semibold text-slate-900 max-w-[100px] truncate">
                          {userProfile.fullName || userProfile.email || 'Account'}
                        </span>
                        <span className="text-[10px] uppercase font-bold text-emerald-600 tracking-wider">
                          {authRole}
                        </span>
                      </div>
                      <ChevronDown className="w-4 h-4 text-slate-400 group-hover:rotate-180 transition-transform duration-200 pr-1" />
                    </button>

                    {/* Dropdown Menu */}
                    <div className="absolute top-full right-0 w-60 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                      <div className="bg-white rounded-2xl p-2 shadow-2xl border border-slate-100 space-y-1">
                        <div className="px-4 py-3 border-b border-slate-100">
                          <p className="text-sm font-semibold text-slate-900 truncate">
                            {userProfile.fullName || 'Người dùng WorkHub'}
                          </p>
                          <p className="text-xs text-slate-500 truncate">{userProfile.email}</p>
                        </div>
                        <Link
                          href="/profile"
                          className="block px-4 py-2.5 rounded-xl text-sm font-medium text-slate-700 hover:text-emerald-700 hover:bg-emerald-50 transition-colors"
                        >
                          Hồ sơ & Tài khoản
                        </Link>
                        <Link
                          href="/dashboard"
                          className="block px-4 py-2.5 rounded-xl text-sm font-medium text-slate-700 hover:text-emerald-700 hover:bg-emerald-50 transition-colors"
                        >
                          Bảng điều khiển (Dashboard)
                        </Link>
                        <div className="pt-1 border-t border-slate-100">
                          <button
                            onClick={handleLogout}
                            className="w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                          >
                            Đăng xuất
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="text-slate-700 hover:text-slate-900 font-medium text-sm px-4 py-2.5 rounded-full transition-colors hover:bg-slate-100"
                  >
                    Đăng Nhập
                  </Link>
                  <Link
                    href="/register"
                    className="gradient-button text-white font-medium text-sm px-5 py-2.5 rounded-full shadow-md shadow-emerald-500/20"
                  >
                    Đăng Ký
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex lg:hidden items-center space-x-4">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-slate-600 hover:text-slate-900 p-2 rounded-lg"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 pt-4 pb-6 space-y-4 shadow-lg">
          {/* <input
            type="text"
            placeholder="Tìm kiếm dự án..."
            className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-sm rounded-xl px-4 py-3 focus:outline-none focus:border-emerald-500"
          /> */}
          {/* 🟢 [SỬA]: Bọc input mobile bằng form */}
          <form onSubmit={(e) => { handleNavSearch(e); setIsMobileMenuOpen(false); }}>
            <input
              type="text"
              placeholder="Tìm kiếm dự án..."
              value={navSearchTerm}
              onChange={(e) => setNavSearchTerm(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-sm rounded-xl px-4 py-3 focus:outline-none focus:border-emerald-500"
            />
          </form>
          <div className="space-y-2">
            {NAV_ITEMS.map((item, i) => (
              <Link 
                key={i} 
                href={item.href || (item.subItems ? item.subItems[0].href : '#')} 
                className="block text-slate-700 hover:text-emerald-600 py-2 font-medium"
              >
                {item.label}
              </Link>
            ))}
          </div>
          <div className="pt-4 border-t border-slate-100 flex flex-col space-y-3">
            <Link
              href="/login"
              className="text-center text-slate-700 hover:text-slate-900 font-medium text-sm py-2.5 rounded-xl border border-slate-200"
            >
              Đăng Nhập
            </Link>
            <Link
              href="/register"
              className="text-center gradient-button text-white font-medium text-sm py-2.5 rounded-xl"
            >
              Đăng Ký
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
