import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { type Permission, type Role } from '@/types';
import { Link } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, Check, MoreHorizontal, Pencil, Trash2, X } from 'lucide-react';

export type RoleWithPermissions = Role & { permissions: Permission[] };

interface ColumnOptions {
    onDelete: (role: Role) => void;
}

// Module configuration
const MODULES = [
    { key: 'users', label: 'Users', actions: ['view', 'create', 'edit', 'delete'] },
    { key: 'roles', label: 'Roles', actions: ['view', 'create', 'edit', 'delete'] },
    { key: 'permissions', label: 'Permissions', actions: ['view', 'create', 'edit', 'delete'] },
    { key: 'activity-logs', label: 'Logs', actions: ['view'] },
    { key: 'settings', label: 'Settings', actions: ['view', 'edit'] },
];

// Helper to check if role has permission
const hasPermission = (permissions: Permission[], module: string, action: string) => {
    return permissions.some(p => p.name === `${module}.${action}`);
};

// Helper to get module access level
const getModuleAccess = (permissions: Permission[], module: { key: string; actions: string[] }) => {
    const hasAny = module.actions.some(action => hasPermission(permissions, module.key, action));
    const hasAll = module.actions.every(action => hasPermission(permissions, module.key, action));

    if (hasAll) return 'full';
    if (hasAny) return 'partial';
    return 'none';
};

export const createColumns = ({ onDelete }: ColumnOptions): ColumnDef<RoleWithPermissions>[] => [
    {
        accessorKey: 'name',
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
                    className="-ml-4"
                >
                    Name
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }) => <span className="font-medium">{row.getValue('name')}</span>,
    },
    {
        accessorKey: 'permissions',
        header: 'Permissions',
        cell: ({ row }) => {
            const permissions = row.original.permissions;

            return (
                <TooltipProvider>
                    <div className="flex items-center gap-3">
                        {MODULES.map((module) => {
                            const access = getModuleAccess(permissions, module);
                            const grantedActions = module.actions.filter(action =>
                                hasPermission(permissions, module.key, action)
                            );

                            return (
                                <Tooltip key={module.key}>
                                    <TooltipTrigger asChild>
                                        <div className="flex flex-col items-center gap-0.5">
                                            <span className="text-[10px] text-muted-foreground uppercase tracking-wide">
                                                {module.label}
                                            </span>
                                            <div className={`
                                                flex h-6 w-6 items-center justify-center rounded
                                                ${access === 'full'
                                                    ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400'
                                                    : access === 'partial'
                                                        ? 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400'
                                                        : 'bg-muted text-muted-foreground'
                                                }
                                            `}>
                                                {access === 'none' ? (
                                                    <X className="h-3 w-3" />
                                                ) : (
                                                    <Check className="h-3 w-3" />
                                                )}
                                            </div>
                                        </div>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <div className="text-xs">
                                            <p className="font-medium">{module.label}</p>
                                            {grantedActions.length > 0 ? (
                                                <p className="text-muted-foreground">
                                                    {grantedActions.join(', ')}
                                                </p>
                                            ) : (
                                                <p className="text-muted-foreground">No access</p>
                                            )}
                                        </div>
                                    </TooltipContent>
                                </Tooltip>
                            );
                        })}
                    </div>
                </TooltipProvider>
            );
        },
    },
    {
        id: 'actions',
        header: () => <span className="sr-only">Actions</span>,
        cell: ({ row }) => {
            const role = row.original;
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
                        <DropdownMenuItem asChild>
                            <Link href={`/admin/roles/${role.id}/edit`}>
                                <Pencil className="mr-2 h-4 w-4" />
                                Edit
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={() => onDelete(role)}
                            className="text-destructive"
                            disabled={role.name === 'admin'}
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
