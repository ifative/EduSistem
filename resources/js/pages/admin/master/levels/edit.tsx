import { Head, Link, useForm } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';

interface Level { id: number; name: string; code: string; }
interface Props { level: Level; }

export default function LevelsEdit({ level }: Props) {
    const { t } = useTranslation(['admin', 'common']);
    const { data, setData, put, processing, errors } = useForm({ name: level.name, code: level.code });

    const breadcrumbs: BreadcrumbItem[] = [
        { title: t('breadcrumbs.dashboard'), href: '/dashboard' },
        { title: t('breadcrumbs.master_data'), href: '#' },
        { title: t('breadcrumbs.levels'), href: '/admin/master/levels' },
        { title: t('breadcrumbs.edit'), href: '#' },
    ];

    const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); put(`/admin/master/levels/${level.id}`); };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('levels.edit')} />
            <div className="flex flex-col gap-4 p-4">
                <h1 className="text-2xl font-bold">{t('levels.edit')}</h1>
                <Card>
                    <CardHeader><CardTitle>{t('levels.level_info')}</CardTitle></CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2"><Label htmlFor="name">{t('levels.name')} *</Label><Input id="name" value={data.name} onChange={(e) => setData('name', e.target.value)} />{errors.name && <p className="text-sm text-destructive">{errors.name}</p>}</div>
                                <div className="space-y-2"><Label htmlFor="code">{t('levels.code')} *</Label><Input id="code" value={data.code} onChange={(e) => setData('code', e.target.value)} />{errors.code && <p className="text-sm text-destructive">{errors.code}</p>}</div>
                            </div>
                            <div className="flex gap-4 pt-4"><Button type="submit" disabled={processing}>{processing ? t('levels.updating') : t('common:actions.save')}</Button><Link href="/admin/master/levels"><Button type="button" variant="outline">{t('common:actions.cancel')}</Button></Link></div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
