import { Head, Link, router } from '@inertiajs/react';
import { PlusIcon, PencilIcon, TrashIcon, EyeIcon } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';

interface Teacher {
    id: number;
    nip: string;
    nuptk: string;
    name: string;
    email: string;
    phone: string;
    status: string;
    homeroom_classrooms_count: number;
}

interface Props {
    teachers: { data: Teacher[]; links: any; meta: any };
    filters: { search?: string; status?: string };
}

export default function TeachersIndex({ teachers, filters }: Props) {
    const { t } = useTranslation(['admin', 'common']);
    const [search, setSearch] = useState(filters.search || '');
    const [status, setStatus] = useState(filters.status || '__all__');
    const [deleteId, setDeleteId] = useState<number | null>(null);

    const breadcrumbs: BreadcrumbItem[] = [
        { title: t('breadcrumbs.dashboard'), href: '/dashboard' },
        { title: t('breadcrumbs.master_data'), href: '#' },
        { title: t('breadcrumbs.teachers'), href: '/admin/master/teachers' },
    ];

    const handleFilter = () => {
        router.get('/admin/master/teachers', { search: search || undefined, status: status === '__all__' ? undefined : status }, { preserveState: true });
    };

    const handleDelete = () => {
        if (deleteId) {
            router.delete(`/admin/master/teachers/${deleteId}`);
            setDeleteId(null);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('teachers.title')} />
            <div className="flex flex-col gap-4 p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">{t('teachers.title')}</h1>
                    <Link href="/admin/master/teachers/create">
                        <Button><PlusIcon className="mr-2 h-4 w-4" />{t('teachers.add')}</Button>
                    </Link>
                </div>
                <Card>
                    <CardHeader>
                        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                            <CardTitle>{t('teachers.all_teachers')}</CardTitle>
                            <div className="flex flex-wrap gap-2">
                                <Input placeholder={t('teachers.search_placeholder')} value={search} onChange={(e) => setSearch(e.target.value)} className="w-48" />
                                <Select value={status} onValueChange={setStatus}>
                                    <SelectTrigger className="w-32"><SelectValue placeholder={t('teachers.status.title')} /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="__all__">{t('students.all_status')}</SelectItem>
                                        <SelectItem value="active">{t('teachers.status.active')}</SelectItem>
                                        <SelectItem value="inactive">{t('teachers.status.inactive')}</SelectItem>
                                    </SelectContent>
                                </Select>
                                <Button onClick={handleFilter} variant="secondary">{t('common:actions.search')}</Button>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>{t('teachers.nip')}</TableHead>
                                    <TableHead>{t('teachers.name')}</TableHead>
                                    <TableHead>{t('teachers.email')}</TableHead>
                                    <TableHead>{t('teachers.phone')}</TableHead>
                                    <TableHead>{t('teachers.homerooms')}</TableHead>
                                    <TableHead>{t('teachers.status.title')}</TableHead>
                                    <TableHead className="text-right">{t('common:table.actions')}</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {teachers.data.map((teacher) => (
                                    <TableRow key={teacher.id}>
                                        <TableCell className="font-mono">{teacher.nip || '-'}</TableCell>
                                        <TableCell className="font-medium">{teacher.name}</TableCell>
                                        <TableCell>{teacher.email}</TableCell>
                                        <TableCell>{teacher.phone}</TableCell>
                                        <TableCell>{teacher.homeroom_classrooms_count}</TableCell>
                                        <TableCell>
                                            <Badge variant={teacher.status === 'active' ? 'default' : 'secondary'}>
                                                {teacher.status === 'active' ? t('teachers.status.active') : t('teachers.status.inactive')}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Link href={`/admin/master/teachers/${teacher.id}`}><Button variant="ghost" size="icon"><EyeIcon className="h-4 w-4" /></Button></Link>
                                                <Link href={`/admin/master/teachers/${teacher.id}/edit`}><Button variant="ghost" size="icon"><PencilIcon className="h-4 w-4" /></Button></Link>
                                                <Button variant="ghost" size="icon" onClick={() => setDeleteId(teacher.id)}><TrashIcon className="h-4 w-4" /></Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {teachers.data.length === 0 && (
                                    <TableRow><TableCell colSpan={7} className="text-center py-8 text-muted-foreground">{t('teachers.empty_title')}</TableCell></TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
            <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>{t('teachers.delete_title')}</AlertDialogTitle>
                        <AlertDialogDescription>{t('teachers.delete_description')}</AlertDialogDescription>
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
