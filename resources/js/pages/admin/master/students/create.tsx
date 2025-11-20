import { Head, Link, useForm } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';

export default function StudentsCreate() {
    const { t } = useTranslation(['admin', 'common']);
    const { data, setData, post, processing, errors } = useForm({
        nis: '',
        nisn: '',
        name: '',
        gender: '',
        birth_place: '',
        birth_date: '',
        religion: '',
        phone: '',
        address: '',
        parent_name: '',
        parent_phone: '',
        parent_email: '',
        entry_year: new Date().getFullYear().toString(),
        previous_school: '',
        status: 'active',
    });

    const breadcrumbs: BreadcrumbItem[] = [
        { title: t('breadcrumbs.dashboard'), href: '/dashboard' },
        { title: t('breadcrumbs.master_data'), href: '#' },
        { title: t('breadcrumbs.students'), href: '/admin/master/students' },
        { title: t('breadcrumbs.create'), href: '#' },
    ];

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/master/students');
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('students.create')} />

            <div className="flex flex-col gap-4 p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">{t('students.create')}</h1>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>{t('students.student_info')}</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="nis">{t('students.nis')} *</Label>
                                    <Input
                                        id="nis"
                                        value={data.nis}
                                        onChange={(e) => setData('nis', e.target.value)}
                                    />
                                    {errors.nis && <p className="text-sm text-destructive">{errors.nis}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="nisn">{t('students.nisn')} *</Label>
                                    <Input
                                        id="nisn"
                                        maxLength={10}
                                        value={data.nisn}
                                        onChange={(e) => setData('nisn', e.target.value)}
                                    />
                                    {errors.nisn && <p className="text-sm text-destructive">{errors.nisn}</p>}
                                </div>
                            </div>

                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="name">{t('students.name')} *</Label>
                                    <Input
                                        id="name"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                    />
                                    {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="gender">{t('students.gender')} *</Label>
                                    <Select value={data.gender} onValueChange={(v) => setData('gender', v)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder={t('students.select_gender')} />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="male">{t('students.male')}</SelectItem>
                                            <SelectItem value="female">{t('students.female')}</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {errors.gender && <p className="text-sm text-destructive">{errors.gender}</p>}
                                </div>
                            </div>

                            <div className="grid gap-4 md:grid-cols-3">
                                <div className="space-y-2">
                                    <Label htmlFor="birth_place">{t('students.birth_place')} *</Label>
                                    <Input
                                        id="birth_place"
                                        value={data.birth_place}
                                        onChange={(e) => setData('birth_place', e.target.value)}
                                    />
                                    {errors.birth_place && <p className="text-sm text-destructive">{errors.birth_place}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="birth_date">{t('students.birth_date')} *</Label>
                                    <Input
                                        id="birth_date"
                                        type="date"
                                        value={data.birth_date}
                                        onChange={(e) => setData('birth_date', e.target.value)}
                                    />
                                    {errors.birth_date && <p className="text-sm text-destructive">{errors.birth_date}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="religion">{t('students.religion')}</Label>
                                    <Input
                                        id="religion"
                                        value={data.religion}
                                        onChange={(e) => setData('religion', e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="phone">{t('students.phone')}</Label>
                                    <Input
                                        id="phone"
                                        value={data.phone}
                                        onChange={(e) => setData('phone', e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="entry_year">{t('students.entry_year')} *</Label>
                                    <Input
                                        id="entry_year"
                                        type="number"
                                        min="2000"
                                        max={new Date().getFullYear() + 1}
                                        value={data.entry_year}
                                        onChange={(e) => setData('entry_year', e.target.value)}
                                    />
                                    {errors.entry_year && <p className="text-sm text-destructive">{errors.entry_year}</p>}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="address">{t('students.address')} *</Label>
                                <Textarea
                                    id="address"
                                    rows={3}
                                    value={data.address}
                                    onChange={(e) => setData('address', e.target.value)}
                                />
                                {errors.address && <p className="text-sm text-destructive">{errors.address}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="previous_school">{t('students.previous_school')}</Label>
                                <Input
                                    id="previous_school"
                                    value={data.previous_school}
                                    onChange={(e) => setData('previous_school', e.target.value)}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>{t('students.parent_info')}</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="parent_name">{t('students.parent_name')} *</Label>
                                    <Input
                                        id="parent_name"
                                        value={data.parent_name}
                                        onChange={(e) => setData('parent_name', e.target.value)}
                                    />
                                    {errors.parent_name && <p className="text-sm text-destructive">{errors.parent_name}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="parent_phone">{t('students.parent_phone')} *</Label>
                                    <Input
                                        id="parent_phone"
                                        value={data.parent_phone}
                                        onChange={(e) => setData('parent_phone', e.target.value)}
                                    />
                                    {errors.parent_phone && <p className="text-sm text-destructive">{errors.parent_phone}</p>}
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="parent_email">{t('students.parent_email')}</Label>
                                <Input
                                    id="parent_email"
                                    type="email"
                                    value={data.parent_email}
                                    onChange={(e) => setData('parent_email', e.target.value)}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>{t('students.status.title')}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                <Label htmlFor="status">{t('students.status.student_status')} *</Label>
                                <Select value={data.status} onValueChange={(v) => setData('status', v)}>
                                    <SelectTrigger className="w-48">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="active">{t('students.status.active')}</SelectItem>
                                        <SelectItem value="graduated">{t('students.status.graduated')}</SelectItem>
                                        <SelectItem value="transferred">{t('students.status.transferred')}</SelectItem>
                                        <SelectItem value="dropped">{t('students.status.dropped')}</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="flex gap-4">
                        <Button type="submit" disabled={processing}>
                            {processing ? t('students.creating') : t('students.create')}
                        </Button>
                        <Link href="/admin/master/students">
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
