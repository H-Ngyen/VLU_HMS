import { Link, useLocation } from "react-router-dom";
import logo from "../assets/vlu-logo.png";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import { LogOut } from "lucide-react";
import { DropdownMenuHeader } from "./DropdownMenuHeader";
import { useAuth0 } from "@auth0/auth0-react";

const navs = [
  { href: "/", label: "Bệnh án" },
  { href: "/patients", label: "Bệnh nhân" },
  { href: "/account", label: "Tài khoản" },
];

export function Header() {
  const { pathname } = useLocation();
  const { user, logout: auth0Logout } = useAuth0();

  const handleLogout = () => {
    auth0Logout({ logoutParams: { returnTo: window.location.origin } });
  };

  const isAdmin = user?.email?.endsWith("@zer0project.onmicrosoft.com");

  const filteredNavs = navs.filter(nav => {
    if (nav.href === "/account") return isAdmin;
    return true;
  });

  const displayUser = {
    name: user?.name || "Người dùng",
    email: user?.email || "",
    avatar: user?.picture || ""
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="w-full flex h-16 items-center px-6">
        <div className="mr-8 hidden md:flex">
          <Link to="/" className="flex items-center gap-2">
            <img src={logo} alt="VLU" className="h-10 w-auto object-contain" />
          </Link>
        </div>

        <nav className="flex items-center space-x-6 text-sm font-medium">
          {filteredNavs.map(({ href, label }) => (
            <Link key={href} to={href}
              className={cn("transition-colors hover:text-foreground/80",
                pathname === href ? "text-foreground font-bold text-red-700" : "text-foreground/60"
              )}>
              {label}
            </Link>
          ))}
        </nav>

        <div className="flex flex-1 items-center justify-end space-x-4">
          <DropdownMenuHeader user={displayUser} />
          
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-muted-foreground hover:text-red-600" 
            title="Đăng xuất"
            onClick={handleLogout}
          >
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
}
