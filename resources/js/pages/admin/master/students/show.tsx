import { Head, Link } from '@inertiajs/react';
import { PencilIcon, ArrowLeftIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';

interface Classroom {
    id: number;
    name: string;
    level?: { name: string };
    major?: { name: string };
}

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
    classrooms: Classroom[];
}

interface Props {
    student: Student;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Master Data', href: '#' },
    { title: 'Students', href: '/admin/master/students' },
    { title: 'Detail', href: '#' },
];

export default function StudentsShow({ student }: Props) {
    const getStatusBadge = (status: string) => {
        const variants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
            active: 'default',
            graduated: 'secondary',
            transferred: 'outline',
            dropped: 'destructive',
        };
        return <Badge variant={variants[status] || 'secondary'}>{status}</Badge>;
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Student: ${student.name}`} />

            <div className="flex flex-col gap-4 p-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/admin/master/students">
                            <Button variant="ghost" size="icon">
                                <ArrowLeftIcon className="h-4 w-4" />
                            </Button>
                        </Link>
                        <h1 className="text-2xl font-bold">{student.name}</h1>
                        {getStatusBadge(student.status)}
                    </div>
                    <Link href={`/admin/master/students/${student.id}/edit`}>
                        <Button>
                            <PencilIcon className="mr-2 h-4 w-4" />
                            Edit
                        </Button>
                    </Link>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Student Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-muted-foreground">NIS</p>
                                    <p className="font-mono">{student.nis}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">NISN</p>
                                    <p className="font-mono">{student.nisn}</p>
                                </div>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Gender</p>
                                <p className="capitalize">{student.gender}</p>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-muted-foreground">Birth Place</p>
                                    <p>{student.birth_place}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Birth Date</p>
                                    <p>{new Date(student.birth_date).toLocaleDateString()}</p>
                                </div>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Religion</p>
                                <p>{student.religion || '-'}</p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Phone</p>
                                <p>{student.phone || '-'}</p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Address</p>
                                <p>{student.address}</p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Academic Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <p className="text-sm text-muted-foreground">Entry Year</p>
                                <p>{student.entry_year}</p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Previous School</p>
                                <p>{student.previous_school || '-'}</p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Current Classroom</p>
                                <p>{student.classrooms[0]?.name || '-'}</p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Parent/Guardian Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <p className="text-sm text-muted-foreground">Parent Name</p>
                                <p>{student.parent_name}</p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Parent Phone</p>
                                <p>{student.parent_phone}</p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Parent Email</p>
                                <p>{student.parent_email || '-'}</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
