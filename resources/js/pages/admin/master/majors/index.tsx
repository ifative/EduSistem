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

interface Major { id: number; name: string; code: string; classrooms_count: number; }
interface Props { majors: { data: Major[] }; filters: { search?: string }; }

export default function MajorsIndex({ majors, filters }: Props) {
    const { t } = useTranslation(['admin', 'common']);
    const [search, setSearch] = useState(filters.search || '');
    const [deleteId, setDeleteId] = useState<number | null>(null);

    const breadcrumbs: BreadcrumbItem[] = [
        { title: t('breadcrumbs.dashboard'), href: '/dashboard' },
        { title: t('breadcrumbs.master_data'), href: '#' },
        { title: t('breadcrumbs.majors'), href: '/admin/master/majors' },
    ];

    const handleSearch = (e: React.FormEvent) => { e.preventDefault(); router.get('/admin/master/majors', { search: search || undefined }, { preserveState: true }); };
    const handleDelete = () => { if (deleteId) { router.delete(`/admin/master/majors/${deleteId}`); setDeleteId(null); } };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('majors.title')} />
            <div className="flex flex-col gap-4 p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">{t('majors.title')}</h1>
                    <Link href="/admin/master/majors/create"><Button><PlusIcon className="mr-2 h-4 w-4" />{t('majors.add')}</Button></Link>
                </div>
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle>{t('majors.all_majors')}</CardTitle>
                            <form onSubmit={handleSearch} className="flex gap-2"><Input placeholder={t('majors.search_placeholder')} value={search} onChange={(e) => setSearch(e.target.value)} className="w-64" /><Button type="submit" variant="secondary">{t('common:actions.search')}</Button></form>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader><TableRow><TableHead>{t('majors.code')}</TableHead><TableHead>{t('majors.name')}</TableHead><TableHead>{t('majors.classrooms_count')}</TableHead><TableHead className="text-right">{t('common:table.actions')}</TableHead></TableRow></TableHeader>
                            <TableBody>
                                {majors.data.map((m) => (
                                    <TableRow key={m.id}>
                                        <TableCell className="font-mono">{m.code}</TableCell>
                                        <TableCell className="font-medium">{m.name}</TableCell>
                                        <TableCell>{m.classrooms_count}</TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Link href={`/admin/master/majors/${m.id}/edit`}><Button variant="ghost" size="icon"><PencilIcon className="h-4 w-4" /></Button></Link>
                                                <Button variant="ghost" size="icon" onClick={() => setDeleteId(m.id)}><TrashIcon className="h-4 w-4" /></Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {majors.data.length === 0 && <TableRow><TableCell colSpan={4} className="text-center py-8 text-muted-foreground">{t('majors.empty_title')}</TableCell></TableRow>}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
            <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}><AlertDialogContent><AlertDialogHeader><AlertDialogTitle>{t('majors.delete_title')}</AlertDialogTitle><AlertDialogDescription>{t('majors.delete_description')}</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>{t('common:actions.cancel')}</AlertDialogCancel><AlertDialogAction onClick={handleDelete}>{t('common:dialog.delete')}</AlertDialogAction></AlertDialogFooter></AlertDialogContent></AlertDialog>
        </AppLayout>
    );
}
