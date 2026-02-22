import { ReactNode, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Logo } from '@/components/Logo';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Users,
  CreditCard,
  FileText,
  LogOut,
  Menu,
  X,
  ChevronRight,
  Shield,
} from 'lucide-react';
import { DialogContext } from "@/contexts/DialogContext";

interface AdminLayoutProps {
  children: ReactNode;
}

const navItems = [
  { href: '/admin', label: 'Overview', icon: LayoutDashboard },
  { href: '/admin/applications', label: 'Applications', icon: Users },
  { href: '/admin/withdrawals', label: 'Withdrawals', icon: CreditCard },
  { href: '/admin/surveys', label: 'Surveys', icon: FileText },
];

export function AdminLayout({ children }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <DialogContext.Provider value={{ dialogOpen, setDialogOpen }}>
    <div className="min-h-screen flex bg-background">
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 border-r border-border bg-card">
        {/* Logo */}
        <div className="flex h-16 items-center px-6 border-b border-border">
          <Link to="/admin" className="flex items-center gap-2">
            <Logo className="h-8 w-auto" />
            <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-0.5 rounded">
              Admin
            </span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                )}
              >
                <item.icon className="h-5 w-5" />
                {item.label}
                {isActive && <ChevronRight className="ml-auto h-4 w-4" />}
              </Link>
            );
          })}
        </nav>

        {/* Admin User Section */}
        <div className="p-4 border-t border-border">
          <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-primary/5 border border-primary/20">
            <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center">
              <Shield className="h-4 w-4 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user?.name}</p>
              <p className="text-xs text-primary truncate">Administrator</p>
            </div>
          </div>
          <div className="flex gap-2 mt-2">
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={() => navigate('/surveys')}
            >
              User View
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-muted-foreground hover:text-destructive"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </aside>

      {/* Mobile Header */}
      <div
        className={cn(
          "lg:hidden fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/80",
          !dialogOpen && "backdrop-blur-xl"
        )}
      >
        <div className="flex h-16 items-center justify-between px-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
          <div className="flex items-center gap-2">
            <Logo className="h-8 w-auto" />
            <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-0.5 rounded">
              Admin
            </span>
          </div>
          <ThemeToggle />
        </div>
      </div>

      {/* Mobile Sidebar */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-40">
          <div className={cn(
            "absolute inset-0 bg-background/80",
            !dialogOpen && "backdrop-blur-sm"
          )}
          onClick={() => setSidebarOpen(false)} />
          <aside className="absolute left-0 top-16 bottom-0 w-64 bg-card border-r border-border">
            <nav className="px-4 py-6 space-y-2">
              {navItems.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    to={item.href}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200",
                      isActive
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                    )}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <item.icon className="h-5 w-5" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
            <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-border">
              <Button
                variant="outline"
                size="sm"
                className="w-full mb-2"
                onClick={() => navigate('/surveys')}
              >
                Switch to User View
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start text-muted-foreground hover:text-destructive"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </aside>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 lg:ml-64">
        <div className="pt-16 lg:pt-0">
          {/* Desktop Header */}
          <header className="hidden lg:flex h-16 items-center justify-between px-8 border-b border-border bg-card/50">
            <h1 className="text-lg font-semibold">
              {navItems.find(item => item.href === location.pathname)?.label || 'Admin Dashboard'}
            </h1>
            <ThemeToggle />
          </header>

          {/* Page Content */}
          <div className="p-6 lg:p-8">
            {children}
          </div>
        </div>
      </main>
    </div>
    </DialogContext.Provider>
  );
}
