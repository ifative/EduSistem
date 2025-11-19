import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { FormField } from '@/components/form-field';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type Permission } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface Props {
    permissions: Permission[];
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Roles', href: '/admin/roles' },
    { title: 'Create', href: '/admin/roles/create' },
];

// Standard actions in display order
const ACTIONS = ['view', 'create', 'edit', 'delete'] as const;

// Module display names
const MODULE_LABELS: Record<string, string> = {
    users: 'Users',
    roles: 'Roles',
    permissions: 'Permissions',
    'activity-logs': 'Activity Logs',
    settings: 'Settings',
};

export default function RolesCreate({ permissions }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        permissions: [] as string[],
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/roles', {
            onSuccess: () => toast.success('Role created successfully'),
            onError: () => toast.error('Failed to create role'),
        });
    };

    const togglePermission = (permName: string) => {
        setData(
            'permissions',
            data.permissions.includes(permName)
                ? data.permissions.filter((p) => p !== permName)
                : [...data.permissions, permName]
        );
    };

    // Group permissions by module
    const permissionMap = permissions.reduce(
        (acc, perm) => {
            const [module, action] = perm.name.split('.');
            if (!acc[module]) acc[module] = {};
            acc[module][action] = perm;
            return acc;
        },
        {} as Record<string, Record<string, Permission>>
    );

    // Toggle all permissions for a module
    const toggleModule = (module: string, checked: boolean) => {
        const modulePerms = Object.values(permissionMap[module] || {}).map(p => p.name);
        if (checked) {
            setData('permissions', [...new Set([...data.permissions, ...modulePerms])]);
        } else {
            setData('permissions', data.permissions.filter(p => !modulePerms.includes(p)));
        }
    };

    // Check if all permissions in a module are selected
    const isModuleFullySelected = (module: string) => {
        const modulePerms = Object.values(permissionMap[module] || {}).map(p => p.name);
        return modulePerms.length > 0 && modulePerms.every(p => data.permissions.includes(p));
    };

    // Check if some (but not all) permissions in a module are selected
    const isModulePartiallySelected = (module: string) => {
        const modulePerms = Object.values(permissionMap[module] || {}).map(p => p.name);
        const selectedCount = modulePerms.filter(p => data.permissions.includes(p)).length;
        return selectedCount > 0 && selectedCount < modulePerms.length;
    };

    const modules = Object.keys(permissionMap);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Role" />
            <div className="flex h-full flex-1 flex-col gap-6 p-4">
                <div>
                    <h1 className="text-2xl font-bold">Create Role</h1>
                    <p className="text-muted-foreground">Create a new role and assign permissions</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Role Information</CardTitle>
                            <CardDescription>Enter the basic information for this role</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <FormField label="Role Name" htmlFor="name" error={errors.name} required>
                                <Input
                                    id="name"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    placeholder="e.g., Editor, Moderator"
                                    className="max-w-md"
                                    aria-invalid={!!errors.name}
                                />
                            </FormField>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Permissions</CardTitle>
                            <CardDescription>Select the permissions for this role</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="rounded-md border">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="w-[200px]">Module</TableHead>
                                            {ACTIONS.map((action) => (
                                                <TableHead key={action} className="text-center capitalize">
                                                    {action}
                                                </TableHead>
                                            ))}
                                            <TableHead className="text-center">All</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {modules.map((module) => (
                                            <TableRow key={module}>
                                                <TableCell className="font-medium">
                                                    {MODULE_LABELS[module] || module}
                                                </TableCell>
                                                {ACTIONS.map((action) => {
                                                    const perm = permissionMap[module]?.[action];
                                                    return (
                                                        <TableCell key={action} className="text-center">
                                                            {perm ? (
                                                                <Checkbox
                                                                    id={`perm-${perm.id}`}
                                                                    checked={data.permissions.includes(perm.name)}
                                                                    onCheckedChange={() => togglePermission(perm.name)}
                                                                    aria-label={`${MODULE_LABELS[module] || module} ${action}`}
                                                                />
                                                            ) : (
                                                                <span className="text-muted-foreground">-</span>
                                                            )}
                                                        </TableCell>
                                                    );
                                                })}
                                                <TableCell className="text-center">
                                                    <Checkbox
                                                        checked={isModuleFullySelected(module)}
                                                        ref={(el) => {
                                                            if (el) {
                                                                (el as unknown as HTMLButtonElement).dataset.state =
                                                                    isModulePartiallySelected(module) ? 'indeterminate' :
                                                                    isModuleFullySelected(module) ? 'checked' : 'unchecked';
                                                            }
                                                        }}
                                                        onCheckedChange={(checked) => toggleModule(module, checked as boolean)}
                                                        aria-label={`Select all ${MODULE_LABELS[module] || module} permissions`}
                                                    />
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                            {errors.permissions && (
                                <p className="mt-2 text-sm text-destructive">{errors.permissions}</p>
                            )}
                        </CardContent>
                    </Card>

                    <div className="flex gap-2">
                        <Button type="submit" disabled={processing}>
                            {processing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Create Role
                        </Button>
                        <Link href="/admin/roles">
                            <Button variant="outline" type="button">Cancel</Button>
                        </Link>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
