import { Button } from '@/components/ui/button';
import { ConfirmDialog } from '@/components/confirm-dialog';
import { DataTable } from '@/components/ui/data-table';
import { EmptyState } from '@/components/empty-state';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { DataTablePagination } from '@/components/ui/pagination';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type PaginatedData, type Role, type User } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { Download, Loader2, Plus, Search, Users } from 'lucide-react';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';
import { useDebouncedCallback } from 'use-debounce';
import { createColumns, type UserWithRoles } from './columns';

interface Props {
    users: PaginatedData<User & { roles: Role[] }>;
    filters: { search?: string };
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Users', href: '/admin/users' },
];

export default function UsersIndex({ users, filters }: Props) {
    const [search, setSearch] = useState(filters.search || '');
    const [isSearching, setIsSearching] = useState(false);
    const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; user: User | null; isLoading: boolean }>({
        open: false,
        user: null,
        isLoading: false,
    });

    const debouncedSearch = useDebouncedCallback((value: string) => {
        router.get('/admin/users', { search: value }, {
            preserveState: true,
            onFinish: () => setIsSearching(false),
        });
    }, 300);

    const handleSearchChange = (value: string) => {
        setSearch(value);
        setIsSearching(true);
        debouncedSearch(value);
    };

    const handleDeleteClick = (user: User) => {
        setDeleteDialog({ open: true, user, isLoading: false });
    };

    const handleDeleteConfirm = () => {
        if (!deleteDialog.user) return;

        setDeleteDialog((prev) => ({ ...prev, isLoading: true }));

        router.delete(`/admin/users/${deleteDialog.user.id}`, {
            onSuccess: () => {
                toast.success('User deleted successfully');
                setDeleteDialog({ open: false, user: null, isLoading: false });
            },
            onError: () => {
                toast.error('Failed to delete user');
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
            <Head title="Users Management" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Users Management</h1>
                    <div className="flex gap-2">
                        <a href="/admin/export/users">
                            <Button variant="outline">
                                <Download className="mr-2 h-4 w-4" />
                                Export
                            </Button>
                        </a>
                        <Link href="/admin/users/create">
                            <Button>
                                <Plus className="mr-2 h-4 w-4" />
                                Add User
                            </Button>
                        </Link>
                    </div>
                </div>

                <Card className="flex-1">
                    <CardContent className="flex flex-col gap-3 px-4">
                        <div className="flex gap-2">
                            <div className="relative w-full sm:w-72">
                                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    placeholder="Search users..."
                                    value={search}
                                    onChange={(e) => handleSearchChange(e.target.value)}
                                    className="pl-10"
                                />
                                {isSearching && (
                                    <Loader2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-muted-foreground" />
                                )}
                            </div>
                        </div>

                        {users.data.length === 0 ? (
                            <EmptyState
                                icon={<Users className="h-12 w-12" />}
                                title="No users found"
                                description={search ? 'Try adjusting your search terms' : 'Get started by creating your first user'}
                                action={
                                    !search && (
                                        <Link href="/admin/users/create">
                                            <Button>
                                                <Plus className="mr-2 h-4 w-4" />
                                                Add User
                                            </Button>
                                        </Link>
                                    )
                                }
                            />
                        ) : (
                            <>
                                <DataTable columns={columns} data={users.data as UserWithRoles[]} />
                                <DataTablePagination data={users} />
                            </>
                        )}
                    </CardContent>
                </Card>
            </div>

            <ConfirmDialog
                open={deleteDialog.open}
                onOpenChange={(open) => setDeleteDialog({ open, user: null, isLoading: false })}
                title="Delete user?"
                description={`Are you sure you want to delete ${deleteDialog.user?.name}? This action cannot be undone.`}
                confirmText="Delete"
                variant="destructive"
                isLoading={deleteDialog.isLoading}
                onConfirm={handleDeleteConfirm}
            />
        </AppLayout>
    );
}
