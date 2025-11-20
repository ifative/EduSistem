import { Head, Link, router } from '@inertiajs/react';
import { ArrowLeftIcon, CheckCircleIcon, XCircleIcon, ClockIcon, FileIcon, DownloadIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { index, updateStatus } from '@/routes/admin/ppdb/registrations';

interface AdmissionPeriod {
    id: number;
    name: string;
}

interface AdmissionPath {
    id: number;
    name: string;
    code: string;
}

interface Level {
    id: number;
    name: string;
}

interface Major {
    id: number;
    name: string;
}

interface Requirement {
    id: number;
    name: string;
}

interface Document {
    id: number;
    requirement: Requirement | null;
    file_name: string;
    file_path: string;
    file_type: string;
    file_size: number;
    status: string;
    rejection_reason: string | null;
    verified_at: string | null;
}

interface Score {
    id: number;
    subject: string;
    score: number;
    type: string;
    semester: string;
}

interface Achievement {
    id: number;
    name: string;
    type: string;
    level: string;
    rank: string;
    year: number;
    organizer: string;
    points: number;
}

interface Selection {
    id: number;
    final_score: number;
    rank: number;
    status: string;
    score_breakdown: Record<string, number> | null;
    notes: string | null;
}

interface Payment {
    id: number;
    payment_code: string;
    type: string;
    amount: number;
    status: string;
    payment_method: string | null;
    paid_at: string | null;
}

interface Registration {
    id: number;
    registration_number: string;
    name: string;
    nisn: string;
    nik: string;
    gender: string;
    birth_place: string;
    birth_date: string;
    religion: string;
    address: string;
    village: string;
    district: string;
    city: string;
    province: string;
    postal_code: string;
    phone: string;
    email: string;
    previous_school: string;
    previous_school_address: string;
    graduation_year: number;
    father_name: string;
    father_occupation: string;
    father_phone: string;
    mother_name: string;
    mother_occupation: string;
    mother_phone: string;
    guardian_name: string | null;
    guardian_phone: string | null;
    distance: number | null;
    status: string;
    notes: string | null;
    submitted_at: string | null;
    verified_at: string | null;
    period: AdmissionPeriod | null;
    path: AdmissionPath | null;
    level: Level | null;
    major: Major | null;
    documents: Document[];
    scores: Score[];
    achievements: Achievement[];
    selection: Selection | null;
    payments: Payment[];
}

interface Props {
    registration: Registration;
}

export default function RegistrationsShow({ registration }: Props) {
    const { t } = useTranslation(['admin', 'common']);

    const breadcrumbs: BreadcrumbItem[] = [
        { title: t('breadcrumbs.dashboard'), href: '/dashboard' },
        { title: t('admin:ppdb.title', 'PPDB'), href: '#' },
        { title: t('admin:ppdb.registrations.title', 'Registrations'), href: '/admin/ppdb/registrations' },
        { title: t('breadcrumbs.detail'), href: '#' },
    ];

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

    const getDocumentStatusIcon = (status: string) => {
        switch (status) {
            case 'approved':
                return <CheckCircleIcon className="h-4 w-4 text-green-500" />;
            case 'rejected':
                return <XCircleIcon className="h-4 w-4 text-red-500" />;
            default:
                return <ClockIcon className="h-4 w-4 text-yellow-500" />;
        }
    };

    const getPaymentStatusBadge = (status: string) => {
        const variants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
            pending: 'outline',
            paid: 'default',
            failed: 'destructive',
            expired: 'secondary',
        };
        return <Badge variant={variants[status] || 'secondary'}>{status}</Badge>;
    };

    const getSelectionStatusBadge = (status: string) => {
        const variants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
            passed: 'default',
            failed: 'destructive',
            reserve: 'secondary',
        };
        const statusLabels: Record<string, string> = {
            passed: t('admin:ppdb.registrations.selection.passed', 'Passed'),
            failed: t('admin:ppdb.registrations.selection.failed', 'Failed'),
            reserve: t('admin:ppdb.registrations.selection.reserve', 'Reserve'),
        };
        return <Badge variant={variants[status] || 'secondary'}>{statusLabels[status] || status}</Badge>;
    };

    const handleStatusChange = (newStatus: string) => {
        router.put(updateStatus.url(registration.id), {
            status: newStatus,
        });
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(amount);
    };

    const formatFileSize = (bytes: number) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`${t('admin:ppdb.registrations.detail', 'Registration Detail')}: ${registration.name}`} />

            <div className="flex flex-col gap-4 p-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href={index.url()}>
                            <Button variant="ghost" size="icon">
                                <ArrowLeftIcon className="h-4 w-4" />
                            </Button>
                        </Link>
                        <div>
                            <h1 className="text-2xl font-bold">{registration.name}</h1>
                            <p className="text-sm text-muted-foreground font-mono">{registration.registration_number}</p>
                        </div>
                        {getStatusBadge(registration.status)}
                    </div>
                    <div className="flex items-center gap-2">
                        <Select value={registration.status} onValueChange={handleStatusChange}>
                            <SelectTrigger className="w-40">
                                <SelectValue placeholder={t('admin:ppdb.registrations.change_status', 'Change Status')} />
                            </SelectTrigger>
                            <SelectContent>
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
                    </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                    {/* Personal Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle>{t('admin:ppdb.registrations.personal_info', 'Personal Information')}</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-muted-foreground">{t('admin:ppdb.registrations.nisn', 'NISN')}</p>
                                    <p className="font-mono">{registration.nisn}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">{t('admin:ppdb.registrations.nik', 'NIK')}</p>
                                    <p className="font-mono">{registration.nik}</p>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-muted-foreground">{t('admin:ppdb.registrations.gender', 'Gender')}</p>
                                    <p className="capitalize">{registration.gender}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">{t('admin:ppdb.registrations.religion', 'Religion')}</p>
                                    <p>{registration.religion || '-'}</p>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-muted-foreground">{t('admin:ppdb.registrations.birth_place', 'Birth Place')}</p>
                                    <p>{registration.birth_place}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">{t('admin:ppdb.registrations.birth_date', 'Birth Date')}</p>
                                    <p>{new Date(registration.birth_date).toLocaleDateString()}</p>
                                </div>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">{t('admin:ppdb.registrations.address', 'Address')}</p>
                                <p>{registration.address}</p>
                                <p className="text-sm text-muted-foreground">
                                    {[registration.village, registration.district, registration.city, registration.province, registration.postal_code]
                                        .filter(Boolean)
                                        .join(', ')}
                                </p>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-muted-foreground">{t('admin:ppdb.registrations.phone', 'Phone')}</p>
                                    <p>{registration.phone || '-'}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">{t('admin:ppdb.registrations.email', 'Email')}</p>
                                    <p>{registration.email || '-'}</p>
                                </div>
                            </div>
                            {registration.distance && (
                                <div>
                                    <p className="text-sm text-muted-foreground">{t('admin:ppdb.registrations.distance', 'Distance from School')}</p>
                                    <p>{registration.distance} km</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Admission Info */}
                    <Card>
                        <CardHeader>
                            <CardTitle>{t('admin:ppdb.registrations.admission_info', 'Admission Information')}</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <p className="text-sm text-muted-foreground">{t('admin:ppdb.registrations.period', 'Period')}</p>
                                <p>{registration.period?.name || '-'}</p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">{t('admin:ppdb.registrations.path', 'Path')}</p>
                                <p>{registration.path?.name || '-'}</p>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-muted-foreground">{t('admin:ppdb.registrations.level', 'Level')}</p>
                                    <p>{registration.level?.name || '-'}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">{t('admin:ppdb.registrations.major', 'Major')}</p>
                                    <p>{registration.major?.name || '-'}</p>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-muted-foreground">{t('admin:ppdb.registrations.submitted_at', 'Submitted')}</p>
                                    <p>{registration.submitted_at ? new Date(registration.submitted_at).toLocaleString() : '-'}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">{t('admin:ppdb.registrations.verified_at', 'Verified')}</p>
                                    <p>{registration.verified_at ? new Date(registration.verified_at).toLocaleString() : '-'}</p>
                                </div>
                            </div>
                            {registration.notes && (
                                <div>
                                    <p className="text-sm text-muted-foreground">{t('admin:ppdb.registrations.notes', 'Notes')}</p>
                                    <p>{registration.notes}</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Parent Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle>{t('admin:ppdb.registrations.parent_info', 'Parent Information')}</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="border-b pb-4">
                                <p className="text-sm font-medium mb-2">{t('admin:ppdb.registrations.father', 'Father')}</p>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm text-muted-foreground">{t('admin:ppdb.registrations.name', 'Name')}</p>
                                        <p>{registration.father_name || '-'}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">{t('admin:ppdb.registrations.phone', 'Phone')}</p>
                                        <p>{registration.father_phone || '-'}</p>
                                    </div>
                                </div>
                                <div className="mt-2">
                                    <p className="text-sm text-muted-foreground">{t('admin:ppdb.registrations.occupation', 'Occupation')}</p>
                                    <p>{registration.father_occupation || '-'}</p>
                                </div>
                            </div>
                            <div className="border-b pb-4">
                                <p className="text-sm font-medium mb-2">{t('admin:ppdb.registrations.mother', 'Mother')}</p>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm text-muted-foreground">{t('admin:ppdb.registrations.name', 'Name')}</p>
                                        <p>{registration.mother_name || '-'}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">{t('admin:ppdb.registrations.phone', 'Phone')}</p>
                                        <p>{registration.mother_phone || '-'}</p>
                                    </div>
                                </div>
                                <div className="mt-2">
                                    <p className="text-sm text-muted-foreground">{t('admin:ppdb.registrations.occupation', 'Occupation')}</p>
                                    <p>{registration.mother_occupation || '-'}</p>
                                </div>
                            </div>
                            {(registration.guardian_name || registration.guardian_phone) && (
                                <div>
                                    <p className="text-sm font-medium mb-2">{t('admin:ppdb.registrations.guardian', 'Guardian')}</p>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-sm text-muted-foreground">{t('admin:ppdb.registrations.name', 'Name')}</p>
                                            <p>{registration.guardian_name || '-'}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-muted-foreground">{t('admin:ppdb.registrations.phone', 'Phone')}</p>
                                            <p>{registration.guardian_phone || '-'}</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Previous School */}
                    <Card>
                        <CardHeader>
                            <CardTitle>{t('admin:ppdb.registrations.previous_school_info', 'Previous School')}</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <p className="text-sm text-muted-foreground">{t('admin:ppdb.registrations.school_name', 'School Name')}</p>
                                <p>{registration.previous_school || '-'}</p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">{t('admin:ppdb.registrations.school_address', 'Address')}</p>
                                <p>{registration.previous_school_address || '-'}</p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">{t('admin:ppdb.registrations.graduation_year', 'Graduation Year')}</p>
                                <p>{registration.graduation_year || '-'}</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Documents */}
                <Card>
                    <CardHeader>
                        <CardTitle>{t('admin:ppdb.registrations.documents', 'Documents')}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>{t('admin:ppdb.registrations.document_name', 'Document')}</TableHead>
                                    <TableHead>{t('admin:ppdb.registrations.file_name', 'File Name')}</TableHead>
                                    <TableHead>{t('admin:ppdb.registrations.file_size', 'Size')}</TableHead>
                                    <TableHead>{t('admin:ppdb.registrations.verification_status', 'Status')}</TableHead>
                                    <TableHead className="text-right">{t('common:table.actions')}</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {registration.documents.map((doc) => (
                                    <TableRow key={doc.id}>
                                        <TableCell className="font-medium">{doc.requirement?.name || '-'}</TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <FileIcon className="h-4 w-4" />
                                                {doc.file_name}
                                            </div>
                                        </TableCell>
                                        <TableCell>{formatFileSize(doc.file_size)}</TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                {getDocumentStatusIcon(doc.status)}
                                                <span className="capitalize">{doc.status}</span>
                                            </div>
                                            {doc.rejection_reason && (
                                                <p className="text-xs text-red-500 mt-1">{doc.rejection_reason}</p>
                                            )}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <a href={`/storage/${doc.file_path}`} target="_blank" rel="noopener noreferrer">
                                                <Button variant="ghost" size="icon">
                                                    <DownloadIcon className="h-4 w-4" />
                                                </Button>
                                            </a>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {registration.documents.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                                            {t('admin:ppdb.registrations.no_documents', 'No documents uploaded')}
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                {/* Scores */}
                <Card>
                    <CardHeader>
                        <CardTitle>{t('admin:ppdb.registrations.scores', 'Academic Scores')}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>{t('admin:ppdb.registrations.subject', 'Subject')}</TableHead>
                                    <TableHead>{t('admin:ppdb.registrations.score_type', 'Type')}</TableHead>
                                    <TableHead>{t('admin:ppdb.registrations.semester', 'Semester')}</TableHead>
                                    <TableHead className="text-right">{t('admin:ppdb.registrations.score', 'Score')}</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {registration.scores.map((score) => (
                                    <TableRow key={score.id}>
                                        <TableCell className="font-medium">{score.subject}</TableCell>
                                        <TableCell className="capitalize">{score.type}</TableCell>
                                        <TableCell>{score.semester}</TableCell>
                                        <TableCell className="text-right font-mono">{score.score}</TableCell>
                                    </TableRow>
                                ))}
                                {registration.scores.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                                            {t('admin:ppdb.registrations.no_scores', 'No scores recorded')}
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                {/* Achievements */}
                <Card>
                    <CardHeader>
                        <CardTitle>{t('admin:ppdb.registrations.achievements', 'Achievements')}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>{t('admin:ppdb.registrations.achievement_name', 'Name')}</TableHead>
                                    <TableHead>{t('admin:ppdb.registrations.achievement_type', 'Type')}</TableHead>
                                    <TableHead>{t('admin:ppdb.registrations.achievement_level', 'Level')}</TableHead>
                                    <TableHead>{t('admin:ppdb.registrations.achievement_rank', 'Rank')}</TableHead>
                                    <TableHead>{t('admin:ppdb.registrations.achievement_year', 'Year')}</TableHead>
                                    <TableHead>{t('admin:ppdb.registrations.organizer', 'Organizer')}</TableHead>
                                    <TableHead className="text-right">{t('admin:ppdb.registrations.points', 'Points')}</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {registration.achievements.map((achievement) => (
                                    <TableRow key={achievement.id}>
                                        <TableCell className="font-medium">{achievement.name}</TableCell>
                                        <TableCell className="capitalize">{achievement.type}</TableCell>
                                        <TableCell className="capitalize">{achievement.level}</TableCell>
                                        <TableCell className="capitalize">{achievement.rank}</TableCell>
                                        <TableCell>{achievement.year}</TableCell>
                                        <TableCell>{achievement.organizer}</TableCell>
                                        <TableCell className="text-right font-mono">{achievement.points}</TableCell>
                                    </TableRow>
                                ))}
                                {registration.achievements.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                                            {t('admin:ppdb.registrations.no_achievements', 'No achievements recorded')}
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                {/* Selection Result */}
                {registration.selection && (
                    <Card>
                        <CardHeader>
                            <CardTitle>{t('admin:ppdb.registrations.selection_result', 'Selection Result')}</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <p className="text-sm text-muted-foreground">{t('admin:ppdb.registrations.final_score', 'Final Score')}</p>
                                    <p className="text-2xl font-bold">{registration.selection.final_score}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">{t('admin:ppdb.registrations.rank', 'Rank')}</p>
                                    <p className="text-2xl font-bold">#{registration.selection.rank}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">{t('admin:ppdb.registrations.selection_status', 'Status')}</p>
                                    <div className="mt-1">{getSelectionStatusBadge(registration.selection.status)}</div>
                                </div>
                            </div>
                            {registration.selection.score_breakdown && Object.keys(registration.selection.score_breakdown).length > 0 && (
                                <div>
                                    <p className="text-sm text-muted-foreground mb-2">{t('admin:ppdb.registrations.score_breakdown', 'Score Breakdown')}</p>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                                        {Object.entries(registration.selection.score_breakdown).map(([key, value]) => (
                                            <div key={key} className="bg-muted rounded p-2">
                                                <p className="text-xs text-muted-foreground capitalize">{key}</p>
                                                <p className="font-mono">{value}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                            {registration.selection.notes && (
                                <div>
                                    <p className="text-sm text-muted-foreground">{t('admin:ppdb.registrations.selection_notes', 'Notes')}</p>
                                    <p>{registration.selection.notes}</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                )}

                {/* Payment History */}
                {registration.payments.length > 0 && (
                    <Card>
                        <CardHeader>
                            <CardTitle>{t('admin:ppdb.registrations.payment_history', 'Payment History')}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>{t('admin:ppdb.registrations.payment_code', 'Payment Code')}</TableHead>
                                        <TableHead>{t('admin:ppdb.registrations.payment_type', 'Type')}</TableHead>
                                        <TableHead>{t('admin:ppdb.registrations.amount', 'Amount')}</TableHead>
                                        <TableHead>{t('admin:ppdb.registrations.payment_method', 'Method')}</TableHead>
                                        <TableHead>{t('admin:ppdb.registrations.payment_status', 'Status')}</TableHead>
                                        <TableHead>{t('admin:ppdb.registrations.paid_at', 'Paid At')}</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {registration.payments.map((payment) => (
                                        <TableRow key={payment.id}>
                                            <TableCell className="font-mono">{payment.payment_code}</TableCell>
                                            <TableCell className="capitalize">{payment.type}</TableCell>
                                            <TableCell>{formatCurrency(payment.amount)}</TableCell>
                                            <TableCell>{payment.payment_method || '-'}</TableCell>
                                            <TableCell>{getPaymentStatusBadge(payment.status)}</TableCell>
                                            <TableCell>
                                                {payment.paid_at
                                                    ? new Date(payment.paid_at).toLocaleString()
                                                    : '-'}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                )}
            </div>
        </AppLayout>
    );
}
