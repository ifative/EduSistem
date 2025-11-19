import { Head, Link, useForm } from '@inertiajs/react';

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

interface Student {
    id: number;
    nis: string;
    nisn: string;
    name: string;
    gender: string;
    birth_place: string;
    birth_date: string;
    religion: string;
    phone: string;
    address: string;
    parent_name: string;
    parent_phone: string;
    parent_email: string;
    entry_year: number;
    previous_school: string;
    status: string;
}

interface Props {
    student: Student;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Master Data', href: '#' },
    { title: 'Students', href: '/admin/master/students' },
    { title: 'Edit', href: '#' },
];

export default function StudentsEdit({ student }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        nis: student.nis,
        nisn: student.nisn,
        name: student.name,
        gender: student.gender,
        birth_place: student.birth_place,
        birth_date: student.birth_date.split('T')[0],
        religion: student.religion || '',
        phone: student.phone || '',
        address: student.address,
        parent_name: student.parent_name,
        parent_phone: student.parent_phone,
        parent_email: student.parent_email || '',
        entry_year: student.entry_year.toString(),
        previous_school: student.previous_school || '',
        status: student.status,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/admin/master/students/${student.id}`);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Student" />

            <div className="flex flex-col gap-4 p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Edit Student</h1>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Student Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="nis">NIS (School ID) *</Label>
                                    <Input
                                        id="nis"
                                        value={data.nis}
                                        onChange={(e) => setData('nis', e.target.value)}
                                    />
                                    {errors.nis && <p className="text-sm text-destructive">{errors.nis}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="nisn">NISN (National ID) *</Label>
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
                                    <Label htmlFor="name">Full Name *</Label>
                                    <Input
                                        id="name"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                    />
                                    {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="gender">Gender *</Label>
                                    <Select value={data.gender} onValueChange={(v) => setData('gender', v)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select gender" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="male">Male</SelectItem>
                                            <SelectItem value="female">Female</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {errors.gender && <p className="text-sm text-destructive">{errors.gender}</p>}
                                </div>
                            </div>

                            <div className="grid gap-4 md:grid-cols-3">
                                <div className="space-y-2">
                                    <Label htmlFor="birth_place">Birth Place *</Label>
                                    <Input
                                        id="birth_place"
                                        value={data.birth_place}
                                        onChange={(e) => setData('birth_place', e.target.value)}
                                    />
                                    {errors.birth_place && <p className="text-sm text-destructive">{errors.birth_place}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="birth_date">Birth Date *</Label>
                                    <Input
                                        id="birth_date"
                                        type="date"
                                        value={data.birth_date}
                                        onChange={(e) => setData('birth_date', e.target.value)}
                                    />
                                    {errors.birth_date && <p className="text-sm text-destructive">{errors.birth_date}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="religion">Religion</Label>
                                    <Input
                                        id="religion"
                                        value={data.religion}
                                        onChange={(e) => setData('religion', e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="phone">Phone</Label>
                                    <Input
                                        id="phone"
                                        value={data.phone}
                                        onChange={(e) => setData('phone', e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="entry_year">Entry Year *</Label>
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
                                <Label htmlFor="address">Address *</Label>
                                <Textarea
                                    id="address"
                                    rows={3}
                                    value={data.address}
                                    onChange={(e) => setData('address', e.target.value)}
                                />
                                {errors.address && <p className="text-sm text-destructive">{errors.address}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="previous_school">Previous School</Label>
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
                            <CardTitle>Parent/Guardian Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="parent_name">Parent Name *</Label>
                                    <Input
                                        id="parent_name"
                                        value={data.parent_name}
                                        onChange={(e) => setData('parent_name', e.target.value)}
                                    />
                                    {errors.parent_name && <p className="text-sm text-destructive">{errors.parent_name}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="parent_phone">Parent Phone *</Label>
                                    <Input
                                        id="parent_phone"
                                        value={data.parent_phone}
                                        onChange={(e) => setData('parent_phone', e.target.value)}
                                    />
                                    {errors.parent_phone && <p className="text-sm text-destructive">{errors.parent_phone}</p>}
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="parent_email">Parent Email</Label>
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
                            <CardTitle>Status</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                <Label htmlFor="status">Student Status *</Label>
                                <Select value={data.status} onValueChange={(v) => setData('status', v)}>
                                    <SelectTrigger className="w-48">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="active">Active</SelectItem>
                                        <SelectItem value="graduated">Graduated</SelectItem>
                                        <SelectItem value="transferred">Transferred</SelectItem>
                                        <SelectItem value="dropped">Dropped</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="flex gap-4">
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Saving...' : 'Save Changes'}
                        </Button>
                        <Link href="/admin/master/students">
                            <Button type="button" variant="outline">
                                Cancel
                            </Button>
                        </Link>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
