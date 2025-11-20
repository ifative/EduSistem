import { Head, router, useForm } from '@inertiajs/react';
import { FileCheck, FileX, ExternalLink, CheckSquare } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
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
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { toast } from 'sonner';

interface Document {
    id: number;
    registration_number: string;
    student_name: string;
    document_name: string;
    file_url: string;
    status: 'pending' | 'approved' | 'rejected';
    notes: string | null;
}

interface Props {
    documents: {
        data: Document[];
        links: any;
        meta: any;
    };
    filters: {
        status?: string;
    };
}

export default function DocumentsIndex({ documents, filters }: Props) {
    const { t } = useTranslation(['admin', 'common']);
    const [status, setStatus] = useState(filters.status || '__all__');
    const [selectedIds, setSelectedIds] = useState<number[]>([]);
    const [actionDialog, setActionDialog] = useState<{
        open: boolean;
        action: 'approve' | 'reject' | 'bulk_approve' | 'bulk_reject';
        document: Document | null;
    }>({ open: false, action: 'approve', document: null });
    const [rejectNotes, setRejectNotes] = useState('');

    const actionForm = useForm({
        document_ids: [] as number[],
        status: '',
        notes: '',
    });

    const breadcrumbs: BreadcrumbItem[] = [
        { title: t('breadcrumbs.dashboard'), href: '/dashboard' },
        { title: t('breadcrumbs.ppdb'), href: '#' },
        { title: t('ppdb.documents.title'), href: '/admin/ppdb/documents' },
    ];

    const handleFilter = () => {
        router.get('/admin/ppdb/documents', {
            status: status === '__all__' ? undefined : status,
        }, { preserveState: true });
    };

    const handleSelectAll = (checked: boolean) => {
        if (checked) {
            setSelectedIds(documents.data.map((doc) => doc.id));
        } else {
            setSelectedIds([]);
        }
    };

    const handleSelectOne = (id: number, checked: boolean) => {
        if (checked) {
            setSelectedIds([...selectedIds, id]);
        } else {
            setSelectedIds(selectedIds.filter((selectedId) => selectedId !== id));
        }
    };

    const openActionDialog = (action: 'approve' | 'reject', document: Document) => {
        setActionDialog({ open: true, action, document });
        setRejectNotes('');
    };

    const openBulkActionDialog = (action: 'bulk_approve' | 'bulk_reject') => {
        if (selectedIds.length === 0) {
            toast.error(t('ppdb.documents.no_selection'));
            return;
        }
        setActionDialog({ open: true, action, document: null });
        setRejectNotes('');
    };

    const handleAction = () => {
        const isBulk = actionDialog.action.startsWith('bulk_');
        const isApprove = actionDialog.action.includes('approve');

        const documentIds = isBulk
            ? selectedIds
            : actionDialog.document ? [actionDialog.document.id] : [];

        actionForm.transform(() => ({
            document_ids: documentIds,
            status: isApprove ? 'approved' : 'rejected',
            notes: isApprove ? '' : rejectNotes,
        })).post('/admin/ppdb/documents/verify', {
            onSuccess: () => {
                toast.success(
                    isApprove
                        ? t('ppdb.documents.approved_success')
                        : t('ppdb.documents.rejected_success')
                );
                setActionDialog({ open: false, action: 'approve', document: null });
                setSelectedIds([]);
                setRejectNotes('');
            },
            onError: () => {
                toast.error(t('ppdb.documents.action_error'));
            },
        });
    };

    const getStatusBadge = (status: string) => {
        const variants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
            pending: 'secondary',
            approved: 'default',
            rejected: 'destructive',
        };
        const statusLabels: Record<string, string> = {
            pending: t('ppdb.documents.status.pending'),
            approved: t('ppdb.documents.status.approved'),
            rejected: t('ppdb.documents.status.rejected'),
        };
        return <Badge variant={variants[status] || 'secondary'}>{statusLabels[status] || status}</Badge>;
    };

    const isAllSelected = documents.data.length > 0 && selectedIds.length === documents.data.length;
    const isSomeSelected = selectedIds.length > 0 && selectedIds.length < documents.data.length;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('ppdb.documents.title')} />

            <div className="flex flex-col gap-4 p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">{t('ppdb.documents.title')}</h1>
                    <div className="flex gap-2">
                        {selectedIds.length > 0 && (
                            <>
                                <Button
                                    variant="outline"
                                    onClick={() => openBulkActionDialog('bulk_approve')}
                                >
                                    <FileCheck className="mr-2 h-4 w-4" />
                                    {t('ppdb.documents.bulk_approve')} ({selectedIds.length})
                                </Button>
                                <Button
                                    variant="outline"
                                    onClick={() => openBulkActionDialog('bulk_reject')}
                                >
                                    <FileX className="mr-2 h-4 w-4" />
                                    {t('ppdb.documents.bulk_reject')} ({selectedIds.length})
                                </Button>
                            </>
                        )}
                    </div>
                </div>

                <Card>
                    <CardHeader>
                        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                            <CardTitle>{t('ppdb.documents.verification_queue')}</CardTitle>
                            <div className="flex flex-wrap gap-2">
                                <Select value={status} onValueChange={setStatus}>
                                    <SelectTrigger className="w-32">
                                        <SelectValue placeholder={t('ppdb.documents.status.title')} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="__all__">{t('ppdb.documents.all_status')}</SelectItem>
                                        <SelectItem value="pending">{t('ppdb.documents.status.pending')}</SelectItem>
                                        <SelectItem value="approved">{t('ppdb.documents.status.approved')}</SelectItem>
                                        <SelectItem value="rejected">{t('ppdb.documents.status.rejected')}</SelectItem>
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
                                    <TableHead className="w-12">
                                        <Checkbox
                                            checked={isAllSelected}
                                            onCheckedChange={handleSelectAll}
                                            aria-label={t('common:table.select_all')}
                                            ref={(ref) => {
                                                if (ref) {
                                                    (ref as HTMLButtonElement).dataset.state = isSomeSelected ? 'indeterminate' : undefined;
                                                }
                                            }}
                                        />
                                    </TableHead>
                                    <TableHead>{t('ppdb.documents.registration_number')}</TableHead>
                                    <TableHead>{t('ppdb.documents.student_name')}</TableHead>
                                    <TableHead>{t('ppdb.documents.document_name')}</TableHead>
                                    <TableHead>{t('ppdb.documents.status.title')}</TableHead>
                                    <TableHead className="text-right">{t('common:table.actions')}</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {documents.data.map((document) => (
                                    <TableRow key={document.id}>
                                        <TableCell>
                                            <Checkbox
                                                checked={selectedIds.includes(document.id)}
                                                onCheckedChange={(checked) =>
                                                    handleSelectOne(document.id, checked as boolean)
                                                }
                                                aria-label={t('common:table.select_row')}
                                            />
                                        </TableCell>
                                        <TableCell className="font-mono">{document.registration_number}</TableCell>
                                        <TableCell className="font-medium">{document.student_name}</TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                {document.document_name}
                                                <a
                                                    href={document.file_url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-primary hover:underline"
                                                >
                                                    <ExternalLink className="h-4 w-4" />
                                                </a>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-col gap-1">
                                                {getStatusBadge(document.status)}
                                                {document.notes && (
                                                    <span className="text-xs text-muted-foreground">
                                                        {document.notes}
                                                    </span>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => openActionDialog('approve', document)}
                                                    disabled={document.status === 'approved'}
                                                    title={t('ppdb.documents.approve')}
                                                >
                                                    <FileCheck className="h-4 w-4 text-green-500" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => openActionDialog('reject', document)}
                                                    disabled={document.status === 'rejected'}
                                                    title={t('ppdb.documents.reject')}
                                                >
                                                    <FileX className="h-4 w-4 text-red-500" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {documents.data.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={6} className="py-8 text-center text-muted-foreground">
                                            {t('ppdb.documents.empty_title')}
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>

            <AlertDialog
                open={actionDialog.open}
                onOpenChange={(open) => {
                    setActionDialog({ open, action: 'approve', document: null });
                    setRejectNotes('');
                }}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            {actionDialog.action.includes('approve')
                                ? t('ppdb.documents.approve_title')
                                : t('ppdb.documents.reject_title')}
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            {actionDialog.action.startsWith('bulk_')
                                ? t('ppdb.documents.bulk_action_description', { count: selectedIds.length })
                                : actionDialog.action === 'approve'
                                  ? t('ppdb.documents.approve_description', {
                                        name: actionDialog.document?.student_name,
                                        document: actionDialog.document?.document_name,
                                    })
                                  : t('ppdb.documents.reject_description', {
                                        name: actionDialog.document?.student_name,
                                        document: actionDialog.document?.document_name,
                                    })}
                        </AlertDialogDescription>
                    </AlertDialogHeader>

                    {actionDialog.action.includes('reject') && (
                        <div className="space-y-2">
                            <Label htmlFor="notes">{t('ppdb.documents.rejection_notes')}</Label>
                            <Textarea
                                id="notes"
                                value={rejectNotes}
                                onChange={(e) => setRejectNotes(e.target.value)}
                                placeholder={t('ppdb.documents.rejection_notes_placeholder')}
                                rows={3}
                            />
                        </div>
                    )}

                    <AlertDialogFooter>
                        <AlertDialogCancel>{t('common:dialog.cancel')}</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleAction}
                            disabled={actionForm.processing}
                            className={
                                actionDialog.action.includes('reject')
                                    ? 'bg-destructive text-destructive-foreground hover:bg-destructive/90'
                                    : ''
                            }
                        >
                            {actionForm.processing
                                ? t('common:actions.processing')
                                : actionDialog.action.includes('approve')
                                  ? t('ppdb.documents.approve')
                                  : t('ppdb.documents.reject')}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </AppLayout>
    );
}
