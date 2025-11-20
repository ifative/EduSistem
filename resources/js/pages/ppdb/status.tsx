import InputError from '@/components/input-error';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Spinner } from '@/components/ui/spinner';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import GuestLayout from '@/layouts/guest-layout';
import ppdb from '@/routes/ppdb';
import { Head, Link, router, useForm } from '@inertiajs/react';
import {
    AlertCircleIcon,
    CheckCircle2Icon,
    FileTextIcon,
    PlusIcon,
    TrophyIcon,
    UploadIcon,
    XCircleIcon,
} from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

interface Document {
    id: number;
    type: string;
    file_name: string;
    created_at: string;
}

interface Score {
    id: number;
    subject: string;
    score: number;
    semester: string;
}

interface Achievement {
    id: number;
    name: string;
    level: string;
    year: number;
    certificate_url?: string;
}

interface Selection {
    id: number;
    final_score: number;
    rank: number;
    notes?: string;
    status: string;
}

interface Path {
    id: number;
    name: string;
}

interface Level {
    id: number;
    name: string;
}

interface Major {
    id: number;
    name: string;
}

interface Registration {
    id: number;
    registration_number: string;
    full_name: string;
    status: string;
    submitted_at?: string;
    path: Path;
    level: Level;
    major?: Major;
    documents: Document[];
    scores: Score[];
    achievements: Achievement[];
    selection?: Selection;
}

interface StatusProps {
    registration: Registration;
}

