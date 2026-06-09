import { cn } from "@/lib/utils";

type Variant = "primary" | "outline" | "ghost";

const VARIANT: Record<Variant, string> = {
  primary: "bg-zinc-900 text-white hover:bg-zinc-800",
  outline: "border border-zinc-300 text-zinc-900 hover:bg-zinc-50",
  ghost: "text-zinc-600 hover:bg-zinc-100",
};

export function Button({
  variant = "primary",
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }) {
  return (
    <button
      className={cn(
        "inline-flex h-11 items-center justify-center rounded-full px-5 text-sm font-medium transition-colors disabled:opacity-50",
        VARIANT[variant],
        className,
      )}
      {...props}
    />
  );
}
