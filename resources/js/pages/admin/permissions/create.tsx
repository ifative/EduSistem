import { Button } from '@/components/ui/button';
import { FormField } from '@/components/form-field';
import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

export default function PermissionsCreate() {
    const { t } = useTranslation();

    const breadcrumbs: BreadcrumbItem[] = [
        { title: t('admin:breadcrumbs.dashboard'), href: '/dashboard' },
        { title: t('admin:breadcrumbs.permissions'), href: '/admin/permissions' },
        { title: t('admin:breadcrumbs.create'), href: '/admin/permissions/create' },
    ];

    const { data, setData, post, processing, errors } = useForm({
        name: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/permissions', {
            onSuccess: () => toast.success(t('admin:permissions.created_success')),
            onError: () => toast.error(t('admin:permissions.created_error')),
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('admin:permissions.create')} />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">{t('admin:permissions.create')}</h1>
                </div>

                <div className="flex-1">
                    <form onSubmit={handleSubmit} className="max-w-2xl space-y-4">
                        <FormField
                            label={t('admin:permissions.name')}
                            htmlFor="name"
                            error={errors.name}
                            required
                            help={t('admin:permissions.name_help')}
                        >
                            <Input
                                id="name"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                placeholder={t('admin:permissions.name_placeholder')}
                                aria-invalid={!!errors.name}
                            />
                        </FormField>

                        <div className="flex gap-2">
                            <Button type="submit" disabled={processing}>
                                {processing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                {t('admin:permissions.create')}
                            </Button>
                            <Link href="/admin/permissions">
                                <Button variant="outline" type="button">{t('common:actions.cancel')}</Button>
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
