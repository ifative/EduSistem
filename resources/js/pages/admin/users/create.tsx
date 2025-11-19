import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { FormField } from '@/components/form-field';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type Role } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface Props {
    roles: Role[];
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Users', href: '/admin/users' },
    { title: 'Create', href: '/admin/users/create' },
];

export default function UsersCreate({ roles }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        password: '',
        roles: [] as string[],
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/users', {
            onSuccess: () => toast.success('User created successfully'),
            onError: () => toast.error('Failed to create user'),
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
            <Head title="Create User" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Create User</h1>
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

                        <FormField label="Password" htmlFor="password" error={errors.password} required>
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
                                Create User
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
