import { Head, Link, router } from '@inertiajs/react';
import { EyeIcon, DownloadIcon, BarChart3Icon } from 'lucide-react';
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
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type PaginatedData } from '@/types';
import { index, show, exportMethod, statistics } from '@/routes/admin/ppdb/registrations';

interface AdmissionPeriod {
    id: number;
    name: string;
}

interface AdmissionPath {
    id: number;
    name: string;
    code: string;
}

interface Registration {
    id: number;
    registration_number: string;
    name: string;
    nisn: string;
    gender: string;
    phone: string;
    email: string;
    status: string;
    submitted_at: string | null;
    period: AdmissionPeriod | null;
    path: AdmissionPath | null;
}

interface Props {
    registrations: PaginatedData<Registration>;
    periods: AdmissionPeriod[];
    paths: AdmissionPath[];
    filters: {
        search?: string;
        period_id?: string;
        path_id?: string;
        status?: string;
    };
}

export default function RegistrationsIndex({ registrations, periods, paths, filters }: Props) {
    const { t } = useTranslation(['admin', 'common']);
    const [search, setSearch] = useState(filters.search || '');
    const [periodId, setPeriodId] = useState(filters.period_id || '__all__');
    const [pathId, setPathId] = useState(filters.path_id || '__all__');
    const [status, setStatus] = useState(filters.status || '__all__');

    const breadcrumbs: BreadcrumbItem[] = [
        { title: t('breadcrumbs.dashboard'), href: '/dashboard' },
        { title: t('admin:ppdb.title', 'PPDB'), href: '#' },
        { title: t('admin:ppdb.registrations.title', 'Registrations'), href: '/admin/ppdb/registrations' },
    ];

    const handleFilter = () => {
        router.get(index.url(), {
            search: search || undefined,
            period_id: periodId === '__all__' ? undefined : periodId,
            path_id: pathId === '__all__' ? undefined : pathId,
            status: status === '__all__' ? undefined : status,
        }, { preserveState: true });
    };

    const handleExport = () => {
        window.location.href = exportMethod.url({
            query: {
                search: search || '',
                period_id: periodId === '__all__' ? '' : periodId,
                path_id: pathId === '__all__' ? '' : pathId,
                status: status === '__all__' ? '' : status,
            }
        });
    };

    const getStatusBadge = (status: string) => {
        const variants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
            draft: 'outline',
            submitted: 'secondary',
            verified: 'default',
            revision: 'destructive',
            accepted: 'default',
            rejected: 'destructive',
            enrolled: 'default',
            withdrawn: 'outline',
        };
        const statusLabels: Record<string, string> = {
            draft: t('admin:ppdb.registrations.status.draft', 'Draft'),
            submitted: t('admin:ppdb.registrations.status.submitted', 'Submitted'),
            verified: t('admin:ppdb.registrations.status.verified', 'Verified'),
            revision: t('admin:ppdb.registrations.status.revision', 'Revision'),
            accepted: t('admin:ppdb.registrations.status.accepted', 'Accepted'),
            rejected: t('admin:ppdb.registrations.status.rejected', 'Rejected'),
            enrolled: t('admin:ppdb.registrations.status.enrolled', 'Enrolled'),
            withdrawn: t('admin:ppdb.registrations.status.withdrawn', 'Withdrawn'),
        };
        return <Badge variant={variants[status] || 'secondary'}>{statusLabels[status] || status}</Badge>;
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('admin:ppdb.registrations.title', 'Registrations')} />

            <div className="flex flex-col gap-4 p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">{t('admin:ppdb.registrations.title', 'Registrations')}</h1>
                    <div className="flex gap-2">
                        <Link href={statistics.url()}>
                            <Button variant="outline">
                                <BarChart3Icon className="mr-2 h-4 w-4" />
                                {t('admin:ppdb.registrations.statistics', 'Statistics')}
                            </Button>
                        </Link>
                        <Button variant="outline" onClick={handleExport}>
                            <DownloadIcon className="mr-2 h-4 w-4" />
                            {t('common:export.export')}
                        </Button>
                    </div>
                </div>

                <Card>
                    <CardHeader>
                        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                            <CardTitle>{t('admin:ppdb.registrations.all_registrations', 'All Registrations')}</CardTitle>
                            <div className="flex flex-wrap gap-2">
                                <Input
                                    placeholder={t('admin:ppdb.registrations.search_placeholder', 'Search name, NISN, registration number...')}
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="w-56"
                                />
                                <Select value={periodId} onValueChange={setPeriodId}>
                                    <SelectTrigger className="w-40">
                                        <SelectValue placeholder={t('admin:ppdb.registrations.period', 'Period')} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="__all__">{t('admin:ppdb.registrations.all_periods', 'All Periods')}</SelectItem>
                                        {periods.map((period) => (
                                            <SelectItem key={period.id} value={String(period.id)}>
                                                {period.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <Select value={pathId} onValueChange={setPathId}>
                                    <SelectTrigger className="w-40">
                                        <SelectValue placeholder={t('admin:ppdb.registrations.path', 'Path')} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="__all__">{t('admin:ppdb.registrations.all_paths', 'All Paths')}</SelectItem>
                                        {paths.map((path) => (
                                            <SelectItem key={path.id} value={String(path.id)}>
                                                {path.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <Select value={status} onValueChange={setStatus}>
                                    <SelectTrigger className="w-32">
                                        <SelectValue placeholder={t('admin:ppdb.registrations.status_filter', 'Status')} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="__all__">{t('admin:ppdb.registrations.all_status', 'All Status')}</SelectItem>
                                        <SelectItem value="draft">{t('admin:ppdb.registrations.status.draft', 'Draft')}</SelectItem>
                                        <SelectItem value="submitted">{t('admin:ppdb.registrations.status.submitted', 'Submitted')}</SelectItem>
                                        <SelectItem value="verified">{t('admin:ppdb.registrations.status.verified', 'Verified')}</SelectItem>
                                        <SelectItem value="revision">{t('admin:ppdb.registrations.status.revision', 'Revision')}</SelectItem>
                                        <SelectItem value="accepted">{t('admin:ppdb.registrations.status.accepted', 'Accepted')}</SelectItem>
                                        <SelectItem value="rejected">{t('admin:ppdb.registrations.status.rejected', 'Rejected')}</SelectItem>
                                        <SelectItem value="enrolled">{t('admin:ppdb.registrations.status.enrolled', 'Enrolled')}</SelectItem>
                                        <SelectItem value="withdrawn">{t('admin:ppdb.registrations.status.withdrawn', 'Withdrawn')}</SelectItem>
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
                                    <TableHead>{t('admin:ppdb.registrations.registration_number', 'Reg. Number')}</TableHead>
                                    <TableHead>{t('admin:ppdb.registrations.name', 'Name')}</TableHead>
                                    <TableHead>{t('admin:ppdb.registrations.nisn', 'NISN')}</TableHead>
                                    <TableHead>{t('admin:ppdb.registrations.period', 'Period')}</TableHead>
                                    <TableHead>{t('admin:ppdb.registrations.path', 'Path')}</TableHead>
                                    <TableHead>{t('admin:ppdb.registrations.status_column', 'Status')}</TableHead>
                                    <TableHead>{t('admin:ppdb.registrations.submitted_at', 'Submitted')}</TableHead>
                                    <TableHead className="text-right">{t('common:table.actions')}</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {registrations.data.map((registration) => (
                                    <TableRow key={registration.id}>
                                        <TableCell className="font-mono">{registration.registration_number}</TableCell>
                                        <TableCell className="font-medium">{registration.name}</TableCell>
                                        <TableCell className="font-mono">{registration.nisn}</TableCell>
                                        <TableCell>{registration.period?.name || '-'}</TableCell>
                                        <TableCell>{registration.path?.name || '-'}</TableCell>
                                        <TableCell>{getStatusBadge(registration.status)}</TableCell>
                                        <TableCell>
                                            {registration.submitted_at
                                                ? new Date(registration.submitted_at).toLocaleDateString()
                                                : '-'}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Link href={show.url(registration.id)}>
                                                    <Button variant="ghost" size="icon">
                                                        <EyeIcon className="h-4 w-4" />
                                                    </Button>
                                                </Link>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {registrations.data.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                                            {t('admin:ppdb.registrations.empty_title', 'No registrations found')}
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
