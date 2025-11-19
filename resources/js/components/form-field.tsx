import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { AlertCircle } from 'lucide-react';
import { type ReactNode } from 'react';

interface FormFieldProps {
    label: string;
    htmlFor?: string;
    error?: string;
    required?: boolean;
    help?: string;
    className?: string;
    children: ReactNode;
}

export function FormField({
    label,
    htmlFor,
    error,
    required,
    help,
    className,
    children,
}: FormFieldProps) {
    return (
        <div className={cn('space-y-2', className)}>
            <Label htmlFor={htmlFor}>
                {label}
                {required && <span className="ml-1 text-destructive">*</span>}
            </Label>
            {children}
            {help && !error && <p className="text-xs text-muted-foreground">{help}</p>}
            {error && (
                <p className="flex items-center gap-1 text-sm text-destructive">
                    <AlertCircle className="h-4 w-4" />
                    {error}
                </p>
            )}
        </div>
    );
}
