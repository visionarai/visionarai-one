'use client';
import React from 'react';
import { LanguageSwitcher } from './LanguageSwitcher';
import { ThemeSwitcher } from './ThemeSwitcher';

export interface NavigationItem {
  title: string;
  path: string;
  icon: React.ReactNode;
  iconSelected: React.ReactNode;
}

interface NavBarProps {
  items: NavigationItem[];
  selectedPath?: string;
}

export function NavBar({ items, selectedPath }: NavBarProps) {
  return (
    <nav className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur border-b border-border flex items-center justify-between px-6 py-3">
      {/* Logo */}
      <div className="flex items-center gap-2">
        {/* Replace with your SVG or image logo */}
        <span className="font-bold text-lg tracking-tight">Visionar.Ai</span>
      </div>
      {/* Navigation Links & Switchers */}
      <div className="flex items-center gap-4">
        {items.map(item => {
          const selected = selectedPath === item.path;
          return (
            <a
              key={item.path}
              href={item.path}
              className={`flex items-center gap-1 text-sm font-medium hover:underline ${selected ? 'text-primary' : ''}`}
              aria-current={selected ? 'page' : undefined}>
              {selected ? item.iconSelected : item.icon}
              <span>{item.title}</span>
            </a>
          );
        })}
        <LanguageSwitcher />
        <ThemeSwitcher />
      </div>
    </nav>
  );
}
