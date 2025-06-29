'use client';
import Link from 'next/dist/client/link';
import React, { JSX } from 'react';
import { Button } from '../ui/button';
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
  loginText?: string;
  logoText?: string;
  languageSwitcher?: JSX.Element;
}

export function NavBar({ items, selectedPath, loginText = 'Login', logoText = 'Visionar.Ai', languageSwitcher }: NavBarProps) {
  return (
    <nav className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur border-b border-border flex items-center justify-between px-6 py-3">
      {/* Logo */}
      <div className="flex items-center gap-2">
        {/* Replace with your SVG or image logo */}
        <span className="font-bold text-lg tracking-tight">{logoText}</span>
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
        <Button
          variant="secondary"
          asChild>
          <Link href="/login">{loginText}</Link>
        </Button>
        {languageSwitcher}
        <ThemeSwitcher />
      </div>
    </nav>
  );
}
