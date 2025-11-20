import { Head, Link, router } from '@inertiajs/react';
import { PlusIcon, PencilIcon, TrashIcon } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';

interface Extracurricular {
    id: number;
    name: string;
    description: string | null;
    instructor: { id: number; name: string } | null;
}

interface Props {
    extracurriculars: { data: Extracurricular[]; links: any; meta: any };
    filters: { search?: string };
}

export default function ExtracurricularsIndex({ extracurriculars, filters }: Props) {
    const { t } = useTranslation(['admin', 'common']);
    const [search, setSearch] = useState(filters.search || '');
    const [deleteId, setDeleteId] = useState<number | null>(null);

    const breadcrumbs: BreadcrumbItem[] = [
        { title: t('breadcrumbs.dashboard'), href: '/dashboard' },
        { title: t('breadcrumbs.master_data'), href: '#' },
        { title: t('breadcrumbs.extracurriculars'), href: '/admin/master/extracurriculars' },
    ];

    const handleFilter = () => router.get('/admin/master/extracurriculars', { search: search || undefined }, { preserveState: true });
    const handleDelete = () => { if (deleteId) { router.delete(`/admin/master/extracurriculars/${deleteId}`); setDeleteId(null); } };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('extracurriculars.title')} />
            <div className="flex flex-col gap-4 p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">{t('extracurriculars.title')}</h1>
                    <Link href="/admin/master/extracurriculars/create"><Button><PlusIcon className="mr-2 h-4 w-4" />{t('extracurriculars.add')}</Button></Link>
                </div>
                <Card>
                    <CardHeader>
                        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                            <CardTitle>{t('extracurriculars.all_extracurriculars')}</CardTitle>
                            <div className="flex flex-wrap gap-2">
                                <Input placeholder={t('extracurriculars.search_placeholder')} value={search} onChange={(e) => setSearch(e.target.value)} className="w-48" />
                                <Button onClick={handleFilter} variant="secondary">{t('common:actions.search')}</Button>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader><TableRow><TableHead>{t('extracurriculars.name')}</TableHead><TableHead>{t('extracurriculars.description')}</TableHead><TableHead>{t('extracurriculars.instructor')}</TableHead><TableHead className="text-right">{t('common:table.actions')}</TableHead></TableRow></TableHeader>
                            <TableBody>
                                {extracurriculars.data.map((e) => (
                                    <TableRow key={e.id}>
                                        <TableCell className="font-medium">{e.name}</TableCell>
                                        <TableCell>{e.description || '-'}</TableCell>
                                        <TableCell>{e.instructor?.name || '-'}</TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Link href={`/admin/master/extracurriculars/${e.id}/edit`}><Button variant="ghost" size="icon"><PencilIcon className="h-4 w-4" /></Button></Link>
                                                <Button variant="ghost" size="icon" onClick={() => setDeleteId(e.id)}><TrashIcon className="h-4 w-4" /></Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {extracurriculars.data.length === 0 && <TableRow><TableCell colSpan={4} className="text-center py-8 text-muted-foreground">{t('extracurriculars.empty_title')}</TableCell></TableRow>}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
            <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}><AlertDialogContent><AlertDialogHeader><AlertDialogTitle>{t('extracurriculars.delete_title')}</AlertDialogTitle><AlertDialogDescription>{t('extracurriculars.delete_description')}</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>{t('common:actions.cancel')}</AlertDialogCancel><AlertDialogAction onClick={handleDelete}>{t('common:dialog.delete')}</AlertDialogAction></AlertDialogFooter></AlertDialogContent></AlertDialog>
        </AppLayout>
    );
}
