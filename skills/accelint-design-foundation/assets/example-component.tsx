/**
 * Example: User Card Component
 *
 * Demonstrates correct @accelint/design-foundation patterns:
 * - Component styles in CSS modules (not inline)
 * - Semantic color tokens that adapt to theme
 * - Semantic spacing scale (not numeric Tailwind)
 * - Outlines instead of borders
 * - Data attribute variants
 * - CSS layer hierarchy
 * - Inline classes ONLY for one-off overrides
 */

import { clsx } from 'clsx';
import styles from './UserCard.module.css';

interface UserCardProps {
  name: string;
  email: string;
  role: string;
  status: 'active' | 'inactive' | 'pending';
  size?: 'small' | 'medium' | 'large';
  className?: string; // For one-off overrides
  onEdit?: () => void;
  onDelete?: () => void;
}

export function UserCard({
  name,
  email,
  role,
  status,
  size = 'medium',
  className,
  onEdit,
  onDelete
}: UserCardProps) {
  return (
    <article
      className={clsx(styles.card, className)} // CSS module + optional override
      data-size={size}
    >
      <header className={styles.header}>
        <h3 className={styles.title}>{name}</h3>
        <StatusBadge status={status} />
      </header>

      <div className={styles.content}>
        <p className={styles.email}>{email}</p>
        <p className={styles.role}>{role}</p>
      </div>

      {(onEdit || onDelete) && (
        <footer className={styles.actions}>
          {onEdit && (
            <button
              onClick={onEdit}
              className={styles.primaryButton}
              data-color="primary"
              data-size={size}
            >
              Edit
            </button>
          )}

          {onDelete && (
            <button
              onClick={onDelete}
              className={styles.dangerButton}
              data-color="danger"
              data-size={size}
            >
              Delete
            </button>
          )}
        </footer>
      )}
    </article>
  );
}

interface StatusBadgeProps {
  status: 'active' | 'inactive' | 'pending';
}

function StatusBadge({ status }: StatusBadgeProps) {
  const colorMap = {
    active: 'success',
    inactive: 'danger',
    pending: 'warning'
  } as const;

  const labelMap = {
    active: 'Active',
    inactive: 'Inactive',
    pending: 'Pending'
  };

  return (
    <span
      className={styles.badge}
      data-color={colorMap[status]}
      data-size="small"
    >
      {labelMap[status]}
    </span>
  );
}
