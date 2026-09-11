import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import MobileNav from './MobileNav';

export default function AppShell({ children }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100 selection:bg-indigo-500 selection:text-white">
      {/* Desktop Sidebar (hidden on mobile) */}
      <Sidebar className="hidden sm:flex shrink-0" />

      {/* Mobile Drawer Navigation */}
      <MobileNav isOpen={mobileMenuOpen} setIsOpen={setMobileMenuOpen} />

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-w-0 pb-16 sm:pb-0">
        {/* Top Header */}
        <Header />

        {/* Content Body */}
        <main className="flex-1 overflow-y-auto focus:outline-none">
          {children}
        </main>
      </div>
    </div>
  );
}
