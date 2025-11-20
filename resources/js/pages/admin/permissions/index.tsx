import { Button } from '@/components/ui/button';
import { ConfirmDialog } from '@/components/confirm-dialog';
import { DataTable } from '@/components/ui/data-table';
import { EmptyState } from '@/components/empty-state';
import { Card, CardContent } from '@/components/ui/card';
import { DataTablePagination } from '@/components/ui/pagination';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type PaginatedData, type Permission } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { Plus, ShieldCheck } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { createColumns } from './columns';

interface Props {
    permissions: PaginatedData<Permission>;
}

export default function PermissionsIndex({ permissions }: Props) {
    const { t } = useTranslation();

    const breadcrumbs: BreadcrumbItem[] = [
        { title: t('admin:breadcrumbs.dashboard'), href: '/dashboard' },
        { title: t('admin:breadcrumbs.permissions'), href: '/admin/permissions' },
    ];

    const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; permission: Permission | null; isLoading: boolean }>({
        open: false,
        permission: null,
        isLoading: false,
    });

    const handleDeleteClick = (permission: Permission) => {
        setDeleteDialog({ open: true, permission, isLoading: false });
    };

    const handleDeleteConfirm = () => {
        if (!deleteDialog.permission) return;

        setDeleteDialog((prev) => ({ ...prev, isLoading: true }));

        router.delete(`/admin/permissions/${deleteDialog.permission.id}`, {
            onSuccess: () => {
                toast.success(t('admin:permissions.deleted_success'));
                setDeleteDialog({ open: false, permission: null, isLoading: false });
            },
            onError: () => {
                toast.error(t('admin:permissions.deleted_error'));
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
            <Head title={t('admin:permissions.title')} />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">{t('admin:permissions.title')}</h1>
                    <Link href="/admin/permissions/create">
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            {t('admin:permissions.add')}
                        </Button>
                    </Link>
                </div>

                <Card className="flex-1">
                    <CardContent className="flex flex-col gap-3 px-4">
                        {permissions.data.length === 0 ? (
                            <EmptyState
                                icon={<ShieldCheck className="h-12 w-12" />}
                                title={t('admin:permissions.empty_title')}
                                description={t('admin:permissions.empty_description')}
                                action={
                                    <Link href="/admin/permissions/create">
                                        <Button>
                                            <Plus className="mr-2 h-4 w-4" />
                                            {t('admin:permissions.add')}
                                        </Button>
                                    </Link>
                                }
                            />
                        ) : (
                            <>
                                <DataTable columns={columns} data={permissions.data} />
                                <DataTablePagination data={permissions} />
                            </>
                        )}
                    </CardContent>
                </Card>
            </div>

            <ConfirmDialog
                open={deleteDialog.open}
                onOpenChange={(open) => setDeleteDialog({ open, permission: null, isLoading: false })}
                title={t('admin:permissions.delete_title')}
                description={t('admin:permissions.delete_description', { name: deleteDialog.permission?.name })}
                confirmText={t('common:dialog.delete')}
                variant="destructive"
                isLoading={deleteDialog.isLoading}
                onConfirm={handleDeleteConfirm}
            />
        </AppLayout>
    );
}
