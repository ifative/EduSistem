import { Head, Link } from '@inertiajs/react';
import { PencilIcon, ArrowLeftIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';

interface Teacher {
    id: number; nip: string; nuptk: string; name: string; gender: string; email: string; phone: string; address: string; position: string; status: string;
    homeroom_classrooms: { id: number; name: string }[];
    extracurriculars: { id: number; name: string }[];
}

interface Props { teacher: Teacher; }

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Master Data', href: '#' },
    { title: 'Teachers', href: '/admin/master/teachers' },
    { title: 'Detail', href: '#' },
];

export default function TeachersShow({ teacher }: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Teacher: ${teacher.name}`} />
            <div className="flex flex-col gap-6 p-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/admin/master/teachers"><Button variant="ghost" size="icon"><ArrowLeftIcon className="h-4 w-4" /></Button></Link>
                        <h1 className="text-2xl font-bold">{teacher.name}</h1>
                        <Badge variant={teacher.status === 'active' ? 'default' : 'secondary'}>{teacher.status}</Badge>
                    </div>
                    <Link href={`/admin/master/teachers/${teacher.id}/edit`}><Button><PencilIcon className="mr-2 h-4 w-4" />Edit</Button></Link>
                </div>
                <div className="grid gap-6 md:grid-cols-2">
                    <Card>
                        <CardHeader><CardTitle>Teacher Information</CardTitle></CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div><p className="text-sm text-muted-foreground">NIP</p><p className="font-mono">{teacher.nip || '-'}</p></div>
                                <div><p className="text-sm text-muted-foreground">NUPTK</p><p className="font-mono">{teacher.nuptk || '-'}</p></div>
                            </div>
                            <div><p className="text-sm text-muted-foreground">Gender</p><p className="capitalize">{teacher.gender}</p></div>
                            <div><p className="text-sm text-muted-foreground">Email</p><p>{teacher.email}</p></div>
                            <div><p className="text-sm text-muted-foreground">Phone</p><p>{teacher.phone}</p></div>
                            <div><p className="text-sm text-muted-foreground">Address</p><p>{teacher.address}</p></div>
                            <div><p className="text-sm text-muted-foreground">Position</p><p>{teacher.position || '-'}</p></div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader><CardTitle>Assignments</CardTitle></CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <p className="text-sm text-muted-foreground">Homeroom Classes</p>
                                {teacher.homeroom_classrooms?.length > 0 ? (
                                    <ul className="list-disc list-inside">{teacher.homeroom_classrooms.map((c) => <li key={c.id}>{c.name}</li>)}</ul>
                                ) : <p>-</p>}
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Extracurriculars</p>
                                {teacher.extracurriculars?.length > 0 ? (
                                    <ul className="list-disc list-inside">{teacher.extracurriculars.map((e) => <li key={e.id}>{e.name}</li>)}</ul>
                                ) : <p>-</p>}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
