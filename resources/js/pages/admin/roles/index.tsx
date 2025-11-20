import { Button } from '@/components/ui/button';
import { ConfirmDialog } from '@/components/confirm-dialog';
import { DataTable } from '@/components/ui/data-table';
import { EmptyState } from '@/components/empty-state';
import { Card, CardContent } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type Permission, type Role } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { Download, Plus, Shield } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { createColumns, type RoleWithPermissions } from './columns';

interface Props {
    roles: (Role & { permissions: Permission[] })[];
}

export default function RolesIndex({ roles }: Props) {
    const { t } = useTranslation();

    const breadcrumbs: BreadcrumbItem[] = [
        { title: t('admin:breadcrumbs.dashboard'), href: '/dashboard' },
        { title: t('admin:breadcrumbs.roles'), href: '/admin/roles' },
    ];

    const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; role: Role | null; isLoading: boolean }>({
        open: false,
        role: null,
        isLoading: false,
    });

    const handleDeleteClick = (role: Role) => {
        setDeleteDialog({ open: true, role, isLoading: false });
    };

    const handleDeleteConfirm = () => {
        if (!deleteDialog.role) return;

        setDeleteDialog((prev) => ({ ...prev, isLoading: true }));

        router.delete(`/admin/roles/${deleteDialog.role.id}`, {
            onSuccess: () => {
                toast.success(t('admin:roles.deleted_success'));
                setDeleteDialog({ open: false, role: null, isLoading: false });
            },
            onError: () => {
                toast.error(t('admin:roles.deleted_error'));
                setDeleteDialog((prev) => ({ ...prev, isLoading: false }));
            },
        });
    };

    const columns = useMemo(
        () => createColumns({ onDelete: handleDeleteClick, t }),
        [t],
    );

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('admin:roles.title')} />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">{t('admin:roles.title')}</h1>
                    <div className="flex gap-2">
                        <a href="/admin/export/roles">
                            <Button variant="outline">
                                <Download className="mr-2 h-4 w-4" />
                                {t('common:export.export')}
                            </Button>
                        </a>
                        <Link href="/admin/roles/create">
                            <Button>
                                <Plus className="mr-2 h-4 w-4" />
                                {t('admin:roles.add')}
                            </Button>
                        </Link>
                    </div>
                </div>

                <Card className="flex-1">
                    <CardContent className="flex flex-col gap-3 px-4">
                        {roles.length === 0 ? (
                            <EmptyState
                                icon={<Shield className="h-12 w-12" />}
                                title={t('admin:roles.empty_title')}
                                description={t('admin:roles.empty_description')}
                                action={
                                    <Link href="/admin/roles/create">
                                        <Button>
                                            <Plus className="mr-2 h-4 w-4" />
                                            {t('admin:roles.add')}
                                        </Button>
                                    </Link>
                                }
                            />
                        ) : (
                            <DataTable columns={columns} data={roles as RoleWithPermissions[]} />
                        )}
                    </CardContent>
                </Card>
            </div>

            <ConfirmDialog
                open={deleteDialog.open}
                onOpenChange={(open) => setDeleteDialog({ open, role: null, isLoading: false })}
                title={t('admin:roles.delete_title')}
                description={t('admin:roles.delete_description', { name: deleteDialog.role?.name })}
                confirmText={t('common:dialog.delete')}
                variant="destructive"
                isLoading={deleteDialog.isLoading}
                onConfirm={handleDeleteConfirm}
            />
        </AppLayout>
    );
}
