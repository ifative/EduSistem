import { Head, Link } from '@inertiajs/react';
import { PencilIcon, ArrowLeftIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';

interface Teacher {
    id: number; nip: string; nuptk: string; name: string; gender: string; email: string; phone: string; address: string; position: string; status: string;
    homeroom_classrooms: { id: number; name: string }[];
    extracurriculars: { id: number; name: string }[];
}

interface Props { teacher: Teacher; }

export default function TeachersShow({ teacher }: Props) {
    const { t } = useTranslation(['admin', 'common']);

    const breadcrumbs: BreadcrumbItem[] = [
        { title: t('breadcrumbs.dashboard'), href: '/dashboard' },
        { title: t('breadcrumbs.master_data'), href: '#' },
        { title: t('breadcrumbs.teachers'), href: '/admin/master/teachers' },
        { title: t('breadcrumbs.detail'), href: '#' },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`${t('teachers.detail')}: ${teacher.name}`} />
            <div className="flex flex-col gap-4 p-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/admin/master/teachers"><Button variant="ghost" size="icon"><ArrowLeftIcon className="h-4 w-4" /></Button></Link>
                        <h1 className="text-2xl font-bold">{teacher.name}</h1>
                        <Badge variant={teacher.status === 'active' ? 'default' : 'secondary'}>
                            {teacher.status === 'active' ? t('teachers.status.active') : t('teachers.status.inactive')}
                        </Badge>
                    </div>
                    <Link href={`/admin/master/teachers/${teacher.id}/edit`}><Button><PencilIcon className="mr-2 h-4 w-4" />{t('breadcrumbs.edit')}</Button></Link>
                </div>
                <div className="grid gap-6 md:grid-cols-2">
                    <Card>
                        <CardHeader><CardTitle>{t('teachers.teacher_info')}</CardTitle></CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div><p className="text-sm text-muted-foreground">{t('teachers.nip')}</p><p className="font-mono">{teacher.nip || '-'}</p></div>
                                <div><p className="text-sm text-muted-foreground">{t('teachers.nuptk')}</p><p className="font-mono">{teacher.nuptk || '-'}</p></div>
                            </div>
                            <div><p className="text-sm text-muted-foreground">{t('teachers.gender')}</p><p className="capitalize">{teacher.gender === 'male' ? t('teachers.male') : t('teachers.female')}</p></div>
                            <div><p className="text-sm text-muted-foreground">{t('teachers.email')}</p><p>{teacher.email}</p></div>
                            <div><p className="text-sm text-muted-foreground">{t('teachers.phone')}</p><p>{teacher.phone}</p></div>
                            <div><p className="text-sm text-muted-foreground">{t('teachers.address')}</p><p>{teacher.address}</p></div>
                            <div><p className="text-sm text-muted-foreground">{t('teachers.position')}</p><p>{teacher.position || '-'}</p></div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader><CardTitle>{t('teachers.assignments')}</CardTitle></CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <p className="text-sm text-muted-foreground">{t('teachers.homeroom_classes')}</p>
                                {teacher.homeroom_classrooms?.length > 0 ? (
                                    <ul className="list-disc list-inside">{teacher.homeroom_classrooms.map((c) => <li key={c.id}>{c.name}</li>)}</ul>
                                ) : <p>-</p>}
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">{t('teachers.extracurriculars')}</p>
                                {teacher.extracurriculars?.length > 0 ? (
                                    <ul className="list-disc list-inside">{teacher.extracurriculars.map((e) => <li key={e.id}>{e.name}</li>)}</ul>
                                ) : <p>-</p>}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
