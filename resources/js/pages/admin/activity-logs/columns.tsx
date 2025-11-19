import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, User } from 'lucide-react';

export interface ActivityLog {
    id: number;
    log_name: string;
    description: string;
    subject_type: string | null;
    subject_id: number | null;
    causer_type: string | null;
    causer_id: number | null;
    properties: Record<string, unknown>;
    created_at: string;
    causer: { id: number; name: string; email: string } | null;
}

// Action badge variants based on description
const getActionVariant = (description: string): 'default' | 'secondary' | 'outline' | 'destructive' => {
    const lower = description.toLowerCase();
    if (lower.includes('deleted') || lower.includes('removed')) return 'destructive';
    if (lower.includes('created') || lower.includes('added')) return 'default';
    if (lower.includes('updated') || lower.includes('changed')) return 'outline';
    return 'secondary';
};

// Extract action from description
const getActionLabel = (description: string): string => {
    const lower = description.toLowerCase();
    if (lower.includes('deleted')) return 'Deleted';
    if (lower.includes('created')) return 'Created';
    if (lower.includes('updated')) return 'Updated';
    if (lower.includes('logged in')) return 'Login';
    if (lower.includes('logged out')) return 'Logout';
    return description;
};

export const columns: ColumnDef<ActivityLog>[] = [
    {
        accessorKey: 'description',
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                    className="-ml-4"
                >
                    Event
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }) => {
            const description = row.getValue('description') as string;
            return (
                <Badge variant={getActionVariant(description)} className="font-normal">
                    {getActionLabel(description)}
                </Badge>
            );
        },
    },
    {
        id: 'subject',
        header: 'Subject',
        cell: ({ row }) => {
            const activity = row.original;
            if (!activity.subject_type) {
                return <span className="text-muted-foreground">-</span>;
            }

            const modelName = activity.subject_type.split('\\').pop();
            return (
                <div className="flex items-center gap-2">
                    <span className="font-medium">{modelName}</span>
                    <code className="rounded bg-muted px-1.5 py-0.5 text-xs">
                        #{activity.subject_id}
                    </code>
                </div>
            );
        },
    },
    {
        accessorKey: 'causer',
        header: 'Performed By',
        cell: ({ row }) => {
            const causer = row.original.causer;

            if (!causer) {
                return (
                    <span className="text-muted-foreground">System</span>
                );
            }

            return (
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <div className="flex items-center gap-2">
                                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-muted">
                                    <User className="h-3 w-3" />
                                </div>
                                <span>{causer.name}</span>
                            </div>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p className="text-xs">{causer.email}</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            );
        },
    },
    {
        accessorKey: 'created_at',
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                    className="-ml-4"
                >
                    Date
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }) => {
            const date = new Date(row.getValue('created_at'));
            return (
                <div className="flex flex-col">
                    <span className="text-sm">
                        {date.toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                        })}
                    </span>
                    <span className="text-xs text-muted-foreground">
                        {date.toLocaleTimeString('en-US', {
                            hour: '2-digit',
                            minute: '2-digit',
                        })}
                    </span>
                </div>
            );
        },
    },
];
