import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { FormField } from '@/components/form-field';
import { Input } from '@/components/ui/input';
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
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

interface Props {
    permissions: Permission[];
}

// Standard actions in display order
const ACTIONS = ['view', 'create', 'edit', 'delete'] as const;

// Module keys for translation
const MODULE_KEYS: Record<string, string> = {
    users: 'users',
    roles: 'roles',
    permissions: 'permissions',
    'activity-logs': 'logs',
    settings: 'settings',
};

export default function RolesCreate({ permissions }: Props) {
    const { t } = useTranslation();

    const breadcrumbs: BreadcrumbItem[] = [
        { title: t('admin:breadcrumbs.dashboard'), href: '/dashboard' },
        { title: t('admin:breadcrumbs.roles'), href: '/admin/roles' },
        { title: t('admin:breadcrumbs.create'), href: '/admin/roles/create' },
    ];

    const { data, setData, post, processing, errors } = useForm({
        name: '',
        permissions: [] as string[],
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/roles', {
            onSuccess: () => toast.success(t('admin:roles.created_success')),
            onError: () => toast.error(t('admin:roles.created_error')),
        });
    };

    // Get module label from translation
    const getModuleLabel = (module: string) => {
        const key = MODULE_KEYS[module];
        return key ? t(`admin:roles.modules.${key}`) : module;
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
            <Head title={t('admin:roles.create')} />
            <div className="flex h-full flex-1 flex-col gap-6 p-4">
                <div>
                    <h1 className="text-2xl font-bold">{t('admin:roles.create')}</h1>
                    <p className="text-muted-foreground">{t('admin:roles.create_description', 'Create a new role and assign permissions')}</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>{t('admin:roles.role_information', 'Role Information')}</CardTitle>
                            <CardDescription>{t('admin:roles.role_information_description', 'Enter the basic information for this role')}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <FormField label={t('admin:roles.name')} htmlFor="name" error={errors.name} required>
                                <Input
                                    id="name"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    placeholder={t('admin:roles.name_placeholder', 'e.g., Editor, Moderator')}
                                    className="max-w-md"
                                    aria-invalid={!!errors.name}
                                />
                            </FormField>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>{t('admin:roles.permissions')}</CardTitle>
                            <CardDescription>{t('admin:roles.permissions_description', 'Select the permissions for this role')}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="rounded-md border">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="w-[200px]">{t('admin:roles.module', 'Module')}</TableHead>
                                            {ACTIONS.map((action) => (
                                                <TableHead key={action} className="text-center capitalize">
                                                    {action}
                                                </TableHead>
                                            ))}
                                            <TableHead className="text-center">{t('admin:roles.all', 'All')}</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {modules.map((module) => (
                                            <TableRow key={module}>
                                                <TableCell className="font-medium">
                                                    {getModuleLabel(module)}
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
                                                                    aria-label={`${getModuleLabel(module)} ${action}`}
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
                                                        aria-label={`${t('admin:roles.select_all', 'Select all')} ${getModuleLabel(module)} ${t('admin:roles.permissions').toLowerCase()}`}
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
                            {t('admin:roles.create')}
                        </Button>
                        <Link href="/admin/roles">
                            <Button variant="outline" type="button">{t('common:dialog.cancel')}</Button>
                        </Link>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
