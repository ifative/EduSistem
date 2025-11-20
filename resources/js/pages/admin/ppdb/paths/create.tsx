import { Head, Link, useForm } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { index, store } from '@/routes/admin/ppdb/paths';

interface AdmissionPeriod {
    id: number;
    name: string;
}

interface Props {
    periods: AdmissionPeriod[];
}

const pathTypes = ['zonasi', 'prestasi', 'afirmasi', 'perpindahan', 'reguler'] as const;

export default function PathsCreate({ periods }: Props) {
    const { t } = useTranslation(['admin', 'common']);
    const { data, setData, post, processing, errors } = useForm({
        admission_period_id: '',
        name: '',
        code: '',
        description: '',
        type: 'reguler',
        quota: '30',
        min_score: '',
        max_distance: '',
        requires_test: false,
        requires_documents: true,
        selection_criteria: '{}',
        sort_order: '0',
        is_active: true,
    });

    const breadcrumbs: BreadcrumbItem[] = [
        { title: t('breadcrumbs.dashboard'), href: '/dashboard' },
        { title: t('breadcrumbs.ppdb'), href: '#' },
        { title: t('admin:ppdb.paths.title'), href: index.url() },
        { title: t('breadcrumbs.create'), href: '#' },
    ];

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(store.url());
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('admin:ppdb.paths.create')} />
            <div className="flex flex-col gap-4 p-4">
                <h1 className="text-2xl font-bold">{t('admin:ppdb.paths.create')}</h1>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>{t('admin:ppdb.paths.path_info')}</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label>{t('admin:ppdb.paths.period')} *</Label>
                                    <Select value={data.admission_period_id} onValueChange={(v) => setData('admission_period_id', v)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder={t('admin:ppdb.paths.select_period')} />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {periods.map((p) => (
                                                <SelectItem key={p.id} value={String(p.id)}>
                                                    {p.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.admission_period_id && <p className="text-sm text-destructive">{errors.admission_period_id}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label>{t('admin:ppdb.paths.type')} *</Label>
                                    <Select value={data.type} onValueChange={(v) => setData('type', v)}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {pathTypes.map((pt) => (
                                                <SelectItem key={pt} value={pt}>
                                                    {t(`admin:ppdb.paths.types.${pt}`)}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.type && <p className="text-sm text-destructive">{errors.type}</p>}
                                </div>
                            </div>
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="name">{t('admin:ppdb.paths.name')} *</Label>
                                    <Input
                                        id="name"
                                        placeholder={t('admin:ppdb.paths.name_placeholder')}
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                    />
                                    {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="code">{t('admin:ppdb.paths.code')} *</Label>
                                    <Input
                                        id="code"
                                        placeholder={t('admin:ppdb.paths.code_placeholder')}
                                        value={data.code}
                                        onChange={(e) => setData('code', e.target.value)}
                                    />
                                    {errors.code && <p className="text-sm text-destructive">{errors.code}</p>}
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="description">{t('admin:ppdb.paths.description')}</Label>
                                <Textarea
                                    id="description"
                                    placeholder={t('admin:ppdb.paths.description_placeholder')}
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    rows={3}
                                />
                                {errors.description && <p className="text-sm text-destructive">{errors.description}</p>}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>{t('admin:ppdb.paths.quota_settings')}</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-4 md:grid-cols-3">
                                <div className="space-y-2">
                                    <Label htmlFor="quota">{t('admin:ppdb.paths.quota')} *</Label>
                                    <Input
                                        id="quota"
                                        type="number"
                                        min="1"
                                        value={data.quota}
                                        onChange={(e) => setData('quota', e.target.value)}
                                    />
                                    {errors.quota && <p className="text-sm text-destructive">{errors.quota}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="min_score">{t('admin:ppdb.paths.min_score')}</Label>
                                    <Input
                                        id="min_score"
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        max="100"
                                        placeholder="0.00"
                                        value={data.min_score}
                                        onChange={(e) => setData('min_score', e.target.value)}
                                    />
                                    {errors.min_score && <p className="text-sm text-destructive">{errors.min_score}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="max_distance">{t('admin:ppdb.paths.max_distance')}</Label>
                                    <Input
                                        id="max_distance"
                                        type="number"
                                        step="0.1"
                                        min="0"
                                        placeholder="0.0"
                                        value={data.max_distance}
                                        onChange={(e) => setData('max_distance', e.target.value)}
                                    />
                                    {errors.max_distance && <p className="text-sm text-destructive">{errors.max_distance}</p>}
                                </div>
                            </div>
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="sort_order">{t('admin:ppdb.paths.sort_order')}</Label>
                                    <Input
                                        id="sort_order"
                                        type="number"
                                        min="0"
                                        value={data.sort_order}
                                        onChange={(e) => setData('sort_order', e.target.value)}
                                    />
                                    {errors.sort_order && <p className="text-sm text-destructive">{errors.sort_order}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="selection_criteria">{t('admin:ppdb.paths.selection_criteria')}</Label>
                                    <Textarea
                                        id="selection_criteria"
                                        placeholder='{"key": "value"}'
                                        value={data.selection_criteria}
                                        onChange={(e) => setData('selection_criteria', e.target.value)}
                                        rows={2}
                                    />
                                    {errors.selection_criteria && <p className="text-sm text-destructive">{errors.selection_criteria}</p>}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>{t('admin:ppdb.paths.requirements')}</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label>{t('admin:ppdb.paths.requires_test')}</Label>
                                    <p className="text-sm text-muted-foreground">{t('admin:ppdb.paths.requires_test_description')}</p>
                                </div>
                                <Switch
                                    checked={data.requires_test}
                                    onCheckedChange={(checked) => setData('requires_test', checked)}
                                />
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label>{t('admin:ppdb.paths.requires_documents')}</Label>
                                    <p className="text-sm text-muted-foreground">{t('admin:ppdb.paths.requires_documents_description')}</p>
                                </div>
                                <Switch
                                    checked={data.requires_documents}
                                    onCheckedChange={(checked) => setData('requires_documents', checked)}
                                />
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <Label>{t('admin:ppdb.paths.is_active')}</Label>
                                    <p className="text-sm text-muted-foreground">{t('admin:ppdb.paths.is_active_description')}</p>
                                </div>
                                <Switch
                                    checked={data.is_active}
                                    onCheckedChange={(checked) => setData('is_active', checked)}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    <div className="flex gap-4">
                        <Button type="submit" disabled={processing}>
                            {processing ? t('admin:ppdb.paths.creating') : t('admin:ppdb.paths.create')}
                        </Button>
                        <Link href={index.url()}>
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
