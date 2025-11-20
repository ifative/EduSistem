import { Head, Link, useForm } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';

interface Subject { id: number; name: string; code: string; group: string; credits: number; }
interface Props { subject: Subject; groups: string[]; }

export default function SubjectsEdit({ subject, groups }: Props) {
    const { t } = useTranslation(['admin', 'common']);
    const { data, setData, put, processing, errors } = useForm({ name: subject.name, code: subject.code, group: subject.group, credits: String(subject.credits) });

    const breadcrumbs: BreadcrumbItem[] = [
        { title: t('breadcrumbs.dashboard'), href: '/dashboard' },
        { title: t('breadcrumbs.master_data'), href: '#' },
        { title: t('breadcrumbs.subjects'), href: '/admin/master/subjects' },
        { title: t('breadcrumbs.edit'), href: '#' },
    ];

    const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); put(`/admin/master/subjects/${subject.id}`); };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('subjects.edit')} />
            <div className="flex flex-col gap-4 p-4">
                <h1 className="text-2xl font-bold">{t('subjects.edit')}</h1>
                <Card>
                    <CardHeader><CardTitle>{t('subjects.subject_info')}</CardTitle></CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2"><Label htmlFor="name">{t('subjects.name')} *</Label><Input id="name" value={data.name} onChange={(e) => setData('name', e.target.value)} />{errors.name && <p className="text-sm text-destructive">{errors.name}</p>}</div>
                                <div className="space-y-2"><Label htmlFor="code">{t('subjects.code')} *</Label><Input id="code" value={data.code} onChange={(e) => setData('code', e.target.value)} />{errors.code && <p className="text-sm text-destructive">{errors.code}</p>}</div>
                            </div>
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2"><Label>{t('subjects.group')} *</Label><Select value={data.group} onValueChange={(v) => setData('group', v)}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{groups.map((g) => <SelectItem key={g} value={g}>{g}</SelectItem>)}</SelectContent></Select></div>
                                <div className="space-y-2"><Label htmlFor="credits">{t('subjects.credits')} *</Label><Input id="credits" type="number" min="1" max="10" value={data.credits} onChange={(e) => setData('credits', e.target.value)} />{errors.credits && <p className="text-sm text-destructive">{errors.credits}</p>}</div>
                            </div>
                            <div className="flex gap-4 pt-4"><Button type="submit" disabled={processing}>{processing ? t('subjects.updating') : t('common:actions.save')}</Button><Link href="/admin/master/subjects"><Button type="button" variant="outline">{t('common:actions.cancel')}</Button></Link></div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
