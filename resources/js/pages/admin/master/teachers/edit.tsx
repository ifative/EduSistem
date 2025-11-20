import { Head, Link, useForm } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';

interface Teacher {
    id: number; nip: string; nuptk: string; name: string; gender: string; email: string; phone: string; address: string; position: string; status: string;
}

interface Props { teacher: Teacher; }

export default function TeachersEdit({ teacher }: Props) {
    const { t } = useTranslation(['admin', 'common']);
    const { data, setData, put, processing, errors } = useForm({
        nip: teacher.nip || '', nuptk: teacher.nuptk || '', name: teacher.name, gender: teacher.gender, email: teacher.email, phone: teacher.phone, address: teacher.address, position: teacher.position || '', status: teacher.status,
    });

    const breadcrumbs: BreadcrumbItem[] = [
        { title: t('breadcrumbs.dashboard'), href: '/dashboard' },
        { title: t('breadcrumbs.master_data'), href: '#' },
        { title: t('breadcrumbs.teachers'), href: '/admin/master/teachers' },
        { title: t('breadcrumbs.edit'), href: '#' },
    ];

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/admin/master/teachers/${teacher.id}`);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('teachers.edit')} />
            <div className="flex flex-col gap-4 p-4">
                <h1 className="text-2xl font-bold">{t('teachers.edit')}</h1>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <Card>
                        <CardHeader><CardTitle>{t('teachers.teacher_info')}</CardTitle></CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="nip">{t('teachers.nip')}</Label>
                                    <Input id="nip" value={data.nip} onChange={(e) => setData('nip', e.target.value)} />
                                    {errors.nip && <p className="text-sm text-destructive">{errors.nip}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="nuptk">{t('teachers.nuptk')}</Label>
                                    <Input id="nuptk" value={data.nuptk} onChange={(e) => setData('nuptk', e.target.value)} />
                                </div>
                            </div>
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="name">{t('teachers.name')} *</Label>
                                    <Input id="name" value={data.name} onChange={(e) => setData('name', e.target.value)} />
                                    {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="gender">{t('teachers.gender')} *</Label>
                                    <Select value={data.gender} onValueChange={(v) => setData('gender', v)}>
                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="male">{t('teachers.male')}</SelectItem>
                                            <SelectItem value="female">{t('teachers.female')}</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="email">{t('teachers.email')} *</Label>
                                    <Input id="email" type="email" value={data.email} onChange={(e) => setData('email', e.target.value)} />
                                    {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="phone">{t('teachers.phone')} *</Label>
                                    <Input id="phone" value={data.phone} onChange={(e) => setData('phone', e.target.value)} />
                                    {errors.phone && <p className="text-sm text-destructive">{errors.phone}</p>}
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="address">{t('teachers.address')} *</Label>
                                <Textarea id="address" rows={3} value={data.address} onChange={(e) => setData('address', e.target.value)} />
                                {errors.address && <p className="text-sm text-destructive">{errors.address}</p>}
                            </div>
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="position">{t('teachers.position')}</Label>
                                    <Input id="position" value={data.position} onChange={(e) => setData('position', e.target.value)} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="status">{t('teachers.status.teacher_status')} *</Label>
                                    <Select value={data.status} onValueChange={(v) => setData('status', v)}>
                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="active">{t('teachers.status.active')}</SelectItem>
                                            <SelectItem value="inactive">{t('teachers.status.inactive')}</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <div className="flex gap-4">
                        <Button type="submit" disabled={processing}>{processing ? t('teachers.updating') : t('teachers.edit')}</Button>
                        <Link href="/admin/master/teachers"><Button type="button" variant="outline">{t('common:actions.cancel')}</Button></Link>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
