import { Head, Link } from '@inertiajs/react';
import { PencilIcon, ArrowLeftIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';

interface Student { id: number; nis: string; name: string; gender: string; }
interface Classroom { id: number; name: string; code: string; capacity: number; level?: { name: string }; major?: { name: string }; homeroom_teacher?: { name: string }; }
interface Props { classroom: Classroom; students: Student[]; activeSemester?: { name: string }; }

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Dashboard', href: '/dashboard' }, { title: 'Master Data', href: '#' }, { title: 'Classrooms', href: '/admin/master/classrooms' }, { title: 'Detail', href: '#' }];

export default function ClassroomsShow({ classroom, students, activeSemester }: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Classroom: ${classroom.name}`} />
            <div className="flex flex-col gap-6 p-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/admin/master/classrooms"><Button variant="ghost" size="icon"><ArrowLeftIcon className="h-4 w-4" /></Button></Link>
                        <h1 className="text-2xl font-bold">{classroom.name}</h1>
                    </div>
                    <Link href={`/admin/master/classrooms/${classroom.id}/edit`}><Button><PencilIcon className="mr-2 h-4 w-4" />Edit</Button></Link>
                </div>
                <div className="grid gap-6 md:grid-cols-2">
                    <Card>
                        <CardHeader><CardTitle>Classroom Information</CardTitle></CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div><p className="text-sm text-muted-foreground">Code</p><p>{classroom.code}</p></div>
                                <div><p className="text-sm text-muted-foreground">Capacity</p><p>{students.length}/{classroom.capacity}</p></div>
                            </div>
                            <div><p className="text-sm text-muted-foreground">Level</p><p>{classroom.level?.name}</p></div>
                            <div><p className="text-sm text-muted-foreground">Major</p><p>{classroom.major?.name || '-'}</p></div>
                            <div><p className="text-sm text-muted-foreground">Homeroom Teacher</p><p>{classroom.homeroom_teacher?.name || '-'}</p></div>
                        </CardContent>
                    </Card>
                </div>
                <Card>
                    <CardHeader><CardTitle>Students {activeSemester && `(${activeSemester.name})`}</CardTitle></CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader><TableRow><TableHead>NIS</TableHead><TableHead>Name</TableHead><TableHead>Gender</TableHead></TableRow></TableHeader>
                            <TableBody>
                                {students.map((s) => <TableRow key={s.id}><TableCell className="font-mono">{s.nis}</TableCell><TableCell>{s.name}</TableCell><TableCell className="capitalize">{s.gender}</TableCell></TableRow>)}
                                {students.length === 0 && <TableRow><TableCell colSpan={3} className="text-center py-8 text-muted-foreground">No students enrolled.</TableCell></TableRow>}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
