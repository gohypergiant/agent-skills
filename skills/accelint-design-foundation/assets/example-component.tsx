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

import { clsx } from '@accelint/design-foundation/lib/utils';
import styles from './example-component.module.css';

type UserCardProps = {
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

type StatusBadgeProps = {
  status: 'active' | 'inactive' | 'pending';
}

// Hoist static maps outside component to avoid re-creation on every render
const STATUS_COLOR_MAP = {
  active: 'success',
  inactive: 'danger',
  pending: 'warning'
} as const;

const STATUS_LABEL_MAP = {
  active: 'Active',
  inactive: 'Inactive',
  pending: 'Pending'
} as const;

function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span
      className={styles.badge}
      data-color={STATUS_COLOR_MAP[status]}
      data-size="small"
    >
      {STATUS_LABEL_MAP[status]}
    </span>
  );
}
