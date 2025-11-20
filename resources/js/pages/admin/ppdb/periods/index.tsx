import { Head, Link, router } from '@inertiajs/react';
import { PlusIcon, PencilIcon, TrashIcon, CheckCircleIcon, XCircleIcon } from 'lucide-react';
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

interface AcademicYear {
    id: number;
    name: string;
}

interface AdmissionPeriod {
    id: number;
    name: string;
    description: string | null;
    registration_start: string;
    registration_end: string;
    selection_date: string;
    announcement_date: string;
    enrollment_start: string;
    enrollment_end: string;
    quota: number;
    status: 'draft' | 'open' | 'closed' | 'selection' | 'announced' | 'enrollment' | 'completed';
    is_active: boolean;
    academic_year: AcademicYear;
}

interface Props {
    periods: {
        data: AdmissionPeriod[];
        links: any;
        meta: any;
    };
    filters: {
        search?: string;
        status?: string;
    };
}

export default function PeriodsIndex({ periods, filters }: Props) {
    const { t } = useTranslation(['admin', 'common']);
    const [search, setSearch] = useState(filters.search || '');
    const [status, setStatus] = useState(filters.status || '__all__');
    const [deleteId, setDeleteId] = useState<number | null>(null);

    const breadcrumbs: BreadcrumbItem[] = [
        { title: t('breadcrumbs.dashboard'), href: '/dashboard' },
        { title: t('breadcrumbs.ppdb'), href: '#' },
        { title: t('breadcrumbs.periods'), href: '/admin/ppdb/periods' },
    ];

    const handleFilter = () => {
        router.get(
            '/admin/ppdb/periods',
            {
                search: search || undefined,
                status: status === '__all__' ? undefined : status,
            },
            { preserveState: true }
        );
    };

    const handleDelete = () => {
        if (deleteId) {
            router.delete(`/admin/ppdb/periods/${deleteId}`);
            setDeleteId(null);
        }
    };

    const handleToggleActive = (id: number) => {
        router.post(`/admin/ppdb/periods/${id}/toggle-active`);
    };

    const getStatusBadgeVariant = (status: string) => {
        switch (status) {
            case 'open':
                return 'default';
            case 'closed':
                return 'secondary';
            case 'selection':
                return 'outline';
            case 'announced':
                return 'default';
            case 'enrollment':
                return 'default';
            case 'completed':
                return 'secondary';
            default:
                return 'secondary';
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('admin:ppdb.periods.title')} />

            <div className="flex flex-col gap-4 p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">{t('admin:ppdb.periods.title')}</h1>
                    <Link href="/admin/ppdb/periods/create">
                        <Button>
                            <PlusIcon className="mr-2 h-4 w-4" />
                            {t('admin:ppdb.periods.add')}
                        </Button>
                    </Link>
                </div>

                <Card>
                    <CardHeader>
                        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                            <CardTitle>{t('admin:ppdb.periods.all_periods')}</CardTitle>
                            <div className="flex flex-wrap gap-2">
                                <Input
                                    placeholder={t('admin:ppdb.periods.search_placeholder')}
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="w-48"
                                />
                                <Select value={status} onValueChange={setStatus}>
                                    <SelectTrigger className="w-40">
                                        <SelectValue placeholder={t('admin:ppdb.periods.status')} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="__all__">{t('admin:ppdb.periods.all_statuses')}</SelectItem>
                                        <SelectItem value="draft">{t('admin:ppdb.periods.status_draft')}</SelectItem>
                                        <SelectItem value="open">{t('admin:ppdb.periods.status_open')}</SelectItem>
                                        <SelectItem value="closed">{t('admin:ppdb.periods.status_closed')}</SelectItem>
                                        <SelectItem value="selection">{t('admin:ppdb.periods.status_selection')}</SelectItem>
                                        <SelectItem value="announced">{t('admin:ppdb.periods.status_announced')}</SelectItem>
                                        <SelectItem value="enrollment">{t('admin:ppdb.periods.status_enrollment')}</SelectItem>
                                        <SelectItem value="completed">{t('admin:ppdb.periods.status_completed')}</SelectItem>
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
                                    <TableHead>{t('admin:ppdb.periods.name')}</TableHead>
                                    <TableHead>{t('admin:ppdb.periods.academic_year')}</TableHead>
                                    <TableHead>{t('admin:ppdb.periods.registration_period')}</TableHead>
                                    <TableHead>{t('admin:ppdb.periods.quota')}</TableHead>
                                    <TableHead>{t('admin:ppdb.periods.status')}</TableHead>
                                    <TableHead>{t('admin:ppdb.periods.active')}</TableHead>
                                    <TableHead className="text-right">{t('common:table.actions')}</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {periods.data.map((period) => (
                                    <TableRow key={period.id}>
                                        <TableCell className="font-medium">{period.name}</TableCell>
                                        <TableCell>{period.academic_year?.name}</TableCell>
                                        <TableCell>
                                            {new Date(period.registration_start).toLocaleDateString()} -{' '}
                                            {new Date(period.registration_end).toLocaleDateString()}
                                        </TableCell>
                                        <TableCell>{period.quota}</TableCell>
                                        <TableCell>
                                            <Badge variant={getStatusBadgeVariant(period.status)}>
                                                {t(`admin:ppdb.periods.status_${period.status}`)}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            {period.is_active ? (
                                                <Badge variant="default">{t('admin:ppdb.periods.active_yes')}</Badge>
                                            ) : (
                                                <Badge variant="secondary">{t('admin:ppdb.periods.active_no')}</Badge>
                                            )}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => handleToggleActive(period.id)}
                                                    title={period.is_active ? t('admin:ppdb.periods.deactivate') : t('admin:ppdb.periods.activate')}
                                                >
                                                    {period.is_active ? (
                                                        <XCircleIcon className="h-4 w-4" />
                                                    ) : (
                                                        <CheckCircleIcon className="h-4 w-4" />
                                                    )}
                                                </Button>
                                                <Link href={`/admin/ppdb/periods/${period.id}/edit`}>
                                                    <Button variant="ghost" size="icon">
                                                        <PencilIcon className="h-4 w-4" />
                                                    </Button>
                                                </Link>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => setDeleteId(period.id)}
                                                >
                                                    <TrashIcon className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {periods.data.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                                            {t('admin:ppdb.periods.empty_title')}
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
                        <AlertDialogTitle>{t('admin:ppdb.periods.delete_title')}</AlertDialogTitle>
                        <AlertDialogDescription>
                            {t('admin:ppdb.periods.delete_description')}
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
