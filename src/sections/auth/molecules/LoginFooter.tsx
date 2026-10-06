// Files: src/sections/auth/molecules/LoginFooter.tsx

import clsx from "clsx";

export interface LoginFooterProps {
  readonly className?: string;
}

export default function LoginFooter({ className }: LoginFooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className={clsx(
        "text-center text-xs text-slate-400 dark:text-slate-500 select-none",
        className,
      )}
    >
      <p>© {currentYear} EduNusa. Hak cipta dilindungi.</p>
    </footer>
  );
}
