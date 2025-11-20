import { Head, Link, router } from '@inertiajs/react';
import { PlusIcon, PencilIcon, TrashIcon, EyeIcon } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';

interface Classroom {
    id: number; name: string; code: string; capacity: number; students_count: number;
    level: { id: number; name: string }; major?: { id: number; name: string }; homeroom_teacher?: { id: number; name: string };
}
interface Props {
    classrooms: { data: Classroom[] }; levels: { id: number; name: string }[]; majors: { id: number; name: string }[];
    filters: { search?: string; level_id?: string; major_id?: string };
}

export default function ClassroomsIndex({ classrooms, levels, majors, filters }: Props) {
    const { t } = useTranslation(['admin', 'common']);
    const [search, setSearch] = useState(filters.search || '');
    const [levelId, setLevelId] = useState(filters.level_id || '__all__');
    const [majorId, setMajorId] = useState(filters.major_id || '__all__');
    const [deleteId, setDeleteId] = useState<number | null>(null);

    const breadcrumbs: BreadcrumbItem[] = [
        { title: t('breadcrumbs.dashboard'), href: '/dashboard' },
        { title: t('breadcrumbs.master_data'), href: '#' },
        { title: t('breadcrumbs.classrooms'), href: '/admin/master/classrooms' }
    ];

    const handleFilter = () => router.get('/admin/master/classrooms', { search: search || undefined, level_id: levelId === '__all__' ? undefined : levelId, major_id: majorId === '__all__' ? undefined : majorId }, { preserveState: true });
    const handleDelete = () => { if (deleteId) { router.delete(`/admin/master/classrooms/${deleteId}`); setDeleteId(null); } };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('classrooms.title')} />
            <div className="flex flex-col gap-4 p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">{t('classrooms.title')}</h1>
                    <Link href="/admin/master/classrooms/create"><Button><PlusIcon className="mr-2 h-4 w-4" />{t('classrooms.add')}</Button></Link>
                </div>
                <Card>
                    <CardHeader>
                        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                            <CardTitle>{t('classrooms.all_classrooms')}</CardTitle>
                            <div className="flex flex-wrap gap-2">
                                <Input placeholder={t('classrooms.search_placeholder')} value={search} onChange={(e) => setSearch(e.target.value)} className="w-40" />
                                <Select value={levelId} onValueChange={setLevelId}><SelectTrigger className="w-32"><SelectValue placeholder={t('classrooms.level')} /></SelectTrigger><SelectContent><SelectItem value="__all__">{t('classrooms.all_levels')}</SelectItem>{levels.map((l) => <SelectItem key={l.id} value={String(l.id)}>{l.name}</SelectItem>)}</SelectContent></Select>
                                <Select value={majorId} onValueChange={setMajorId}><SelectTrigger className="w-32"><SelectValue placeholder={t('classrooms.major')} /></SelectTrigger><SelectContent><SelectItem value="__all__">{t('classrooms.all_majors')}</SelectItem>{majors.map((m) => <SelectItem key={m.id} value={String(m.id)}>{m.name}</SelectItem>)}</SelectContent></Select>
                                <Button onClick={handleFilter} variant="secondary">{t('common:actions.search')}</Button>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader><TableRow><TableHead>{t('classrooms.name')}</TableHead><TableHead>{t('classrooms.code')}</TableHead><TableHead>{t('classrooms.level')}</TableHead><TableHead>{t('classrooms.major')}</TableHead><TableHead>{t('classrooms.homeroom_teacher')}</TableHead><TableHead>{t('classrooms.students_count')}</TableHead><TableHead className="text-right">{t('common:table.actions')}</TableHead></TableRow></TableHeader>
                            <TableBody>
                                {classrooms.data.map((c) => (
                                    <TableRow key={c.id}>
                                        <TableCell className="font-medium">{c.name}</TableCell>
                                        <TableCell>{c.code}</TableCell>
                                        <TableCell>{c.level?.name}</TableCell>
                                        <TableCell>{c.major?.name || '-'}</TableCell>
                                        <TableCell>{c.homeroom_teacher?.name || '-'}</TableCell>
                                        <TableCell>{c.students_count}/{c.capacity}</TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Link href={`/admin/master/classrooms/${c.id}`}><Button variant="ghost" size="icon"><EyeIcon className="h-4 w-4" /></Button></Link>
                                                <Link href={`/admin/master/classrooms/${c.id}/edit`}><Button variant="ghost" size="icon"><PencilIcon className="h-4 w-4" /></Button></Link>
                                                <Button variant="ghost" size="icon" onClick={() => setDeleteId(c.id)}><TrashIcon className="h-4 w-4" /></Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {classrooms.data.length === 0 && <TableRow><TableCell colSpan={7} className="text-center py-8 text-muted-foreground">{t('classrooms.empty_title')}</TableCell></TableRow>}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
            <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}><AlertDialogContent><AlertDialogHeader><AlertDialogTitle>{t('classrooms.delete_title')}</AlertDialogTitle><AlertDialogDescription>{t('classrooms.delete_description')}</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>{t('common:dialog.cancel')}</AlertDialogCancel><AlertDialogAction onClick={handleDelete}>{t('common:dialog.delete')}</AlertDialogAction></AlertDialogFooter></AlertDialogContent></AlertDialog>
        </AppLayout>
    );
}
