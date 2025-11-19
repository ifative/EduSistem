import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { FormField } from '@/components/form-field';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type Role, type User } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface Props {
    user: User & { roles: Role[] };
    roles: Role[];
}

export default function UsersEdit({ user, roles }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Users', href: '/admin/users' },
        { title: 'Edit', href: `/admin/users/${user.id}/edit` },
    ];

    const { data, setData, put, processing, errors } = useForm({
        name: user.name,
        email: user.email,
        password: '',
        roles: user.roles.map((r) => r.name),
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/admin/users/${user.id}`, {
            onSuccess: () => toast.success('User updated successfully'),
            onError: () => toast.error('Failed to update user'),
        });
    };

    const toggleRole = (roleName: string) => {
        setData(
            'roles',
            data.roles.includes(roleName)
                ? data.roles.filter((r) => r !== roleName)
                : [...data.roles, roleName]
        );
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit User: ${user.name}`} />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Edit User</h1>
                </div>

                <div className="flex-1">
                    <form onSubmit={handleSubmit} className="max-w-2xl space-y-4">
                        <FormField label="Name" htmlFor="name" error={errors.name} required>
                            <Input
                                id="name"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                aria-invalid={!!errors.name}
                            />
                        </FormField>

                        <FormField label="Email" htmlFor="email" error={errors.email} required>
                            <Input
                                id="email"
                                type="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                aria-invalid={!!errors.email}
                            />
                        </FormField>

                        <FormField
                            label="Password"
                            htmlFor="password"
                            error={errors.password}
                            help="Leave blank to keep current password"
                        >
                            <Input
                                id="password"
                                type="password"
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                aria-invalid={!!errors.password}
                            />
                        </FormField>

                        <FormField label="Roles" error={errors.roles}>
                            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                                {roles.map((role) => (
                                    <div key={role.id} className="flex items-center space-x-2">
                                        <Checkbox
                                            id={`role-${role.id}`}
                                            checked={data.roles.includes(role.name)}
                                            onCheckedChange={() => toggleRole(role.name)}
                                        />
                                        <Label htmlFor={`role-${role.id}`} className="font-normal">
                                            {role.name}
                                        </Label>
                                    </div>
                                ))}
                            </div>
                        </FormField>

                        <div className="flex gap-2">
                            <Button type="submit" disabled={processing}>
                                {processing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Update User
                            </Button>
                            <Link href="/admin/users">
                                <Button variant="outline" type="button">Cancel</Button>
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
