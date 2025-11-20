import { Head, Link } from '@inertiajs/react';
import { PencilIcon, ArrowLeftIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';

interface Student { id: number; nis: string; name: string; gender: string; }
interface Classroom { id: number; name: string; code: string; capacity: number; level?: { name: string }; major?: { name: string }; homeroom_teacher?: { name: string }; }
interface Props { classroom: Classroom; students: Student[]; activeSemester?: { name: string }; }

export default function ClassroomsShow({ classroom, students, activeSemester }: Props) {
    const { t } = useTranslation(['admin', 'common']);

    const breadcrumbs: BreadcrumbItem[] = [
        { title: t('breadcrumbs.dashboard'), href: '/dashboard' },
        { title: t('breadcrumbs.master_data'), href: '#' },
        { title: t('breadcrumbs.classrooms'), href: '/admin/master/classrooms' },
        { title: t('breadcrumbs.detail'), href: '#' }
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`${t('classrooms.detail')}: ${classroom.name}`} />
            <div className="flex flex-col gap-4 p-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/admin/master/classrooms"><Button variant="ghost" size="icon"><ArrowLeftIcon className="h-4 w-4" /></Button></Link>
                        <h1 className="text-2xl font-bold">{classroom.name}</h1>
                    </div>
                    <Link href={`/admin/master/classrooms/${classroom.id}/edit`}><Button><PencilIcon className="mr-2 h-4 w-4" />{t('common:actions.edit')}</Button></Link>
                </div>
                <div className="grid gap-6 md:grid-cols-2">
                    <Card>
                        <CardHeader><CardTitle>{t('classrooms.classroom_info')}</CardTitle></CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div><p className="text-sm text-muted-foreground">{t('classrooms.code')}</p><p>{classroom.code}</p></div>
                                <div><p className="text-sm text-muted-foreground">{t('classrooms.capacity')}</p><p>{students.length}/{classroom.capacity}</p></div>
                            </div>
                            <div><p className="text-sm text-muted-foreground">{t('classrooms.level')}</p><p>{classroom.level?.name}</p></div>
                            <div><p className="text-sm text-muted-foreground">{t('classrooms.major')}</p><p>{classroom.major?.name || '-'}</p></div>
                            <div><p className="text-sm text-muted-foreground">{t('classrooms.homeroom_teacher')}</p><p>{classroom.homeroom_teacher?.name || '-'}</p></div>
                        </CardContent>
                    </Card>
                </div>
                <Card>
                    <CardHeader><CardTitle>{t('classrooms.students')} {activeSemester && `(${activeSemester.name})`}</CardTitle></CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader><TableRow><TableHead>{t('classrooms.nis')}</TableHead><TableHead>{t('classrooms.student_name')}</TableHead><TableHead>{t('classrooms.gender')}</TableHead></TableRow></TableHeader>
                            <TableBody>
                                {students.map((s) => <TableRow key={s.id}><TableCell className="font-mono">{s.nis}</TableCell><TableCell>{s.name}</TableCell><TableCell className="capitalize">{s.gender}</TableCell></TableRow>)}
                                {students.length === 0 && <TableRow><TableCell colSpan={3} className="text-center py-8 text-muted-foreground">{t('classrooms.no_students')}</TableCell></TableRow>}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
