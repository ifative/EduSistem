import { Head, Link, router } from '@inertiajs/react';
import { PlusIcon, PencilIcon, TrashIcon } from 'lucide-react';
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
import { index, create, edit, destroy } from '@/routes/admin/ppdb/paths';

interface AdmissionPeriod {
    id: number;
    name: string;
}

interface AdmissionPath {
    id: number;
    name: string;
    code: string;
    description: string | null;
    type: 'zonasi' | 'prestasi' | 'afirmasi' | 'perpindahan' | 'reguler';
    quota: number;
    min_score: number | null;
    max_distance: number | null;
    requires_test: boolean;
    requires_documents: boolean;
    sort_order: number;
    is_active: boolean;
    admission_period: AdmissionPeriod;
}

interface Props {
    paths: {
        data: AdmissionPath[];
        links: { url: string | null; label: string; active: boolean }[];
        current_page: number;
        last_page: number;
    };
    periods: AdmissionPeriod[];
    filters: {
        search?: string;
        period_id?: string;
        type?: string;
    };
}

const pathTypes = ['zonasi', 'prestasi', 'afirmasi', 'perpindahan', 'reguler'] as const;

export default function PathsIndex({ paths, periods, filters }: Props) {
    const { t } = useTranslation(['admin', 'common']);
    const [search, setSearch] = useState(filters.search || '');
    const [periodId, setPeriodId] = useState(filters.period_id || '__all__');
    const [type, setType] = useState(filters.type || '__all__');
    const [deleteId, setDeleteId] = useState<number | null>(null);

    const breadcrumbs: BreadcrumbItem[] = [
        { title: t('breadcrumbs.dashboard'), href: '/dashboard' },
        { title: t('breadcrumbs.ppdb'), href: '#' },
        { title: t('admin:ppdb.paths.title'), href: index.url() },
    ];

    const handleFilter = () =>
        router.get(
            index.url(),
            {
                search: search || undefined,
                period_id: periodId === '__all__' ? undefined : periodId,
                type: type === '__all__' ? undefined : type,
            },
            { preserveState: true }
        );

    const handleDelete = () => {
        if (deleteId) {
            router.delete(destroy.url(deleteId));
            setDeleteId(null);
        }
    };

    const getTypeBadgeVariant = (pathType: string) => {
        switch (pathType) {
            case 'zonasi':
                return 'default';
            case 'prestasi':
                return 'secondary';
            case 'afirmasi':
                return 'outline';
            case 'perpindahan':
                return 'destructive';
            case 'reguler':
                return 'default';
            default:
                return 'outline';
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('admin:ppdb.paths.title')} />
            <div className="flex flex-col gap-4 p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">{t('admin:ppdb.paths.title')}</h1>
                    <Link href={create.url()}>
                        <Button>
                            <PlusIcon className="mr-2 h-4 w-4" />
                            {t('admin:ppdb.paths.add')}
                        </Button>
                    </Link>
                </div>
                <Card>
                    <CardHeader>
                        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                            <CardTitle>{t('admin:ppdb.paths.all_paths')}</CardTitle>
                            <div className="flex flex-wrap gap-2">
                                <Input
                                    placeholder={t('admin:ppdb.paths.search_placeholder')}
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="w-40"
                                />
                                <Select value={periodId} onValueChange={setPeriodId}>
                                    <SelectTrigger className="w-40">
                                        <SelectValue placeholder={t('admin:ppdb.paths.period')} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="__all__">{t('admin:ppdb.paths.all_periods')}</SelectItem>
                                        {periods.map((p) => (
                                            <SelectItem key={p.id} value={String(p.id)}>
                                                {p.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <Select value={type} onValueChange={setType}>
                                    <SelectTrigger className="w-32">
                                        <SelectValue placeholder={t('admin:ppdb.paths.type')} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="__all__">{t('admin:ppdb.paths.all_types')}</SelectItem>
                                        {pathTypes.map((pt) => (
                                            <SelectItem key={pt} value={pt}>
                                                {t(`admin:ppdb.paths.types.${pt}`)}
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
                                    <TableHead>{t('admin:ppdb.paths.code')}</TableHead>
                                    <TableHead>{t('admin:ppdb.paths.name')}</TableHead>
                                    <TableHead>{t('admin:ppdb.paths.period')}</TableHead>
                                    <TableHead>{t('admin:ppdb.paths.type')}</TableHead>
                                    <TableHead>{t('admin:ppdb.paths.quota')}</TableHead>
                                    <TableHead>{t('admin:ppdb.paths.status')}</TableHead>
                                    <TableHead className="text-right">{t('common:table.actions')}</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {paths.data.map((path) => (
                                    <TableRow key={path.id}>
                                        <TableCell className="font-mono">{path.code}</TableCell>
                                        <TableCell className="font-medium">{path.name}</TableCell>
                                        <TableCell>{path.admission_period?.name || '-'}</TableCell>
                                        <TableCell>
                                            <Badge variant={getTypeBadgeVariant(path.type)}>
                                                {t(`admin:ppdb.paths.types.${path.type}`)}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>{path.quota}</TableCell>
                                        <TableCell>
                                            <Badge variant={path.is_active ? 'default' : 'secondary'}>
                                                {path.is_active ? t('admin:ppdb.paths.active') : t('admin:ppdb.paths.inactive')}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Link href={edit.url(path.id)}>
                                                    <Button variant="ghost" size="icon">
                                                        <PencilIcon className="h-4 w-4" />
                                                    </Button>
                                                </Link>
                                                <Button variant="ghost" size="icon" onClick={() => setDeleteId(path.id)}>
                                                    <TrashIcon className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {paths.data.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={7} className="py-8 text-center text-muted-foreground">
                                            {t('admin:ppdb.paths.empty_title')}
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
                        <AlertDialogTitle>{t('admin:ppdb.paths.delete_title')}</AlertDialogTitle>
                        <AlertDialogDescription>{t('admin:ppdb.paths.delete_description')}</AlertDialogDescription>
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
