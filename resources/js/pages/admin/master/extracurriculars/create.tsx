import { Head, Link, useForm } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';

interface Teacher {
    id: number;
    name: string;
}

interface Props {
    teachers: Teacher[];
}

export default function ExtracurricularsCreate({ teachers }: Props) {
    const { t } = useTranslation(['admin', 'common']);
    const { data, setData, post, processing, errors } = useForm({ name: '', description: '', instructor_id: '' });

    const breadcrumbs: BreadcrumbItem[] = [
        { title: t('breadcrumbs.dashboard'), href: '/dashboard' },
        { title: t('breadcrumbs.master_data'), href: '#' },
        { title: t('breadcrumbs.extracurriculars'), href: '/admin/master/extracurriculars' },
        { title: t('breadcrumbs.create'), href: '#' },
    ];

    const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); post('/admin/master/extracurriculars'); };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('extracurriculars.create')} />
            <div className="flex flex-col gap-4 p-4">
                <h1 className="text-2xl font-bold">{t('extracurriculars.create')}</h1>
                <Card>
                    <CardHeader><CardTitle>{t('extracurriculars.extracurricular_info')}</CardTitle></CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">{t('extracurriculars.name')} *</Label>
                                <Input id="name" value={data.name} onChange={(e) => setData('name', e.target.value)} />
                                {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="description">{t('extracurriculars.description')}</Label>
                                <Textarea id="description" value={data.description} onChange={(e) => setData('description', e.target.value)} rows={4} />
                                {errors.description && <p className="text-sm text-destructive">{errors.description}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label>{t('extracurriculars.instructor')}</Label>
                                <Select value={data.instructor_id} onValueChange={(v) => setData('instructor_id', v)}>
                                    <SelectTrigger><SelectValue placeholder={t('extracurriculars.select_instructor')} /></SelectTrigger>
                                    <SelectContent>
                                        {teachers.map((teacher) => <SelectItem key={teacher.id} value={String(teacher.id)}>{teacher.name}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                                {errors.instructor_id && <p className="text-sm text-destructive">{errors.instructor_id}</p>}
                            </div>
                            <div className="flex gap-4 pt-4">
                                <Button type="submit" disabled={processing}>{processing ? t('extracurriculars.creating') : t('extracurriculars.create')}</Button>
                                <Link href="/admin/master/extracurriculars"><Button type="button" variant="outline">{t('common:actions.cancel')}</Button></Link>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
