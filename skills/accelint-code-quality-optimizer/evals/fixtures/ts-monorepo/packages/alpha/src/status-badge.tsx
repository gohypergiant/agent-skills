import { useEffect, useState } from "react";

export type BadgeProps = { label: string; tone?: string };

export function StatusBadge({ label, tone }: BadgeProps) {
  const [text, setText] = useState(label);
  useEffect(() => {
    setText(label.toUpperCase());
  }, [label]);

  const Icon = () => <span className={tone}>*</span>;

  return (
    <span>
      <Icon />
      {text}
    </span>
  );
}
