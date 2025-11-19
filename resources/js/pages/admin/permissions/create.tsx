import { Button } from '@/components/ui/button';
import { FormField } from '@/components/form-field';
import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Permissions', href: '/admin/permissions' },
    { title: 'Create', href: '/admin/permissions/create' },
];

export default function PermissionsCreate() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/permissions', {
            onSuccess: () => toast.success('Permission created successfully'),
            onError: () => toast.error('Failed to create permission'),
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Permission" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Create Permission</h1>
                </div>

                <div className="flex-1">
                    <form onSubmit={handleSubmit} className="max-w-2xl space-y-4">
                        <FormField
                            label="Permission Name"
                            htmlFor="name"
                            error={errors.name}
                            required
                            help="Use format: resource.action (e.g., users.view, roles.edit)"
                        >
                            <Input
                                id="name"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                placeholder="e.g., users.view"
                                aria-invalid={!!errors.name}
                            />
                        </FormField>

                        <div className="flex gap-2">
                            <Button type="submit" disabled={processing}>
                                {processing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Create Permission
                            </Button>
                            <Link href="/admin/permissions">
                                <Button variant="outline" type="button">Cancel</Button>
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
