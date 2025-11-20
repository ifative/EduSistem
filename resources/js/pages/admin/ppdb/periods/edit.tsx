import { Head, Link, useForm } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';

interface AcademicYear {
    id: number;
    name: string;
}

interface AdmissionPeriod {
    id: number;
    academic_year_id: number;
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
}

interface Props {
    period: AdmissionPeriod;
    academicYears: AcademicYear[];
}

export default function PeriodsEdit({ period, academicYears }: Props) {
    const { t } = useTranslation(['admin', 'common']);
    const { data, setData, put, processing, errors } = useForm({
        academic_year_id: String(period.academic_year_id),
        name: period.name,
        description: period.description || '',
        registration_start: period.registration_start.split('T')[0],
        registration_end: period.registration_end.split('T')[0],
        selection_date: period.selection_date.split('T')[0],
        announcement_date: period.announcement_date.split('T')[0],
        enrollment_start: period.enrollment_start.split('T')[0],
        enrollment_end: period.enrollment_end.split('T')[0],
        quota: String(period.quota),
        status: period.status,
        is_active: period.is_active,
    });

    const breadcrumbs: BreadcrumbItem[] = [
        { title: t('breadcrumbs.dashboard'), href: '/dashboard' },
        { title: t('breadcrumbs.ppdb'), href: '#' },
        { title: t('breadcrumbs.periods'), href: '/admin/ppdb/periods' },
        { title: t('breadcrumbs.edit'), href: '#' },
    ];

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/admin/ppdb/periods/${period.id}`);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('admin:ppdb.periods.edit')} />

            <div className="flex flex-col gap-4 p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">{t('admin:ppdb.periods.edit')}</h1>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>{t('admin:ppdb.periods.basic_info')}</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label>{t('admin:ppdb.periods.academic_year')} *</Label>
                                    <Select
                                        value={data.academic_year_id}
                                        onValueChange={(v) => setData('academic_year_id', v)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder={t('admin:ppdb.periods.select_academic_year')} />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {academicYears.map((year) => (
                                                <SelectItem key={year.id} value={String(year.id)}>
                                                    {year.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.academic_year_id && (
                                        <p className="text-sm text-destructive">{errors.academic_year_id}</p>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="name">{t('admin:ppdb.periods.name')} *</Label>
                                    <Input
                                        id="name"
                                        placeholder={t('admin:ppdb.periods.name_placeholder')}
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                    />
                                    {errors.name && (
                                        <p className="text-sm text-destructive">{errors.name}</p>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">{t('admin:ppdb.periods.description')}</Label>
                                <Textarea
                                    id="description"
                                    placeholder={t('admin:ppdb.periods.description_placeholder')}
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    rows={3}
                                />
                                {errors.description && (
                                    <p className="text-sm text-destructive">{errors.description}</p>
                                )}
                            </div>

                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="quota">{t('admin:ppdb.periods.quota')} *</Label>
                                    <Input
                                        id="quota"
                                        type="number"
                                        min="1"
                                        value={data.quota}
                                        onChange={(e) => setData('quota', e.target.value)}
                                    />
                                    {errors.quota && (
                                        <p className="text-sm text-destructive">{errors.quota}</p>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <Label>{t('admin:ppdb.periods.status')} *</Label>
                                    <Select
                                        value={data.status}
                                        onValueChange={(v) => setData('status', v)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="draft">{t('admin:ppdb.periods.status_draft')}</SelectItem>
                                            <SelectItem value="open">{t('admin:ppdb.periods.status_open')}</SelectItem>
                                            <SelectItem value="closed">{t('admin:ppdb.periods.status_closed')}</SelectItem>
                                            <SelectItem value="selection">{t('admin:ppdb.periods.status_selection')}</SelectItem>
                                            <SelectItem value="announced">{t('admin:ppdb.periods.status_announced')}</SelectItem>
                                            <SelectItem value="enrollment">{t('admin:ppdb.periods.status_enrollment')}</SelectItem>
                                            <SelectItem value="completed">{t('admin:ppdb.periods.status_completed')}</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {errors.status && (
                                        <p className="text-sm text-destructive">{errors.status}</p>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>{t('admin:ppdb.periods.schedule_info')}</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="registration_start">{t('admin:ppdb.periods.registration_start')} *</Label>
                                    <Input
                                        id="registration_start"
                                        type="date"
                                        value={data.registration_start}
                                        onChange={(e) => setData('registration_start', e.target.value)}
                                    />
                                    {errors.registration_start && (
                                        <p className="text-sm text-destructive">{errors.registration_start}</p>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="registration_end">{t('admin:ppdb.periods.registration_end')} *</Label>
                                    <Input
                                        id="registration_end"
                                        type="date"
                                        value={data.registration_end}
                                        onChange={(e) => setData('registration_end', e.target.value)}
                                    />
                                    {errors.registration_end && (
                                        <p className="text-sm text-destructive">{errors.registration_end}</p>
                                    )}
                                </div>
                            </div>

                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="selection_date">{t('admin:ppdb.periods.selection_date')} *</Label>
                                    <Input
                                        id="selection_date"
                                        type="date"
                                        value={data.selection_date}
                                        onChange={(e) => setData('selection_date', e.target.value)}
                                    />
                                    {errors.selection_date && (
                                        <p className="text-sm text-destructive">{errors.selection_date}</p>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="announcement_date">{t('admin:ppdb.periods.announcement_date')} *</Label>
                                    <Input
                                        id="announcement_date"
                                        type="date"
                                        value={data.announcement_date}
                                        onChange={(e) => setData('announcement_date', e.target.value)}
                                    />
                                    {errors.announcement_date && (
                                        <p className="text-sm text-destructive">{errors.announcement_date}</p>
                                    )}
                                </div>
                            </div>

                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="enrollment_start">{t('admin:ppdb.periods.enrollment_start')} *</Label>
                                    <Input
                                        id="enrollment_start"
                                        type="date"
                                        value={data.enrollment_start}
                                        onChange={(e) => setData('enrollment_start', e.target.value)}
                                    />
                                    {errors.enrollment_start && (
                                        <p className="text-sm text-destructive">{errors.enrollment_start}</p>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="enrollment_end">{t('admin:ppdb.periods.enrollment_end')} *</Label>
                                    <Input
                                        id="enrollment_end"
                                        type="date"
                                        value={data.enrollment_end}
                                        onChange={(e) => setData('enrollment_end', e.target.value)}
                                    />
                                    {errors.enrollment_end && (
                                        <p className="text-sm text-destructive">{errors.enrollment_end}</p>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>{t('admin:ppdb.periods.settings')}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center space-x-2">
                                <Switch
                                    id="is_active"
                                    checked={data.is_active}
                                    onCheckedChange={(checked) => setData('is_active', checked)}
                                />
                                <Label htmlFor="is_active">{t('admin:ppdb.periods.set_active')}</Label>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="flex gap-4">
                        <Button type="submit" disabled={processing}>
                            {processing ? t('admin:ppdb.periods.updating') : t('common:actions.save')}
                        </Button>
                        <Link href="/admin/ppdb/periods">
                            <Button type="button" variant="outline">
                                {t('common:actions.cancel')}
                            </Button>
                        </Link>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
