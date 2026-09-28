import type { AnchorHTMLAttributes, ButtonHTMLAttributes } from "react";
import Link from "next/link";

const base =
  "inline-flex items-center justify-center rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";

const variants = {
  primary: `${base} bg-emerald-700 text-white hover:bg-emerald-800 focus-visible:ring-emerald-700`,
  secondary: `${base} bg-white text-emerald-800 border border-emerald-700 hover:bg-emerald-50 focus-visible:ring-emerald-700`,
  ghost: `${base} bg-transparent text-slate-700 hover:bg-slate-100`,
};

type Variant = keyof typeof variants;

export function Button({
  variant = "primary",
  className = "",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }) {
  return <button className={`${variants[variant]} ${className}`} {...props} />;
}

export function LinkButton({
  variant = "primary",
  className = "",
  href,
  ...props
}: AnchorHTMLAttributes<HTMLAnchorElement> & { variant?: Variant; href: string }) {
  return <Link href={href} className={`${variants[variant]} ${className}`} {...props} />;
}
