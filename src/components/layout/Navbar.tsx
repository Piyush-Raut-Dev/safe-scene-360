import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Shield, User, LogOut, LayoutDashboard, Menu } from 'lucide-react';
import { useState } from 'react';

export const Navbar = () => {
  const { user, isAuthenticated, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-card/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <Shield className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="font-display text-xl font-bold text-foreground">Safe360</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-6 md:flex">
          {isAuthenticated ? (
            <>
              <Link
                to={isAdmin ? '/admin' : '/dashboard'}
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                Dashboard
              </Link>
              {!isAdmin && (
                <>
                  <Link
                    to="/training"
                    className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                  >
                    Training
                  </Link>
                  <Link
                    to="/quizzes"
                    className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                  >
                    Quizzes
                  </Link>
                </>
              )}
              {isAdmin && (
                <>
                  <Link
                    to="/admin/users"
                    className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                  >
                    Users
                  </Link>
                  <Link
                    to="/admin/reports"
                    className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                  >
                    Reports
                  </Link>
                </>
              )}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
                      <User className="h-4 w-4" />
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="px-2 py-1.5">
                    <p className="text-sm font-medium">{user?.name}</p>
                    <p className="text-xs text-muted-foreground">{user?.email}</p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate(isAdmin ? '/admin' : '/dashboard')}>
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    Dashboard
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                Login
              </Link>
              <Button onClick={() => navigate('/login')} variant="accent">
                Get Started
              </Button>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <Menu className="h-5 w-5" />
        </Button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="border-t bg-card p-4 md:hidden">
          <div className="flex flex-col gap-3">
            {isAuthenticated ? (
              <>
                <Link
                  to={isAdmin ? '/admin' : '/dashboard'}
                  className="rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-muted"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Dashboard
                </Link>
                {!isAdmin && (
                  <>
                    <Link
                      to="/training"
                      className="rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-muted"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Training
                    </Link>
                    <Link
                      to="/quizzes"
                      className="rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-muted"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Quizzes
                    </Link>
                  </>
                )}
                <Button variant="destructive" onClick={handleLogout} className="mt-2">
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-muted"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Login
                </Link>
                <Button onClick={() => navigate('/login')} variant="accent">
                  Get Started
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};
