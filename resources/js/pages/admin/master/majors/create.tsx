import { Head, Link, useForm } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';

export default function MajorsCreate() {
    const { t } = useTranslation(['admin', 'common']);
    const { data, setData, post, processing, errors } = useForm({ name: '', code: '' });

    const breadcrumbs: BreadcrumbItem[] = [
        { title: t('breadcrumbs.dashboard'), href: '/dashboard' },
        { title: t('breadcrumbs.master_data'), href: '#' },
        { title: t('breadcrumbs.majors'), href: '/admin/master/majors' },
        { title: t('breadcrumbs.create'), href: '#' },
    ];

    const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); post('/admin/master/majors'); };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('majors.create')} />
            <div className="flex flex-col gap-4 p-4">
                <h1 className="text-2xl font-bold">{t('majors.create')}</h1>
                <Card>
                    <CardHeader><CardTitle>{t('majors.major_info')}</CardTitle></CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2"><Label htmlFor="name">{t('majors.name')} *</Label><Input id="name" placeholder="e.g., Science" value={data.name} onChange={(e) => setData('name', e.target.value)} />{errors.name && <p className="text-sm text-destructive">{errors.name}</p>}</div>
                                <div className="space-y-2"><Label htmlFor="code">{t('majors.code')} *</Label><Input id="code" placeholder="e.g., IPA" value={data.code} onChange={(e) => setData('code', e.target.value)} />{errors.code && <p className="text-sm text-destructive">{errors.code}</p>}</div>
                            </div>
                            <div className="flex gap-4 pt-4"><Button type="submit" disabled={processing}>{processing ? t('majors.creating') : t('majors.create')}</Button><Link href="/admin/master/majors"><Button type="button" variant="outline">{t('common:actions.cancel')}</Button></Link></div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
