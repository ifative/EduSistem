import { Head, Link, router } from '@inertiajs/react';
import { PlusIcon, PencilIcon, TrashIcon, EyeIcon, DownloadIcon } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';

interface Classroom {
    id: number;
    name: string;
}

interface Student {
    id: number;
    nis: string;
    nisn: string;
    name: string;
    gender: string;
    status: string;
    classrooms: Classroom[];
}

interface Props {
    students: {
        data: Student[];
        links: any;
        meta: any;
    };
    classrooms: Classroom[];
    filters: {
        search?: string;
        status?: string;
        classroom_id?: string;
    };
}

export default function StudentsIndex({ students, classrooms, filters }: Props) {
    const { t } = useTranslation(['admin', 'common']);
    const [search, setSearch] = useState(filters.search || '');
    const [status, setStatus] = useState(filters.status || '__all__');
    const [classroomId, setClassroomId] = useState(filters.classroom_id || '__all__');
    const [deleteId, setDeleteId] = useState<number | null>(null);

    const breadcrumbs: BreadcrumbItem[] = [
        { title: t('breadcrumbs.dashboard'), href: '/dashboard' },
        { title: t('breadcrumbs.master_data'), href: '#' },
        { title: t('breadcrumbs.students'), href: '/admin/master/students' },
    ];

    const handleFilter = () => {
        router.get('/admin/master/students', {
            search: search || undefined,
            status: status === '__all__' ? undefined : status,
            classroom_id: classroomId === '__all__' ? undefined : classroomId,
        }, { preserveState: true });
    };

    const handleDelete = () => {
        if (deleteId) {
            router.delete(`/admin/master/students/${deleteId}`);
            setDeleteId(null);
        }
    };

    const handleExport = () => {
        window.location.href = `/admin/master/students/export?${new URLSearchParams({
            search: search || '',
            status: status || '',
            classroom_id: classroomId || '',
        })}`;
    };

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
            <Head title={t('students.title')} />

            <div className="flex flex-col gap-4 p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">{t('students.title')}</h1>
                    <div className="flex gap-2">
                        <Button variant="outline" onClick={handleExport}>
                            <DownloadIcon className="mr-2 h-4 w-4" />
                            {t('common:export.export')}
                        </Button>
                        <Link href="/admin/master/students/create">
                            <Button>
                                <PlusIcon className="mr-2 h-4 w-4" />
                                {t('students.add')}
                            </Button>
                        </Link>
                    </div>
                </div>

                <Card>
                    <CardHeader>
                        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                            <CardTitle>{t('students.all_students')}</CardTitle>
                            <div className="flex flex-wrap gap-2">
                                <Input
                                    placeholder={t('students.search_placeholder')}
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="w-48"
                                />
                                <Select value={status} onValueChange={setStatus}>
                                    <SelectTrigger className="w-32">
                                        <SelectValue placeholder={t('students.status.title')} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="__all__">{t('students.all_status')}</SelectItem>
                                        <SelectItem value="active">{t('students.status.active')}</SelectItem>
                                        <SelectItem value="graduated">{t('students.status.graduated')}</SelectItem>
                                        <SelectItem value="transferred">{t('students.status.transferred')}</SelectItem>
                                        <SelectItem value="dropped">{t('students.status.dropped')}</SelectItem>
                                    </SelectContent>
                                </Select>
                                <Select value={classroomId} onValueChange={setClassroomId}>
                                    <SelectTrigger className="w-40">
                                        <SelectValue placeholder={t('students.classroom')} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="__all__">{t('students.all_classrooms')}</SelectItem>
                                        {classrooms.map((classroom) => (
                                            <SelectItem key={classroom.id} value={String(classroom.id)}>
                                                {classroom.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <Button onClick={handleFilter} variant="secondary">
                                    {t('common:actions.search')}
                                </Button>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>{t('students.nis')}</TableHead>
                                    <TableHead>{t('students.nisn')}</TableHead>
                                    <TableHead>{t('students.name')}</TableHead>
                                    <TableHead>{t('students.gender')}</TableHead>
                                    <TableHead>{t('students.classroom')}</TableHead>
                                    <TableHead>{t('students.status.title')}</TableHead>
                                    <TableHead className="text-right">{t('common:table.actions')}</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {students.data.map((student) => (
                                    <TableRow key={student.id}>
                                        <TableCell className="font-mono">{student.nis}</TableCell>
                                        <TableCell className="font-mono">{student.nisn}</TableCell>
                                        <TableCell className="font-medium">{student.name}</TableCell>
                                        <TableCell className="capitalize">{student.gender}</TableCell>
                                        <TableCell>
                                            {student.classrooms[0]?.name || '-'}
                                        </TableCell>
                                        <TableCell>{getStatusBadge(student.status)}</TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Link href={`/admin/master/students/${student.id}`}>
                                                    <Button variant="ghost" size="icon">
                                                        <EyeIcon className="h-4 w-4" />
                                                    </Button>
                                                </Link>
                                                <Link href={`/admin/master/students/${student.id}/edit`}>
                                                    <Button variant="ghost" size="icon">
                                                        <PencilIcon className="h-4 w-4" />
                                                    </Button>
                                                </Link>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => setDeleteId(student.id)}
                                                >
                                                    <TrashIcon className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {students.data.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                                            {t('students.empty_title')}
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>

            <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>{t('students.delete_title')}</AlertDialogTitle>
                        <AlertDialogDescription>
                            {t('students.delete_description')}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>{t('common:dialog.cancel')}</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete}>{t('common:dialog.delete')}</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </AppLayout>
    );
}
