import Link from 'next/link';

interface FooterColumnProps {
  title: string;
  links: Array<{ label: string; href: string }>;
}

export const FooterColumn = ({ title, links }: FooterColumnProps) => {
  return (
    <div className="space-y-4">
      <h4 className="text-white text-sm font-semibold tracking-wider uppercase">{title}</h4>
      <ul className="space-y-2.5 text-sm">
        {links.map((link, i) => (
          <li key={i}>
            <Link href={link.href} className="hover:text-emerald-400 transition-colors">
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}