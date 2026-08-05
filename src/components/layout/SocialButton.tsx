import Link from 'next/link';

interface SocialIconProps {
  href: string;
  icon: React.ReactNode;
  ariaLabel: string;
}

export function SocialButton({ href, icon, ariaLabel }: SocialIconProps) {
  return (
    <a
      href={href}
      aria-label={ariaLabel}
      className="w-9 h-9 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center hover:bg-slate-800 hover:text-emerald-400 transition-colors"
    >
      {icon}
    </a>
  );
}
