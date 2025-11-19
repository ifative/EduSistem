import { type ReactNode } from 'react';

interface EmptyStateProps {
    title: string;
    description?: string;
    icon?: ReactNode;
    action?: ReactNode;
}

export function EmptyState({ title, description, icon, action }: EmptyStateProps) {
    return (
        <div className="flex flex-col items-center justify-center py-12 text-center">
            {icon && <div className="mb-4 text-muted-foreground">{icon}</div>}
            <h3 className="text-lg font-semibold">{title}</h3>
            {description && <p className="mt-2 text-sm text-muted-foreground">{description}</p>}
            {action && <div className="mt-6">{action}</div>}
        </div>
    );
}
