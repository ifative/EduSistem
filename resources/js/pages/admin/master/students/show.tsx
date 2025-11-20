import { Head, Link } from '@inertiajs/react';
import { PencilIcon, ArrowLeftIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';

interface Classroom {
    id: number;
    name: string;
    level?: { name: string };
    major?: { name: string };
}

interface Student {
    id: number;
    nis: string;
    nisn: string;
    name: string;
    gender: string;
    birth_place: string;
    birth_date: string;
    religion: string;
    phone: string;
    address: string;
    parent_name: string;
    parent_phone: string;
    parent_email: string;
    entry_year: number;
    previous_school: string;
    status: string;
    classrooms: Classroom[];
}

interface Props {
    student: Student;
}

export default function StudentsShow({ student }: Props) {
    const { t } = useTranslation(['admin', 'common']);

    const breadcrumbs: BreadcrumbItem[] = [
        { title: t('breadcrumbs.dashboard'), href: '/dashboard' },
        { title: t('breadcrumbs.master_data'), href: '#' },
        { title: t('breadcrumbs.students'), href: '/admin/master/students' },
        { title: t('breadcrumbs.detail'), href: '#' },
    ];

    const getStatusBadge = (status: string) => {
        const variants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
            active: 'default',
            graduated: 'secondary',
            transferred: 'outline',
            dropped: 'destructive',
        };
        const statusLabels: Record<string, string> = {
            active: t('students.status.active'),
            graduated: t('students.status.graduated'),
            transferred: t('students.status.transferred'),
            dropped: t('students.status.dropped'),
        };
        return <Badge variant={variants[status] || 'secondary'}>{statusLabels[status] || status}</Badge>;
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`${t('students.detail')}: ${student.name}`} />

            <div className="flex flex-col gap-4 p-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/admin/master/students">
                            <Button variant="ghost" size="icon">
                                <ArrowLeftIcon className="h-4 w-4" />
                            </Button>
                        </Link>
                        <h1 className="text-2xl font-bold">{student.name}</h1>
                        {getStatusBadge(student.status)}
                    </div>
                    <Link href={`/admin/master/students/${student.id}/edit`}>
                        <Button>
                            <PencilIcon className="mr-2 h-4 w-4" />
                            {t('students.edit')}
                        </Button>
                    </Link>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>{t('students.student_info')}</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-muted-foreground">{t('students.nis')}</p>
                                    <p className="font-mono">{student.nis}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">{t('students.nisn')}</p>
                                    <p className="font-mono">{student.nisn}</p>
                                </div>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">{t('students.gender')}</p>
                                <p className="capitalize">{student.gender}</p>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-muted-foreground">{t('students.birth_place')}</p>
                                    <p>{student.birth_place}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">{t('students.birth_date')}</p>
                                    <p>{new Date(student.birth_date).toLocaleDateString()}</p>
                                </div>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">{t('students.religion')}</p>
                                <p>{student.religion || '-'}</p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">{t('students.phone')}</p>
                                <p>{student.phone || '-'}</p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">{t('students.address')}</p>
                                <p>{student.address}</p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>{t('students.academic_info')}</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <p className="text-sm text-muted-foreground">{t('students.entry_year')}</p>
                                <p>{student.entry_year}</p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">{t('students.previous_school')}</p>
                                <p>{student.previous_school || '-'}</p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">{t('students.current_classroom')}</p>
                                <p>{student.classrooms[0]?.name || '-'}</p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>{t('students.parent_info')}</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <p className="text-sm text-muted-foreground">{t('students.parent_name')}</p>
                                <p>{student.parent_name}</p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">{t('students.parent_phone')}</p>
                                <p>{student.parent_phone}</p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">{t('students.parent_email')}</p>
                                <p>{student.parent_email || '-'}</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
