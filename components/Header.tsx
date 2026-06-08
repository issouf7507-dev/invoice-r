"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FileText, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: "Accueil" },
  { href: "/invoices", label: "Factures" },
];

export function Header() {
  const { setTheme } = useTheme();
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/80 bg-background/85 backdrop-blur supports-[backdrop-filter]:bg-background/60 print:hidden">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
            <FileText className="size-5" />
          </span>
          <span className="text-lg font-semibold tracking-tight">
            Royal Cargo
          </span>
        </Link>

        <nav className="flex items-center gap-1">
          {navItems.map((item) => {
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-accent text-accent-foreground"
                    : "text-muted-foreground hover:bg-accent/60 hover:text-foreground"
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon" aria-label="Changer le thème">
              <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Changer le thème</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setTheme("light")}>
              Clair
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("dark")}>
              Sombre
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("system")}>
              Système
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
