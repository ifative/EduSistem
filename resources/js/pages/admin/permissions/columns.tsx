import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { type Permission } from '@/types';
import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, MoreHorizontal, Trash2 } from 'lucide-react';

interface ColumnOptions {
    onDelete: (permission: Permission) => void;
}

// Module display names
const MODULE_LABELS: Record<string, string> = {
    users: 'Users',
    roles: 'Roles',
    permissions: 'Permissions',
    'activity-logs': 'Activity Logs',
    settings: 'Settings',
};

// Action badge variants
const ACTION_VARIANTS: Record<string, 'default' | 'secondary' | 'outline' | 'destructive'> = {
    view: 'secondary',
    create: 'default',
    edit: 'outline',
    delete: 'destructive',
};

export const createColumns = ({ onDelete }: ColumnOptions): ColumnDef<Permission>[] => [
    {
        id: 'module',
        accessorFn: (row) => row.name.split('.')[0],
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                    className="-ml-4"
                >
                    Module
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }) => {
            const module = row.original.name.split('.')[0];
            return (
                <span className="font-medium">
                    {MODULE_LABELS[module] || module}
                </span>
            );
        },
    },
    {
        id: 'action',
        accessorFn: (row) => row.name.split('.')[1],
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                    className="-ml-4"
                >
                    Action
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }) => {
            const action = row.original.name.split('.')[1];
            const variant = ACTION_VARIANTS[action] || 'secondary';
            return (
                <Badge variant={variant} className="capitalize">
                    {action}
                </Badge>
            );
        },
    },
    {
        accessorKey: 'name',
        header: 'Permission Key',
        cell: ({ row }) => (
            <code className="rounded bg-muted px-1.5 py-0.5 text-xs">
                {row.getValue('name')}
            </code>
        ),
    },
    {
        accessorKey: 'guard_name',
        header: 'Guard',
        cell: ({ row }) => (
            <span className="text-muted-foreground">
                {row.getValue('guard_name')}
            </span>
        ),
    },
    {
        id: 'actions',
        header: () => <span className="sr-only">Actions</span>,
        cell: ({ row }) => {
            const permission = row.original;
            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            onClick={() => onDelete(permission)}
                            className="text-destructive"
                        >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
        meta: {
            className: 'w-[70px]',
        },
    },
];
