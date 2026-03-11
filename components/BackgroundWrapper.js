'use client';
import AnimatedBackground from './AnimatedBackground';
import Navigation from './Navigation';
import { usePathname } from 'next/navigation';

export default function BackgroundWrapper({ children }) {
  const pathname = usePathname();

  // Hide navigation on dashboard, admin, login, and register pages
  const hideNavigation =
    pathname?.startsWith('/dashboard') ||
    pathname?.startsWith('/admin') ||
    pathname === '/login' ||
    pathname === '/register';

  return (
    <>
      <AnimatedBackground />
      {!hideNavigation && <Navigation />}
      <div className="relative z-10">
        {children}
      </div>
    </>
  );
}
