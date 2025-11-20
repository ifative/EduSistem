import { Head, Link, useForm } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';

interface Props {
    levels: { id: number; name: string; code: string }[];
    majors: { id: number; name: string; code: string }[];
    teachers: { id: number; name: string }[];
}

export default function ClassroomsCreate({ levels, majors, teachers }: Props) {
    const { t } = useTranslation(['admin', 'common']);
    const { data, setData, post, processing, errors, transform } = useForm({ name: '', code: '', level_id: '', major_id: '__none__', capacity: '30', homeroom_teacher_id: '__none__' });

    const breadcrumbs: BreadcrumbItem[] = [
        { title: t('breadcrumbs.dashboard'), href: '/dashboard' },
        { title: t('breadcrumbs.master_data'), href: '#' },
        { title: t('breadcrumbs.classrooms'), href: '/admin/master/classrooms' },
        { title: t('breadcrumbs.create'), href: '#' }
    ];

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        transform((data) => ({
            ...data,
            major_id: data.major_id === '__none__' ? '' : data.major_id,
            homeroom_teacher_id: data.homeroom_teacher_id === '__none__' ? '' : data.homeroom_teacher_id,
        }));
        post('/admin/master/classrooms');
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('classrooms.create')} />
            <div className="flex flex-col gap-4 p-4">
                <h1 className="text-2xl font-bold">{t('classrooms.create')}</h1>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <Card>
                        <CardHeader><CardTitle>{t('classrooms.classroom_info')}</CardTitle></CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2"><Label htmlFor="name">{t('classrooms.name')} *</Label><Input id="name" placeholder="e.g., X IPA 1" value={data.name} onChange={(e) => setData('name', e.target.value)} />{errors.name && <p className="text-sm text-destructive">{errors.name}</p>}</div>
                                <div className="space-y-2"><Label htmlFor="code">{t('classrooms.code')} *</Label><Input id="code" value={data.code} onChange={(e) => setData('code', e.target.value)} />{errors.code && <p className="text-sm text-destructive">{errors.code}</p>}</div>
                            </div>
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2"><Label>{t('classrooms.level')} *</Label><Select value={data.level_id} onValueChange={(v) => setData('level_id', v)}><SelectTrigger><SelectValue placeholder={t('classrooms.select_level')} /></SelectTrigger><SelectContent>{levels.map((l) => <SelectItem key={l.id} value={String(l.id)}>{l.name}</SelectItem>)}</SelectContent></Select>{errors.level_id && <p className="text-sm text-destructive">{errors.level_id}</p>}</div>
                                <div className="space-y-2"><Label>{t('classrooms.major')}</Label><Select value={data.major_id} onValueChange={(v) => setData('major_id', v)}><SelectTrigger><SelectValue placeholder={t('classrooms.select_major')} /></SelectTrigger><SelectContent><SelectItem value="__none__">{t('classrooms.none')}</SelectItem>{majors.map((m) => <SelectItem key={m.id} value={String(m.id)}>{m.name}</SelectItem>)}</SelectContent></Select></div>
                            </div>
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2"><Label htmlFor="capacity">{t('classrooms.capacity')} *</Label><Input id="capacity" type="number" min="1" max="100" value={data.capacity} onChange={(e) => setData('capacity', e.target.value)} />{errors.capacity && <p className="text-sm text-destructive">{errors.capacity}</p>}</div>
                                <div className="space-y-2"><Label>{t('classrooms.homeroom_teacher')}</Label><Select value={data.homeroom_teacher_id} onValueChange={(v) => setData('homeroom_teacher_id', v)}><SelectTrigger><SelectValue placeholder={t('classrooms.select_teacher')} /></SelectTrigger><SelectContent><SelectItem value="__none__">{t('classrooms.none')}</SelectItem>{teachers.map((t) => <SelectItem key={t.id} value={String(t.id)}>{t.name}</SelectItem>)}</SelectContent></Select></div>
                            </div>
                        </CardContent>
                    </Card>
                    <div className="flex gap-4"><Button type="submit" disabled={processing}>{processing ? t('classrooms.creating') : t('classrooms.create')}</Button><Link href="/admin/master/classrooms"><Button type="button" variant="outline">{t('common:actions.cancel')}</Button></Link></div>
                </form>
            </div>
        </AppLayout>
    );
}
