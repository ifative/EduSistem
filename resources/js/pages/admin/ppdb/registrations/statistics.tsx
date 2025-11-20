import { Head, Link, router } from '@inertiajs/react';
import { ArrowLeftIcon, UsersIcon, UserCheckIcon, UserXIcon, ClockIcon } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { index, statistics } from '@/routes/admin/ppdb/registrations';

interface AdmissionPeriod {
    id: number;
    name: string;
}

interface StatusCount {
    status: string;
    count: number;
}

interface GenderCount {
    gender: string;
    count: number;
}

interface PathCount {
    path_id: number;
    path_name: string;
    count: number;
}

interface Statistics {
    total: number;
    by_status: StatusCount[];
    by_gender: GenderCount[];
    by_path: PathCount[];
}

interface Props {
    statistics: Statistics;
    periods: AdmissionPeriod[];
    selected_period_id: number | null;
}

export default function RegistrationsStatistics({ statistics: stats, periods, selected_period_id }: Props) {
    const { t } = useTranslation(['admin', 'common']);
    const [periodId, setPeriodId] = useState(selected_period_id ? String(selected_period_id) : '__all__');

    const breadcrumbs: BreadcrumbItem[] = [
        { title: t('breadcrumbs.dashboard'), href: '/dashboard' },
        { title: t('admin:ppdb.title', 'PPDB'), href: '#' },
        { title: t('admin:ppdb.registrations.title', 'Registrations'), href: '/admin/ppdb/registrations' },
        { title: t('admin:ppdb.registrations.statistics', 'Statistics'), href: '#' },
    ];

    const handlePeriodChange = (value: string) => {
        setPeriodId(value);
        router.get(statistics.url(), {
            period_id: value === '__all__' ? undefined : value,
        }, { preserveState: true });
    };

    const getStatusLabel = (status: string) => {
        const labels: Record<string, string> = {
            draft: t('admin:ppdb.registrations.status.draft', 'Draft'),
            submitted: t('admin:ppdb.registrations.status.submitted', 'Submitted'),
            verified: t('admin:ppdb.registrations.status.verified', 'Verified'),
            revision: t('admin:ppdb.registrations.status.revision', 'Revision'),
            accepted: t('admin:ppdb.registrations.status.accepted', 'Accepted'),
            rejected: t('admin:ppdb.registrations.status.rejected', 'Rejected'),
            enrolled: t('admin:ppdb.registrations.status.enrolled', 'Enrolled'),
            withdrawn: t('admin:ppdb.registrations.status.withdrawn', 'Withdrawn'),
        };
        return labels[status] || status;
    };

    const getStatusColor = (status: string) => {
        const colors: Record<string, string> = {
            draft: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100',
            submitted: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100',
            verified: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100',
            revision: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100',
            accepted: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-100',
            rejected: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100',
            enrolled: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100',
            withdrawn: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400',
        };
        return colors[status] || 'bg-gray-100 text-gray-800';
    };

    const getGenderLabel = (gender: string) => {
        return gender === 'male'
            ? t('admin:ppdb.registrations.male', 'Male')
            : t('admin:ppdb.registrations.female', 'Female');
    };

    const getGenderColor = (gender: string) => {
        return gender === 'male'
            ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100'
            : 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-100';
    };

    // Calculate summary statistics
    const submittedCount = stats.by_status.find(s => s.status === 'submitted')?.count || 0;
    const verifiedCount = stats.by_status.find(s => s.status === 'verified')?.count || 0;
    const acceptedCount = stats.by_status.find(s => s.status === 'accepted')?.count || 0;
    const rejectedCount = stats.by_status.find(s => s.status === 'rejected')?.count || 0;
    const enrolledCount = stats.by_status.find(s => s.status === 'enrolled')?.count || 0;
    const pendingCount = stats.by_status
        .filter(s => ['draft', 'submitted', 'revision'].includes(s.status))
        .reduce((sum, s) => sum + s.count, 0);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('admin:ppdb.registrations.statistics', 'Statistics')} />

            <div className="flex flex-col gap-4 p-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href={index.url()}>
                            <Button variant="ghost" size="icon">
                                <ArrowLeftIcon className="h-4 w-4" />
                            </Button>
                        </Link>
                        <h1 className="text-2xl font-bold">{t('admin:ppdb.registrations.statistics', 'Statistics')}</h1>
                    </div>
                    <Select value={periodId} onValueChange={handlePeriodChange}>
                        <SelectTrigger className="w-48">
                            <SelectValue placeholder={t('admin:ppdb.registrations.select_period', 'Select Period')} />
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
                </div>

                {/* Summary Cards */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                {t('admin:ppdb.registrations.total_registrations', 'Total Registrations')}
                            </CardTitle>
                            <UsersIcon className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.total}</div>
                            <p className="text-xs text-muted-foreground">
                                {t('admin:ppdb.registrations.all_registrations', 'All Registrations')}
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                {t('admin:ppdb.registrations.pending', 'Pending')}
                            </CardTitle>
                            <ClockIcon className="h-4 w-4 text-yellow-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{pendingCount}</div>
                            <p className="text-xs text-muted-foreground">
                                {t('admin:ppdb.registrations.awaiting_review', 'Awaiting review')}
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                {t('admin:ppdb.registrations.accepted', 'Accepted')}
                            </CardTitle>
                            <UserCheckIcon className="h-4 w-4 text-green-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{acceptedCount + enrolledCount}</div>
                            <p className="text-xs text-muted-foreground">
                                {enrolledCount > 0 && `${enrolledCount} ${t('admin:ppdb.registrations.enrolled', 'enrolled')}`}
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                {t('admin:ppdb.registrations.rejected', 'Rejected')}
                            </CardTitle>
                            <UserXIcon className="h-4 w-4 text-red-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{rejectedCount}</div>
                            <p className="text-xs text-muted-foreground">
                                {t('admin:ppdb.registrations.not_accepted', 'Not accepted')}
                            </p>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                    {/* By Status */}
                    <Card>
                        <CardHeader>
                            <CardTitle>{t('admin:ppdb.registrations.by_status', 'By Status')}</CardTitle>
                            <CardDescription>
                                {t('admin:ppdb.registrations.status_breakdown', 'Registration status breakdown')}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {stats.by_status.length > 0 ? (
                                    stats.by_status.map((item) => (
                                        <div key={item.status} className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(item.status)}`}>
                                                    {getStatusLabel(item.status)}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="font-mono font-bold">{item.count}</span>
                                                <span className="text-xs text-muted-foreground">
                                                    ({stats.total > 0 ? ((item.count / stats.total) * 100).toFixed(1) : 0}%)
                                                </span>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-center text-muted-foreground py-4">
                                        {t('admin:ppdb.registrations.no_data', 'No data available')}
                                    </p>
                                )}
                            </div>
                            {stats.by_status.length > 0 && (
                                <div className="mt-4 pt-4 border-t">
                                    <div className="h-4 flex rounded-full overflow-hidden bg-muted">
                                        {stats.by_status.map((item) => {
                                            const percentage = stats.total > 0 ? (item.count / stats.total) * 100 : 0;
                                            if (percentage === 0) return null;
                                            const colorMap: Record<string, string> = {
                                                draft: 'bg-gray-400',
                                                submitted: 'bg-blue-500',
                                                verified: 'bg-green-500',
                                                revision: 'bg-yellow-500',
                                                accepted: 'bg-emerald-500',
                                                rejected: 'bg-red-500',
                                                enrolled: 'bg-purple-500',
                                                withdrawn: 'bg-gray-500',
                                            };
                                            return (
                                                <div
                                                    key={item.status}
                                                    className={`${colorMap[item.status] || 'bg-gray-400'}`}
                                                    style={{ width: `${percentage}%` }}
                                                    title={`${getStatusLabel(item.status)}: ${item.count}`}
                                                />
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* By Gender */}
                    <Card>
                        <CardHeader>
                            <CardTitle>{t('admin:ppdb.registrations.by_gender', 'By Gender')}</CardTitle>
                            <CardDescription>
                                {t('admin:ppdb.registrations.gender_breakdown', 'Registration gender breakdown')}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {stats.by_gender.length > 0 ? (
                                    stats.by_gender.map((item) => (
                                        <div key={item.gender} className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <span className={`px-2 py-1 rounded text-xs font-medium ${getGenderColor(item.gender)}`}>
                                                    {getGenderLabel(item.gender)}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="font-mono font-bold">{item.count}</span>
                                                <span className="text-xs text-muted-foreground">
                                                    ({stats.total > 0 ? ((item.count / stats.total) * 100).toFixed(1) : 0}%)
                                                </span>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-center text-muted-foreground py-4">
                                        {t('admin:ppdb.registrations.no_data', 'No data available')}
                                    </p>
                                )}
                            </div>
                            {stats.by_gender.length > 0 && (
                                <div className="mt-4 pt-4 border-t">
                                    <div className="h-4 flex rounded-full overflow-hidden bg-muted">
                                        {stats.by_gender.map((item) => {
                                            const percentage = stats.total > 0 ? (item.count / stats.total) * 100 : 0;
                                            if (percentage === 0) return null;
                                            return (
                                                <div
                                                    key={item.gender}
                                                    className={item.gender === 'male' ? 'bg-blue-500' : 'bg-pink-500'}
                                                    style={{ width: `${percentage}%` }}
                                                    title={`${getGenderLabel(item.gender)}: ${item.count}`}
                                                />
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* By Path (only show when period is selected) */}
                {stats.by_path.length > 0 && (
                    <Card>
                        <CardHeader>
                            <CardTitle>{t('admin:ppdb.registrations.by_path', 'By Admission Path')}</CardTitle>
                            <CardDescription>
                                {t('admin:ppdb.registrations.path_breakdown', 'Registration path breakdown')}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                {stats.by_path.map((item) => (
                                    <div
                                        key={item.path_id}
                                        className="flex items-center justify-between p-4 rounded-lg border bg-card"
                                    >
                                        <div>
                                            <p className="font-medium">{item.path_name}</p>
                                            <p className="text-xs text-muted-foreground">
                                                {stats.total > 0 ? ((item.count / stats.total) * 100).toFixed(1) : 0}% {t('admin:ppdb.registrations.of_total', 'of total')}
                                            </p>
                                        </div>
                                        <div className="text-2xl font-bold font-mono">{item.count}</div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Empty state for by_path when no period selected */}
                {stats.by_path.length === 0 && periodId === '__all__' && (
                    <Card>
                        <CardHeader>
                            <CardTitle>{t('admin:ppdb.registrations.by_path', 'By Admission Path')}</CardTitle>
                            <CardDescription>
                                {t('admin:ppdb.registrations.select_period_for_path', 'Select a period to see path breakdown')}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-center text-muted-foreground py-8">
                                {t('admin:ppdb.registrations.select_period_message', 'Please select an admission period to view statistics by path.')}
                            </p>
                        </CardContent>
                    </Card>
                )}
            </div>
        </AppLayout>
    );
}
