import { Head, router, useForm } from '@inertiajs/react';
import { Play, RefreshCw } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
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
import { toast } from 'sonner';

interface Period {
    id: number;
    name: string;
}

interface Path {
    id: number;
    name: string;
}

interface Selection {
    id: number;
    rank: number;
    registration_number: string;
    student_name: string;
    final_score: number;
    status: 'pending' | 'passed' | 'failed' | 'reserve';
    path_name: string;
}

interface Props {
    selections: {
        data: Selection[];
        links: any;
        meta: any;
    };
    periods: Period[];
    paths: Path[];
    filters: {
        period_id?: string;
        path_id?: string;
        status?: string;
    };
}

export default function SelectionsIndex({ selections, periods, paths, filters }: Props) {
    const { t } = useTranslation(['admin', 'common']);
    const [periodId, setPeriodId] = useState(filters.period_id || '__all__');
    const [pathId, setPathId] = useState(filters.path_id || '__all__');
    const [status, setStatus] = useState(filters.status || '__all__');
    const [runSelectionDialog, setRunSelectionDialog] = useState(false);
    const [updateStatusDialog, setUpdateStatusDialog] = useState<{
        open: boolean;
        selection: Selection | null;
        newStatus: string;
    }>({ open: false, selection: null, newStatus: '' });

    const runSelectionForm = useForm({});

    const breadcrumbs: BreadcrumbItem[] = [
        { title: t('breadcrumbs.dashboard'), href: '/dashboard' },
        { title: t('breadcrumbs.ppdb'), href: '#' },
        { title: t('ppdb.selections.title'), href: '/admin/ppdb/selections' },
    ];

    const handleFilter = () => {
        router.get('/admin/ppdb/selections', {
            period_id: periodId === '__all__' ? undefined : periodId,
            path_id: pathId === '__all__' ? undefined : pathId,
            status: status === '__all__' ? undefined : status,
        }, { preserveState: true });
    };

    const handleRunSelection = () => {
        runSelectionForm.post('/admin/ppdb/selections/run', {
            onSuccess: () => {
                toast.success(t('ppdb.selections.run_success'));
                setRunSelectionDialog(false);
            },
            onError: () => {
                toast.error(t('ppdb.selections.run_error'));
            },
        });
    };

    const handleUpdateStatus = () => {
        if (!updateStatusDialog.selection) return;

        router.patch(`/admin/ppdb/selections/${updateStatusDialog.selection.id}/status`, {
            status: updateStatusDialog.newStatus,
        }, {
            onSuccess: () => {
                toast.success(t('ppdb.selections.status_updated'));
                setUpdateStatusDialog({ open: false, selection: null, newStatus: '' });
            },
            onError: () => {
                toast.error(t('ppdb.selections.status_update_error'));
            },
        });
    };

    const getStatusBadge = (status: string) => {
        const variants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
            pending: 'secondary',
            passed: 'default',
            failed: 'destructive',
            reserve: 'outline',
        };
        const statusLabels: Record<string, string> = {
            pending: t('ppdb.selections.status.pending'),
            passed: t('ppdb.selections.status.passed'),
            failed: t('ppdb.selections.status.failed'),
            reserve: t('ppdb.selections.status.reserve'),
        };
        return <Badge variant={variants[status] || 'secondary'}>{statusLabels[status] || status}</Badge>;
    };

    const openUpdateStatusDialog = (selection: Selection, newStatus: string) => {
        setUpdateStatusDialog({ open: true, selection, newStatus });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('ppdb.selections.title')} />

            <div className="flex flex-col gap-4 p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">{t('ppdb.selections.title')}</h1>
                    <Button onClick={() => setRunSelectionDialog(true)}>
                        <Play className="mr-2 h-4 w-4" />
                        {t('ppdb.selections.run_selection')}
                    </Button>
                </div>

                <Card>
                    <CardHeader>
                        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                            <CardTitle>{t('ppdb.selections.all_selections')}</CardTitle>
                            <div className="flex flex-wrap gap-2">
                                <Select value={periodId} onValueChange={setPeriodId}>
                                    <SelectTrigger className="w-40">
                                        <SelectValue placeholder={t('ppdb.selections.period')} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="__all__">{t('ppdb.selections.all_periods')}</SelectItem>
                                        {periods.map((period) => (
                                            <SelectItem key={period.id} value={String(period.id)}>
                                                {period.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <Select value={pathId} onValueChange={setPathId}>
                                    <SelectTrigger className="w-40">
                                        <SelectValue placeholder={t('ppdb.selections.path')} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="__all__">{t('ppdb.selections.all_paths')}</SelectItem>
                                        {paths.map((path) => (
                                            <SelectItem key={path.id} value={String(path.id)}>
                                                {path.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <Select value={status} onValueChange={setStatus}>
                                    <SelectTrigger className="w-32">
                                        <SelectValue placeholder={t('ppdb.selections.status.title')} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="__all__">{t('ppdb.selections.all_status')}</SelectItem>
                                        <SelectItem value="pending">{t('ppdb.selections.status.pending')}</SelectItem>
                                        <SelectItem value="passed">{t('ppdb.selections.status.passed')}</SelectItem>
                                        <SelectItem value="failed">{t('ppdb.selections.status.failed')}</SelectItem>
                                        <SelectItem value="reserve">{t('ppdb.selections.status.reserve')}</SelectItem>
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
                                    <TableHead className="w-16">{t('ppdb.selections.rank')}</TableHead>
                                    <TableHead>{t('ppdb.selections.registration_number')}</TableHead>
                                    <TableHead>{t('ppdb.selections.student_name')}</TableHead>
                                    <TableHead>{t('ppdb.selections.path')}</TableHead>
                                    <TableHead className="text-right">{t('ppdb.selections.final_score')}</TableHead>
                                    <TableHead>{t('ppdb.selections.status.title')}</TableHead>
                                    <TableHead className="text-right">{t('common:table.actions')}</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {selections.data.map((selection) => (
                                    <TableRow key={selection.id}>
                                        <TableCell className="font-medium">{selection.rank}</TableCell>
                                        <TableCell className="font-mono">{selection.registration_number}</TableCell>
                                        <TableCell>{selection.student_name}</TableCell>
                                        <TableCell>{selection.path_name}</TableCell>
                                        <TableCell className="text-right font-mono">
                                            {selection.final_score.toFixed(2)}
                                        </TableCell>
                                        <TableCell>{getStatusBadge(selection.status)}</TableCell>
                                        <TableCell className="text-right">
                                            <Select
                                                value={selection.status}
                                                onValueChange={(value) => openUpdateStatusDialog(selection, value)}
                                            >
                                                <SelectTrigger className="w-28">
                                                    <RefreshCw className="mr-2 h-3 w-3" />
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="pending">{t('ppdb.selections.status.pending')}</SelectItem>
                                                    <SelectItem value="passed">{t('ppdb.selections.status.passed')}</SelectItem>
                                                    <SelectItem value="failed">{t('ppdb.selections.status.failed')}</SelectItem>
                                                    <SelectItem value="reserve">{t('ppdb.selections.status.reserve')}</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {selections.data.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={7} className="py-8 text-center text-muted-foreground">
                                            {t('ppdb.selections.empty_title')}
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>

            <AlertDialog open={runSelectionDialog} onOpenChange={setRunSelectionDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>{t('ppdb.selections.run_selection_title')}</AlertDialogTitle>
                        <AlertDialogDescription>
                            {t('ppdb.selections.run_selection_description')}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>{t('common:dialog.cancel')}</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleRunSelection}
                            disabled={runSelectionForm.processing}
                        >
                            {runSelectionForm.processing ? t('common:actions.processing') : t('ppdb.selections.run_selection')}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <AlertDialog
                open={updateStatusDialog.open}
                onOpenChange={(open) => setUpdateStatusDialog({ open, selection: null, newStatus: '' })}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>{t('ppdb.selections.update_status_title')}</AlertDialogTitle>
                        <AlertDialogDescription>
                            {t('ppdb.selections.update_status_description', {
                                name: updateStatusDialog.selection?.student_name,
                                status: updateStatusDialog.newStatus,
                            })}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>{t('common:dialog.cancel')}</AlertDialogCancel>
                        <AlertDialogAction onClick={handleUpdateStatus}>
                            {t('common:dialog.confirm')}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </AppLayout>
    );
}
