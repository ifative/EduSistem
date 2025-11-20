import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FormField } from '@/components/form-field';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

interface Props {
    settings: {
        site_name: string;
        site_description: string;
        timezone: string;
        date_format: string;
        locale: string;
    };
}

const timezones = [
    'UTC',
    'America/New_York',
    'America/Los_Angeles',
    'Europe/London',
    'Europe/Paris',
    'Asia/Tokyo',
    'Asia/Jakarta',
    'Australia/Sydney',
];

const dateFormats = ['Y-m-d', 'd/m/Y', 'm/d/Y', 'd-m-Y', 'F j, Y'];

const locales = [
    { value: 'en', label: 'English' },
    { value: 'id', label: 'Indonesian' },
    { value: 'es', label: 'Spanish' },
    { value: 'fr', label: 'French' },
];

export default function SettingsIndex({ settings }: Props) {
    const { t } = useTranslation();
    const { data, setData, put, processing, errors } = useForm({
        site_name: settings.site_name,
        site_description: settings.site_description,
        timezone: settings.timezone,
        date_format: settings.date_format,
        locale: settings.locale,
    });

    const breadcrumbs: BreadcrumbItem[] = [
        { title: t('admin:breadcrumbs.dashboard'), href: '/dashboard' },
        { title: t('admin:breadcrumbs.settings'), href: '/admin/settings' },
    ];

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put('/admin/settings', {
            onSuccess: () => toast.success(t('admin:settings.saved_success')),
            onError: () => toast.error(t('admin:settings.saved_error')),
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('admin:settings.title')} />
            <div className="flex h-full flex-1 flex-col gap-6 p-4">
                <div>
                    <h1 className="text-2xl font-bold">{t('admin:settings.general_title')}</h1>
                    <p className="text-muted-foreground">{t('admin:settings.description')}</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Site Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle>{t('admin:settings.site_info')}</CardTitle>
                            <CardDescription>{t('admin:settings.site_info_description')}</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <FormField label={t('admin:settings.site_name')} htmlFor="site_name" error={errors.site_name} required>
                                <Input
                                    id="site_name"
                                    value={data.site_name}
                                    onChange={(e) => setData('site_name', e.target.value)}
                                    placeholder={t('admin:settings.site_name_placeholder')}
                                    aria-invalid={!!errors.site_name}
                                />
                            </FormField>

                            <FormField label={t('admin:settings.site_description')} htmlFor="site_description" error={errors.site_description}>
                                <Textarea
                                    id="site_description"
                                    value={data.site_description}
                                    onChange={(e) => setData('site_description', e.target.value)}
                                    placeholder={t('admin:settings.site_description_placeholder')}
                                    rows={3}
                                    aria-invalid={!!errors.site_description}
                                />
                            </FormField>
                        </CardContent>
                    </Card>

                    {/* Regional Settings */}
                    <Card>
                        <CardHeader>
                            <CardTitle>{t('admin:settings.regional')}</CardTitle>
                            <CardDescription>{t('admin:settings.regional_description')}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                <FormField label={t('admin:settings.timezone')} htmlFor="timezone" error={errors.timezone}>
                                    <Select value={data.timezone} onValueChange={(v) => setData('timezone', v)}>
                                        <SelectTrigger aria-invalid={!!errors.timezone}>
                                            <SelectValue placeholder={t('admin:settings.timezone_placeholder')} />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {timezones.map((tz) => (
                                                <SelectItem key={tz} value={tz}>
                                                    {tz}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </FormField>

                                <FormField label={t('admin:settings.date_format')} htmlFor="date_format" error={errors.date_format}>
                                    <Select
                                        value={data.date_format}
                                        onValueChange={(v) => setData('date_format', v)}
                                    >
                                        <SelectTrigger aria-invalid={!!errors.date_format}>
                                            <SelectValue placeholder={t('admin:settings.date_format_placeholder')} />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {dateFormats.map((fmt) => (
                                                <SelectItem key={fmt} value={fmt}>
                                                    {fmt}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </FormField>

                                <FormField label={t('admin:settings.locale')} htmlFor="locale" error={errors.locale}>
                                    <Select value={data.locale} onValueChange={(v) => setData('locale', v)}>
                                        <SelectTrigger aria-invalid={!!errors.locale}>
                                            <SelectValue placeholder={t('admin:settings.locale_placeholder')} />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {locales.map((loc) => (
                                                <SelectItem key={loc.value} value={loc.value}>
                                                    {loc.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </FormField>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Save Button */}
                    <div className="flex justify-end">
                        <Button type="submit" disabled={processing}>
                            {processing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {t('admin:settings.save')}
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
