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
import { TFunction } from 'i18next';
import { ArrowUpDown, MoreHorizontal, Trash2 } from 'lucide-react';

interface ColumnOptions {
    onDelete: (permission: Permission) => void;
    t: TFunction;
}

// Action badge variants
const ACTION_VARIANTS: Record<string, 'default' | 'secondary' | 'outline' | 'destructive'> = {
    view: 'secondary',
    create: 'default',
    edit: 'outline',
    delete: 'destructive',
};

export const createColumns = ({ onDelete, t }: ColumnOptions): ColumnDef<Permission>[] => [
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
                    {t('admin:permissions.module')}
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }) => {
            const module = row.original.name.split('.')[0];
            const moduleLabel = t(`admin:permissions.modules.${module}`, { defaultValue: module });
            return (
                <span className="font-medium">
                    {moduleLabel}
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
                    {t('admin:permissions.action')}
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
        header: t('admin:permissions.permission_key'),
        cell: ({ row }) => (
            <code className="rounded bg-muted px-1.5 py-0.5 text-xs">
                {row.getValue('name')}
            </code>
        ),
    },
    {
        accessorKey: 'guard_name',
        header: t('admin:permissions.guard'),
        cell: ({ row }) => (
            <span className="text-muted-foreground">
                {row.getValue('guard_name')}
            </span>
        ),
    },
    {
        id: 'actions',
        header: () => <span className="sr-only">{t('admin:permissions.actions')}</span>,
        cell: ({ row }) => {
            const permission = row.original;
            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">{t('admin:permissions.open_menu')}</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>{t('admin:permissions.actions')}</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            onClick={() => onDelete(permission)}
                            className="text-destructive"
                        >
                            <Trash2 className="mr-2 h-4 w-4" />
                            {t('common:actions.delete')}
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
