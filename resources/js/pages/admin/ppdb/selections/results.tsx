import { Head, router, useForm } from '@inertiajs/react';
import { Megaphone, Users, CheckCircle, XCircle, Clock } from 'lucide-react';
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
import { toast } from 'sonner';

interface Period {
    id: number;
    name: string;
}

interface PathResult {
    id: number;
    name: string;
    quota: number;
    total_registrations: number;
    passed: number;
    failed: number;
    reserve: number;
    pending: number;
}

interface Props {
    results: PathResult[];
    periods: Period[];
    selectedPeriod: Period | null;
    filters: {
        period_id?: string;
    };
}

export default function SelectionsResults({ results, periods, selectedPeriod, filters }: Props) {
    const { t } = useTranslation(['admin', 'common']);
    const [periodId, setPeriodId] = useState(filters.period_id || (periods[0]?.id ? String(periods[0].id) : ''));
    const [announceDialog, setAnnounceDialog] = useState(false);

    const announceForm = useForm({
        period_id: periodId,
    });

    const breadcrumbs: BreadcrumbItem[] = [
        { title: t('breadcrumbs.dashboard'), href: '/dashboard' },
        { title: t('breadcrumbs.ppdb'), href: '#' },
        { title: t('ppdb.selections.results'), href: '/admin/ppdb/selections/results' },
    ];

    const handlePeriodChange = (value: string) => {
        setPeriodId(value);
        router.get('/admin/ppdb/selections/results', {
            period_id: value,
        }, { preserveState: true });
    };

    const handleAnnounce = () => {
        announceForm.transform((data) => ({
            ...data,
            period_id: periodId,
        })).post('/admin/ppdb/selections/announce', {
            onSuccess: () => {
                toast.success(t('ppdb.selections.announce_success'));
                setAnnounceDialog(false);
            },
            onError: () => {
                toast.error(t('ppdb.selections.announce_error'));
            },
        });
    };

    const getTotalStats = () => {
        return results.reduce(
            (acc, result) => ({
                total_registrations: acc.total_registrations + result.total_registrations,
                passed: acc.passed + result.passed,
                failed: acc.failed + result.failed,
                reserve: acc.reserve + result.reserve,
                pending: acc.pending + result.pending,
                quota: acc.quota + result.quota,
            }),
            { total_registrations: 0, passed: 0, failed: 0, reserve: 0, pending: 0, quota: 0 }
        );
    };

    const totalStats = getTotalStats();

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('ppdb.selections.results')} />

            <div className="flex flex-col gap-4 p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">{t('ppdb.selections.results')}</h1>
                    <div className="flex gap-2">
                        <Select value={periodId} onValueChange={handlePeriodChange}>
                            <SelectTrigger className="w-48">
                                <SelectValue placeholder={t('ppdb.selections.select_period')} />
                            </SelectTrigger>
                            <SelectContent>
                                {periods.map((period) => (
                                    <SelectItem key={period.id} value={String(period.id)}>
                                        {period.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <Button onClick={() => setAnnounceDialog(true)} disabled={!periodId}>
                            <Megaphone className="mr-2 h-4 w-4" />
                            {t('ppdb.selections.announce_results')}
                        </Button>
                    </div>
                </div>

                {/* Summary Cards */}
                <div className="grid gap-4 md:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                {t('ppdb.selections.total_registrations')}
                            </CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{totalStats.total_registrations}</div>
                            <p className="text-xs text-muted-foreground">
                                {t('ppdb.selections.quota')}: {totalStats.quota}
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                {t('ppdb.selections.status.passed')}
                            </CardTitle>
                            <CheckCircle className="h-4 w-4 text-green-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-green-600">{totalStats.passed}</div>
                            <p className="text-xs text-muted-foreground">
                                {totalStats.total_registrations > 0
                                    ? ((totalStats.passed / totalStats.total_registrations) * 100).toFixed(1)
                                    : 0}%
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                {t('ppdb.selections.status.failed')}
                            </CardTitle>
                            <XCircle className="h-4 w-4 text-red-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-red-600">{totalStats.failed}</div>
                            <p className="text-xs text-muted-foreground">
                                {totalStats.total_registrations > 0
                                    ? ((totalStats.failed / totalStats.total_registrations) * 100).toFixed(1)
                                    : 0}%
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                {t('ppdb.selections.status.pending')}
                            </CardTitle>
                            <Clock className="h-4 w-4 text-yellow-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-yellow-600">{totalStats.pending}</div>
                            <p className="text-xs text-muted-foreground">
                                {t('ppdb.selections.status.reserve')}: {totalStats.reserve}
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Results by Path */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {results.map((result) => (
                        <Card key={result.id}>
                            <CardHeader>
                                <CardTitle>{result.name}</CardTitle>
                                <CardDescription>
                                    {t('ppdb.selections.quota')}: {result.quota} | {t('ppdb.selections.total_registrations')}: {result.total_registrations}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <CheckCircle className="h-4 w-4 text-green-500" />
                                            <span className="text-sm">{t('ppdb.selections.status.passed')}</span>
                                        </div>
                                        <span className="font-medium text-green-600">{result.passed}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <XCircle className="h-4 w-4 text-red-500" />
                                            <span className="text-sm">{t('ppdb.selections.status.failed')}</span>
                                        </div>
                                        <span className="font-medium text-red-600">{result.failed}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <Clock className="h-4 w-4 text-yellow-500" />
                                            <span className="text-sm">{t('ppdb.selections.status.reserve')}</span>
                                        </div>
                                        <span className="font-medium text-yellow-600">{result.reserve}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <Clock className="h-4 w-4 text-muted-foreground" />
                                            <span className="text-sm">{t('ppdb.selections.status.pending')}</span>
                                        </div>
                                        <span className="font-medium">{result.pending}</span>
                                    </div>

                                    {/* Progress bar */}
                                    <div className="mt-4">
                                        <div className="mb-1 flex justify-between text-xs">
                                            <span>{t('ppdb.selections.fill_rate')}</span>
                                            <span>
                                                {result.quota > 0
                                                    ? ((result.passed / result.quota) * 100).toFixed(0)
                                                    : 0}%
                                            </span>
                                        </div>
                                        <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
                                            <div
                                                className="h-full bg-primary transition-all"
                                                style={{
                                                    width: `${result.quota > 0 ? Math.min((result.passed / result.quota) * 100, 100) : 0}%`,
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {results.length === 0 && (
                    <Card>
                        <CardContent className="py-8 text-center text-muted-foreground">
                            {t('ppdb.selections.no_results')}
                        </CardContent>
                    </Card>
                )}
            </div>

            <AlertDialog open={announceDialog} onOpenChange={setAnnounceDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>{t('ppdb.selections.announce_title')}</AlertDialogTitle>
                        <AlertDialogDescription>
                            {t('ppdb.selections.announce_description', {
                                period: selectedPeriod?.name || '',
                            })}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>{t('common:dialog.cancel')}</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleAnnounce}
                            disabled={announceForm.processing}
                        >
                            {announceForm.processing ? t('common:actions.processing') : t('ppdb.selections.announce_results')}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </AppLayout>
    );
}
