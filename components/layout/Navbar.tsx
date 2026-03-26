"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/Button";
import { cn, hashColor } from "@/lib/utils";

export function Navbar() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/login"; // Force full reload to clear SWR cache
  };

  const ChefHatIcon = () => (
    <svg className="h-6 w-6 text-primary" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21a1 1 0 0 0 1-1v-5.35c0-.457.316-.844.727-1.041a4 4 0 0 0-2.134-7.589v-.01A4 4 0 0 0 8.595 12c-2.3.895-3.32 3.553-2.134 5.952.41.198.727.585.727 1.041V20a1 1 0 0 0 1 1Z"/>
      <path d="M6 21h12"/>
      <path d="M12 17v4"/>
    </svg>
  );

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur flex-none transition-colors duration-500 border-b border-border bg-surface/80">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-8">
          <Link href="/" className="flex items-center space-x-2">
            <ChefHatIcon />
            <span className="text-xl font-bold tracking-tight text-primary">RecipeBox</span>
          </Link>
          
          <nav className="hidden md:flex space-x-6 text-sm font-medium text-text-secondary">
            <Link href="/" className="hover:text-primary transition-colors">Home</Link>
            <Link href="/recipes" className="hover:text-primary transition-colors">Recipes</Link>
            <Link href="/recipes/new" className="hover:text-primary transition-colors">New Recipe</Link>
            <Link href="/about" className="hover:text-primary transition-colors">About Us</Link>
          </nav>
        </div>

        <div className="flex items-center space-x-4">
          {!isLoading && (
            isAuthenticated && user ? (
              <Menu as="div" className="relative inline-block text-left">
                <Menu.Button className="flex items-center focus:outline-none">
                  <div
                    className="h-10 w-10 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-sm ring-2 ring-transparent transition-all hover:ring-primary/50"
                    style={{ backgroundColor: hashColor(user.email) }}
                  >
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                </Menu.Button>
                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right rounded-xl bg-surface shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none divide-y divide-border z-50">
                    <div className="px-4 py-3">
                      <p className="text-sm">Signed in as</p>
                      <p className="truncate text-sm font-bold text-text-primary">{user.email}</p>
                    </div>
                    <div className="py-1">
                      <Menu.Item>
                        {({ active }) => (
                          <Link href="/profile" className={cn(active ? 'bg-accent/10 text-primary' : 'text-text-primary', 'block px-4 py-2 text-sm')}>Profile</Link>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <Link href="/recipes" className={cn(active ? 'bg-accent/10 text-primary' : 'text-text-primary', 'block px-4 py-2 text-sm')}>My Recipes</Link>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <Link href="/recipes/new" className={cn(active ? 'bg-accent/10 text-primary' : 'text-text-primary', 'block px-4 py-2 text-sm')}>Create Recipe</Link>
                        )}
                      </Menu.Item>
                    </div>
                    <div className="py-1">
                      <Menu.Item>
                        {({ active }) => (
                          <button onClick={handleLogout} className={cn(active ? 'bg-danger/10 text-danger' : 'text-text-primary', 'block w-full text-left px-4 py-2 text-sm')}>Log out</button>
                        )}
                      </Menu.Item>
                    </div>
                  </Menu.Items>
                </Transition>
              </Menu>
            ) : (
              <>
                <Link href="/login" className="text-sm font-medium text-text-secondary hover:text-primary transition-colors">
                  Login
                </Link>
                <Button size="sm" onClick={() => router.push('/register')}>
                  Sign up
                </Button>
              </>
            )
          )}
        </div>
      </div>
    </header>
  );
}