export default function Status({ registration }: StatusProps) {
    const { t } = useTranslation('ppdb');
    const [isUploading, setIsUploading] = useState(false);
    const [isAddingScore, setIsAddingScore] = useState(false);
    const [isAddingAchievement, setIsAddingAchievement] = useState(false);

    const documentForm = useForm({
        type: '',
        file: null as File | null,
    });

    const scoreForm = useForm({
        subject: '',
        score: '',
        semester: '',
    });

    const achievementForm = useForm({
        name: '',
        level: '',
        year: '',
        certificate: null as File | null,
    });

    const documentTypes = [
        'birth_certificate',
        'family_card',
        'report_card',
        'photo',
        'diploma',
        'domicile',
    ];

    const achievementLevels = [
        'school',
        'district',
        'city',
        'province',
        'national',
        'international',
    ];

    const getStatusBadge = (status: string) => {
        const variants: Record<
            string,
            'default' | 'secondary' | 'destructive' | 'outline'
        > = {
            draft: 'secondary',
            submitted: 'default',
            verified: 'default',
            passed: 'default',
            failed: 'destructive',
            enrolled: 'default',
        };

        const icons: Record<string, React.ReactNode> = {
            draft: null,
            submitted: <AlertCircleIcon className="h-3 w-3" />,
            verified: <CheckCircle2Icon className="h-3 w-3" />,
            passed: <CheckCircle2Icon className="h-3 w-3" />,
            failed: <XCircleIcon className="h-3 w-3" />,
            enrolled: <CheckCircle2Icon className="h-3 w-3" />,
        };

        return (
            <Badge variant={variants[status] || 'secondary'}>
                {icons[status]}
                {t(`status.statuses.${status}`)}
            </Badge>
        );
    };

    const handleDocumentUpload = (e: React.FormEvent) => {
        e.preventDefault();
        if (!documentForm.data.file) return;

        setIsUploading(true);
        router.post(
            ppdb.documents.upload.url(registration.id),
            {
                type: documentForm.data.type,
                file: documentForm.data.file,
            },
            {
                forceFormData: true,
                onSuccess: () => {
                    documentForm.reset();
                    setIsUploading(false);
                },
                onError: () => {
                    setIsUploading(false);
                },
            }
        );
    };

    const handleAddScore = (e: React.FormEvent) => {
        e.preventDefault();
        setIsAddingScore(true);
        router.post(
            ppdb.scores.add.url(registration.id),
            {
                subject: scoreForm.data.subject,
                score: scoreForm.data.score,
                semester: scoreForm.data.semester,
            },
            {
                onSuccess: () => {
                    scoreForm.reset();
                    setIsAddingScore(false);
                },
                onError: () => {
                    setIsAddingScore(false);
                },
            }
        );
    };

    const handleAddAchievement = (e: React.FormEvent) => {
        e.preventDefault();
        setIsAddingAchievement(true);
        router.post(
            ppdb.achievements.add.url(registration.id),
            {
                name: achievementForm.data.name,
                level: achievementForm.data.level,
                year: achievementForm.data.year,
                certificate: achievementForm.data.certificate,
            },
            {
                forceFormData: true,
                onSuccess: () => {
                    achievementForm.reset();
                    setIsAddingAchievement(false);
                },
                onError: () => {
                    setIsAddingAchievement(false);
                },
            }
        );
    };

    const handleSubmitRegistration = () => {
        router.post(ppdb.submit.url(registration.id));
    };

    const isDraft = registration.status === 'draft';

    return (
        <GuestLayout title={t('status.title')}>
            <Head title={t('status.title')} />

            <div className="mx-auto max-w-4xl space-y-6">
                {/* Registration Info */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle>
                                    {t('status.registration_info')}
                                </CardTitle>
                                <CardDescription>
                                    {registration.registration_number}
                                </CardDescription>
                            </div>
                            {getStatusBadge(registration.status)}
                        </div>
                    </CardHeader>
                    <CardContent>
                        <dl className="grid gap-3 sm:grid-cols-2">
                            <div>
                                <dt className="text-sm text-muted-foreground">
                                    {t('status.applicant_name')}
                                </dt>
                                <dd className="font-medium">
                                    {registration.full_name}
                                </dd>
                            </div>
                            <div>
                                <dt className="text-sm text-muted-foreground">
                                    {t('status.path')}
                                </dt>
                                <dd className="font-medium">
                                    {registration.path.name}
                                </dd>
                            </div>
                            <div>
                                <dt className="text-sm text-muted-foreground">
                                    {t('status.level')}
                                </dt>
                                <dd className="font-medium">
                                    {registration.level.name}
                                </dd>
                            </div>
                            {registration.major && (
                                <div>
                                    <dt className="text-sm text-muted-foreground">
                                        {t('status.major')}
                                    </dt>
                                    <dd className="font-medium">
                                        {registration.major.name}
                                    </dd>
                                </div>
                            )}
                            {registration.submitted_at && (
                                <div>
                                    <dt className="text-sm text-muted-foreground">
                                        {t('status.submitted_at')}
                                    </dt>
                                    <dd className="font-medium">
                                        {new Date(
                                            registration.submitted_at
                                        ).toLocaleDateString()}
                                    </dd>
                                </div>
                            )}
                        </dl>
                    </CardContent>
                </Card>

                {/* Documents Section */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <FileTextIcon className="h-5 w-5" />
                            {t('status.documents')}
                        </CardTitle>
                        <CardDescription>
                            {t('status.documents_description')}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {registration.documents.length > 0 ? (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>
                                            {t('status.document_type')}
                                        </TableHead>
                                        <TableHead>File</TableHead>
                                        <TableHead>Date</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {registration.documents.map((doc) => (
                                        <TableRow key={doc.id}>
                                            <TableCell className="font-medium">
                                                {doc.type}
                                            </TableCell>
                                            <TableCell>
                                                {doc.file_name}
                                            </TableCell>
                                            <TableCell>
                                                {new Date(
                                                    doc.created_at
                                                ).toLocaleDateString()}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        ) : (
                            <p className="py-4 text-center text-sm text-muted-foreground">
                                {t('status.no_documents')}
                            </p>
                        )}

                        {isDraft && (
                            <form
                                onSubmit={handleDocumentUpload}
                                className="mt-4 flex flex-col gap-4 rounded-lg border p-4 sm:flex-row sm:items-end"
                            >
                                <div className="flex-1 space-y-2">
                                    <Label>
                                        {t('status.document_type')}
                                    </Label>
                                    <Select
                                        value={documentForm.data.type}
                                        onValueChange={(value) =>
                                            documentForm.setData('type', value)
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue
                                                placeholder={t(
                                                    'status.select_document_type'
                                                )}
                                            />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {documentTypes.map((type) => (
                                                <SelectItem
                                                    key={type}
                                                    value={type}
                                                >
                                                    {type}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="flex-1 space-y-2">
                                    <Label>{t('status.choose_file')}</Label>
                                    <Input
                                        type="file"
                                        onChange={(e) =>
                                            documentForm.setData(
                                                'file',
                                                e.target.files?.[0] || null
                                            )
                                        }
                                    />
                                </div>
                                <Button
                                    type="submit"
                                    disabled={
                                        isUploading ||
                                        !documentForm.data.type ||
                                        !documentForm.data.file
                                    }
                                >
                                    {isUploading && <Spinner />}
                                    <UploadIcon className="h-4 w-4" />
                                    {t('status.upload_document')}
                                </Button>
                            </form>
                        )}
                    </CardContent>
                </Card>

                {/* Scores Section */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <FileTextIcon className="h-5 w-5" />
                            {t('status.scores')}
                        </CardTitle>
                        <CardDescription>
                            {t('status.scores_description')}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {registration.scores.length > 0 ? (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>
                                            {t('status.subject')}
                                        </TableHead>
                                        <TableHead>
                                            {t('status.score')}
                                        </TableHead>
                                        <TableHead>
                                            {t('status.semester')}
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {registration.scores.map((score) => (
                                        <TableRow key={score.id}>
                                            <TableCell className="font-medium">
                                                {score.subject}
                                            </TableCell>
                                            <TableCell>{score.score}</TableCell>
                                            <TableCell>
                                                {score.semester}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        ) : (
                            <p className="py-4 text-center text-sm text-muted-foreground">
                                {t('status.no_scores')}
                            </p>
                        )}

                        {isDraft && (
                            <form
                                onSubmit={handleAddScore}
                                className="mt-4 flex flex-col gap-4 rounded-lg border p-4 sm:flex-row sm:items-end"
                            >
                                <div className="flex-1 space-y-2">
                                    <Label>{t('status.subject')}</Label>
                                    <Input
                                        value={scoreForm.data.subject}
                                        onChange={(e) =>
                                            scoreForm.setData(
                                                'subject',
                                                e.target.value
                                            )
                                        }
                                        placeholder="Matematika"
                                    />
                                </div>
                                <div className="w-24 space-y-2">
                                    <Label>{t('status.score')}</Label>
                                    <Input
                                        type="number"
                                        min="0"
                                        max="100"
                                        value={scoreForm.data.score}
                                        onChange={(e) =>
                                            scoreForm.setData(
                                                'score',
                                                e.target.value
                                            )
                                        }
                                        placeholder="85"
                                    />
                                </div>
                                <div className="w-24 space-y-2">
                                    <Label>{t('status.semester')}</Label>
                                    <Input
                                        value={scoreForm.data.semester}
                                        onChange={(e) =>
                                            scoreForm.setData(
                                                'semester',
                                                e.target.value
                                            )
                                        }
                                        placeholder="1"
                                    />
                                </div>
                                <Button
                                    type="submit"
                                    disabled={
                                        isAddingScore ||
                                        !scoreForm.data.subject ||
                                        !scoreForm.data.score ||
                                        !scoreForm.data.semester
                                    }
                                >
                                    {isAddingScore && <Spinner />}
                                    <PlusIcon className="h-4 w-4" />
                                    {t('status.add_score')}
                                </Button>
                            </form>
                        )}
                    </CardContent>
                </Card>

                {/* Achievements Section */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <TrophyIcon className="h-5 w-5" />
                            {t('status.achievements')}
                        </CardTitle>
                        <CardDescription>
                            {t('status.achievements_description')}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {registration.achievements.length > 0 ? (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>
                                            {t('status.achievement_name')}
                                        </TableHead>
                                        <TableHead>
                                            {t('status.achievement_level')}
                                        </TableHead>
                                        <TableHead>
                                            {t('status.achievement_year')}
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {registration.achievements.map(
                                        (achievement) => (
                                            <TableRow key={achievement.id}>
                                                <TableCell className="font-medium">
                                                    {achievement.name}
                                                </TableCell>
                                                <TableCell>
                                                    {t(
                                                        `status.levels.${achievement.level}`
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    {achievement.year}
                                                </TableCell>
                                            </TableRow>
                                        )
                                    )}
                                </TableBody>
                            </Table>
                        ) : (
                            <p className="py-4 text-center text-sm text-muted-foreground">
                                {t('status.no_achievements')}
                            </p>
                        )}

                        {isDraft && (
                            <form
                                onSubmit={handleAddAchievement}
                                className="mt-4 space-y-4 rounded-lg border p-4"
                            >
                                <div className="grid gap-4 sm:grid-cols-3">
                                    <div className="space-y-2">
                                        <Label>
                                            {t('status.achievement_name')}
                                        </Label>
                                        <Input
                                            value={achievementForm.data.name}
                                            onChange={(e) =>
                                                achievementForm.setData(
                                                    'name',
                                                    e.target.value
                                                )
                                            }
                                            placeholder="Juara 1 Olimpiade"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>
                                            {t('status.achievement_level')}
                                        </Label>
                                        <Select
                                            value={achievementForm.data.level}
                                            onValueChange={(value) =>
                                                achievementForm.setData(
                                                    'level',
                                                    value
                                                )
                                            }
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Level" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {achievementLevels.map(
                                                    (level) => (
                                                        <SelectItem
                                                            key={level}
                                                            value={level}
                                                        >
                                                            {t(
                                                                `status.levels.${level}`
                                                            )}
                                                        </SelectItem>
                                                    )
                                                )}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>
                                            {t('status.achievement_year')}
                                        </Label>
                                        <Input
                                            type="number"
                                            value={achievementForm.data.year}
                                            onChange={(e) =>
                                                achievementForm.setData(
                                                    'year',
                                                    e.target.value
                                                )
                                            }
                                            placeholder={new Date()
                                                .getFullYear()
                                                .toString()}
                                        />
                                    </div>
                                </div>
                                <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                                    <div className="flex-1 space-y-2">
                                        <Label>{t('status.certificate')}</Label>
                                        <Input
                                            type="file"
                                            onChange={(e) =>
                                                achievementForm.setData(
                                                    'certificate',
                                                    e.target.files?.[0] || null
                                                )
                                            }
                                        />
                                    </div>
                                    <Button
                                        type="submit"
                                        disabled={
                                            isAddingAchievement ||
                                            !achievementForm.data.name ||
                                            !achievementForm.data.level ||
                                            !achievementForm.data.year
                                        }
                                    >
                                        {isAddingAchievement && <Spinner />}
                                        <PlusIcon className="h-4 w-4" />
                                        {t('status.add_achievement')}
                                    </Button>
                                </div>
                            </form>
                        )}
                    </CardContent>
                </Card>

                {/* Selection Results */}
                {registration.selection && (
                    <Card>
                        <CardHeader>
                            <CardTitle>
                                {t('status.selection_results')}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <dl className="grid gap-3 sm:grid-cols-3">
                                <div>
                                    <dt className="text-sm text-muted-foreground">
                                        {t('status.final_score')}
                                    </dt>
                                    <dd className="text-2xl font-bold">
                                        {registration.selection.final_score}
                                    </dd>
                                </div>
                                <div>
                                    <dt className="text-sm text-muted-foreground">
                                        {t('status.rank')}
                                    </dt>
                                    <dd className="text-2xl font-bold">
                                        #{registration.selection.rank}
                                    </dd>
                                </div>
                                <div>
                                    <dt className="text-sm text-muted-foreground">
                                        {t('status.current_status')}
                                    </dt>
                                    <dd>
                                        {getStatusBadge(
                                            registration.selection.status
                                        )}
                                    </dd>
                                </div>
                            </dl>
                            {registration.selection.notes && (
                                <Alert className="mt-4">
                                    <AlertTitle>{t('status.notes')}</AlertTitle>
                                    <AlertDescription>
                                        {registration.selection.notes}
                                    </AlertDescription>
                                </Alert>
                            )}
                        </CardContent>
                    </Card>
                )}

                {/* Submit Button for Draft */}
                {isDraft && (
                    <Card>
                        <CardContent className="pt-6">
                            <Alert className="mb-4">
                                <AlertCircleIcon className="h-4 w-4" />
                                <AlertDescription>
                                    {t('status.submit_warning')}
                                </AlertDescription>
                            </Alert>
                            <Button
                                onClick={handleSubmitRegistration}
                                className="w-full"
                                size="lg"
                            >
                                {t('status.submit_registration')}
                            </Button>
                        </CardContent>
                    </Card>
                )}

                {/* Back to Check */}
                <div className="text-center">
                    <Link
                        href={ppdb.check.url()}
                        className="text-sm text-muted-foreground hover:underline"
                    >
                        {t('back_to_registration')}
                    </Link>
                </div>
            </div>
        </GuestLayout>
    );
}
