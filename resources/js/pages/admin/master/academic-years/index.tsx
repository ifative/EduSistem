import { Head, Link, router, usePage } from '@inertiajs/react';
import { PlusIcon, PencilIcon, TrashIcon, CheckCircleIcon } from 'lucide-react';
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

interface AcademicYear {
    id: number;
    name: string;
    start_date: string;
    end_date: string;
    is_active: boolean;
    semesters_count: number;
}

interface Props {
    academicYears: {
        data: AcademicYear[];
        links: any;
        meta: any;
    };
    filters: {
        search?: string;
    };
}

export default function AcademicYearsIndex({ academicYears, filters }: Props) {
    const { t } = useTranslation(['admin', 'common']);
    const [search, setSearch] = useState(filters.search || '');
    const [deleteId, setDeleteId] = useState<number | null>(null);

    const breadcrumbs: BreadcrumbItem[] = [
        { title: t('breadcrumbs.dashboard'), href: '/dashboard' },
        { title: t('breadcrumbs.master_data'), href: '#' },
        { title: t('breadcrumbs.academic_years'), href: '/admin/master/academic-years' },
    ];

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/admin/master/academic-years', { search }, { preserveState: true });
    };

    const handleDelete = () => {
        if (deleteId) {
            router.delete(`/admin/master/academic-years/${deleteId}`);
            setDeleteId(null);
        }
    };

    const handleActivate = (id: number) => {
        router.post(`/admin/master/academic-years/${id}/activate`);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('academic_years.title')} />

            <div className="flex flex-col gap-4 p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">{t('academic_years.title')}</h1>
                    <Link href="/admin/master/academic-years/create">
                        <Button>
                            <PlusIcon className="mr-2 h-4 w-4" />
                            {t('academic_years.add')}
                        </Button>
                    </Link>
                </div>

                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle>{t('academic_years.all_academic_years')}</CardTitle>
                            <form onSubmit={handleSearch} className="flex gap-2">
                                <Input
                                    placeholder={t('academic_years.search_placeholder')}
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="w-64"
                                />
                                <Button type="submit" variant="secondary">
                                    {t('common:actions.search')}
                                </Button>
                            </form>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>{t('academic_years.name')}</TableHead>
                                    <TableHead>{t('academic_years.start_date')}</TableHead>
                                    <TableHead>{t('academic_years.end_date')}</TableHead>
                                    <TableHead>{t('academic_years.semesters')}</TableHead>
                                    <TableHead>{t('academic_years.status')}</TableHead>
                                    <TableHead className="text-right">{t('common:table.actions')}</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {academicYears.data.map((year) => (
                                    <TableRow key={year.id}>
                                        <TableCell className="font-medium">{year.name}</TableCell>
                                        <TableCell>{new Date(year.start_date).toLocaleDateString()}</TableCell>
                                        <TableCell>{new Date(year.end_date).toLocaleDateString()}</TableCell>
                                        <TableCell>{year.semesters_count}</TableCell>
                                        <TableCell>
                                            {year.is_active ? (
                                                <Badge variant="default">{t('academic_years.active')}</Badge>
                                            ) : (
                                                <Badge variant="secondary">{t('academic_years.inactive')}</Badge>
                                            )}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                {!year.is_active && (
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => handleActivate(year.id)}
                                                        title={t('academic_years.activate')}
                                                    >
                                                        <CheckCircleIcon className="h-4 w-4" />
                                                    </Button>
                                                )}
                                                <Link href={`/admin/master/academic-years/${year.id}/edit`}>
                                                    <Button variant="ghost" size="icon">
                                                        <PencilIcon className="h-4 w-4" />
                                                    </Button>
                                                </Link>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => setDeleteId(year.id)}
                                                >
                                                    <TrashIcon className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {academicYears.data.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                                            {t('academic_years.empty_title')}
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
                        <AlertDialogTitle>{t('academic_years.delete_title')}</AlertDialogTitle>
                        <AlertDialogDescription>
                            {t('academic_years.delete_description')}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>{t('common:actions.cancel')}</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete}>{t('common:dialog.delete')}</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </AppLayout>
    );
}
