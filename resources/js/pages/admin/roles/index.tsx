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
import { toast } from 'sonner';
import { createColumns, type RoleWithPermissions } from './columns';

interface Props {
    roles: (Role & { permissions: Permission[] })[];
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Roles', href: '/admin/roles' },
];

export default function RolesIndex({ roles }: Props) {
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
                toast.success('Role deleted successfully');
                setDeleteDialog({ open: false, role: null, isLoading: false });
            },
            onError: () => {
                toast.error('Failed to delete role');
                setDeleteDialog((prev) => ({ ...prev, isLoading: false }));
            },
        });
    };

    const columns = useMemo(
        () => createColumns({ onDelete: handleDeleteClick }),
        [],
    );

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Roles Management" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Roles Management</h1>
                    <div className="flex gap-2">
                        <a href="/admin/export/roles">
                            <Button variant="outline">
                                <Download className="mr-2 h-4 w-4" />
                                Export
                            </Button>
                        </a>
                        <Link href="/admin/roles/create">
                            <Button>
                                <Plus className="mr-2 h-4 w-4" />
                                Add Role
                            </Button>
                        </Link>
                    </div>
                </div>

                <Card className="flex-1">
                    <CardContent className="flex flex-col gap-3 px-4">
                        {roles.length === 0 ? (
                            <EmptyState
                                icon={<Shield className="h-12 w-12" />}
                                title="No roles found"
                                description="Get started by creating your first role"
                                action={
                                    <Link href="/admin/roles/create">
                                        <Button>
                                            <Plus className="mr-2 h-4 w-4" />
                                            Add Role
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
                title="Delete role?"
                description={`Are you sure you want to delete ${deleteDialog.role?.name}? This action cannot be undone.`}
                confirmText="Delete"
                variant="destructive"
                isLoading={deleteDialog.isLoading}
                onConfirm={handleDeleteConfirm}
            />
        </AppLayout>
    );
}
