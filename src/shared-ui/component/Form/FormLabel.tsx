//Files: src/shared-ui/component/Form/FormLabel.tsx
// src/shared-ui/component/Form/FormLabel.tsx

import clsx from "clsx";

interface Props {
  children: React.ReactNode;
  className?: string;
  htmlFor?: string;
}

export default function FormLabel({ children, className, htmlFor }: Props) {
  return (
    <label
      htmlFor={htmlFor}
      className={clsx("text-sm font-medium text-gray-900", className)}
    >
      {children}
    </label>
  );
}
