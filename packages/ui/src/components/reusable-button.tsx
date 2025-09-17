interface ButtonProps {
  label: string;
  href?: string;
  onClick?: () => void;
  variant?: "primary" | "secondary";
  id?: string;
}

export function Button({
  label,
  href,
  onClick,
  variant = "primary",
  id,
}: ButtonProps) {
  const go = () => {
    if (onClick) onClick();
    else if (href && typeof window !== "undefined") window.location.assign(href);
  };

  const base = "rounded-xl px-4 py-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 transition";
  const styles = variant === "primary"
    ? "bg-slate-900 text-white hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200 shadow"
    : "border border-slate-300 bg-white text-slate-900 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:hover:bg-slate-900";

  return (
    <button 
      id={id} 
      type="button" 
      onClick={go} 
      className={`${base} ${styles}`}
    >
      {label}
    </button>
  );
}
