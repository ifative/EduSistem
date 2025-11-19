import { Head, Link, router } from '@inertiajs/react';
import { PlusIcon, PencilIcon, TrashIcon, EyeIcon, DownloadIcon } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';

interface Classroom {
    id: number;
    name: string;
}

interface Student {
    id: number;
    nis: string;
    nisn: string;
    name: string;
    gender: string;
    status: string;
    classrooms: Classroom[];
}

interface Props {
    students: {
        data: Student[];
        links: any;
        meta: any;
    };
    classrooms: Classroom[];
    filters: {
        search?: string;
        status?: string;
        classroom_id?: string;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Master Data', href: '#' },
    { title: 'Students', href: '/admin/master/students' },
];

export default function StudentsIndex({ students, classrooms, filters }: Props) {
    const [search, setSearch] = useState(filters.search || '');
    const [status, setStatus] = useState(filters.status || '');
    const [classroomId, setClassroomId] = useState(filters.classroom_id || '');
    const [deleteId, setDeleteId] = useState<number | null>(null);

    const handleFilter = () => {
        router.get('/admin/master/students', {
            search: search || undefined,
            status: status || undefined,
            classroom_id: classroomId || undefined,
        }, { preserveState: true });
    };

    const handleDelete = () => {
        if (deleteId) {
            router.delete(`/admin/master/students/${deleteId}`);
            setDeleteId(null);
        }
    };

    const handleExport = () => {
        window.location.href = `/admin/master/students/export?${new URLSearchParams({
            search: search || '',
            status: status || '',
            classroom_id: classroomId || '',
        })}`;
    };

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
            <Head title="Students" />

            <div className="flex flex-col gap-6 p-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Students</h1>
                    <div className="flex gap-2">
                        <Button variant="outline" onClick={handleExport}>
                            <DownloadIcon className="mr-2 h-4 w-4" />
                            Export
                        </Button>
                        <Link href="/admin/master/students/create">
                            <Button>
                                <PlusIcon className="mr-2 h-4 w-4" />
                                Add Student
                            </Button>
                        </Link>
                    </div>
                </div>

                <Card>
                    <CardHeader>
                        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                            <CardTitle>All Students</CardTitle>
                            <div className="flex flex-wrap gap-2">
                                <Input
                                    placeholder="Search name, NIS, NISN..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="w-48"
                                />
                                <Select value={status} onValueChange={setStatus}>
                                    <SelectTrigger className="w-32">
                                        <SelectValue placeholder="Status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="">All Status</SelectItem>
                                        <SelectItem value="active">Active</SelectItem>
                                        <SelectItem value="graduated">Graduated</SelectItem>
                                        <SelectItem value="transferred">Transferred</SelectItem>
                                        <SelectItem value="dropped">Dropped</SelectItem>
                                    </SelectContent>
                                </Select>
                                <Select value={classroomId} onValueChange={setClassroomId}>
                                    <SelectTrigger className="w-40">
                                        <SelectValue placeholder="Classroom" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="">All Classrooms</SelectItem>
                                        {classrooms.map((classroom) => (
                                            <SelectItem key={classroom.id} value={String(classroom.id)}>
                                                {classroom.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <Button onClick={handleFilter} variant="secondary">
                                    Filter
                                </Button>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>NIS</TableHead>
                                    <TableHead>NISN</TableHead>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Gender</TableHead>
                                    <TableHead>Classroom</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {students.data.map((student) => (
                                    <TableRow key={student.id}>
                                        <TableCell className="font-mono">{student.nis}</TableCell>
                                        <TableCell className="font-mono">{student.nisn}</TableCell>
                                        <TableCell className="font-medium">{student.name}</TableCell>
                                        <TableCell className="capitalize">{student.gender}</TableCell>
                                        <TableCell>
                                            {student.classrooms[0]?.name || '-'}
                                        </TableCell>
                                        <TableCell>{getStatusBadge(student.status)}</TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Link href={`/admin/master/students/${student.id}`}>
                                                    <Button variant="ghost" size="icon">
                                                        <EyeIcon className="h-4 w-4" />
                                                    </Button>
                                                </Link>
                                                <Link href={`/admin/master/students/${student.id}/edit`}>
                                                    <Button variant="ghost" size="icon">
                                                        <PencilIcon className="h-4 w-4" />
                                                    </Button>
                                                </Link>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => setDeleteId(student.id)}
                                                >
                                                    <TrashIcon className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {students.data.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                                            No students found.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>

            <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Student</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete this student? This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </AppLayout>
    );
}
