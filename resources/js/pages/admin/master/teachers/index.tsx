import { Head, Link, router } from '@inertiajs/react';
import { PlusIcon, PencilIcon, TrashIcon, EyeIcon } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';

interface Teacher {
    id: number;
    nip: string;
    nuptk: string;
    name: string;
    email: string;
    phone: string;
    status: string;
    homeroom_classrooms_count: number;
}

interface Props {
    teachers: { data: Teacher[]; links: any; meta: any };
    filters: { search?: string; status?: string };
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Master Data', href: '#' },
    { title: 'Teachers', href: '/admin/master/teachers' },
];

export default function TeachersIndex({ teachers, filters }: Props) {
    const [search, setSearch] = useState(filters.search || '');
    const [status, setStatus] = useState(filters.status || '__all__');
    const [deleteId, setDeleteId] = useState<number | null>(null);

    const handleFilter = () => {
        router.get('/admin/master/teachers', { search: search || undefined, status: status === '__all__' ? undefined : status }, { preserveState: true });
    };

    const handleDelete = () => {
        if (deleteId) {
            router.delete(`/admin/master/teachers/${deleteId}`);
            setDeleteId(null);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Teachers" />
            <div className="flex flex-col gap-4 p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Teachers</h1>
                    <Link href="/admin/master/teachers/create">
                        <Button><PlusIcon className="mr-2 h-4 w-4" />Add Teacher</Button>
                    </Link>
                </div>
                <Card>
                    <CardHeader>
                        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                            <CardTitle>All Teachers</CardTitle>
                            <div className="flex flex-wrap gap-2">
                                <Input placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-48" />
                                <Select value={status} onValueChange={setStatus}>
                                    <SelectTrigger className="w-32"><SelectValue placeholder="Status" /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="__all__">All</SelectItem>
                                        <SelectItem value="active">Active</SelectItem>
                                        <SelectItem value="inactive">Inactive</SelectItem>
                                    </SelectContent>
                                </Select>
                                <Button onClick={handleFilter} variant="secondary">Filter</Button>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>NIP</TableHead>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Phone</TableHead>
                                    <TableHead>Homerooms</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {teachers.data.map((teacher) => (
                                    <TableRow key={teacher.id}>
                                        <TableCell className="font-mono">{teacher.nip || '-'}</TableCell>
                                        <TableCell className="font-medium">{teacher.name}</TableCell>
                                        <TableCell>{teacher.email}</TableCell>
                                        <TableCell>{teacher.phone}</TableCell>
                                        <TableCell>{teacher.homeroom_classrooms_count}</TableCell>
                                        <TableCell>
                                            <Badge variant={teacher.status === 'active' ? 'default' : 'secondary'}>{teacher.status}</Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Link href={`/admin/master/teachers/${teacher.id}`}><Button variant="ghost" size="icon"><EyeIcon className="h-4 w-4" /></Button></Link>
                                                <Link href={`/admin/master/teachers/${teacher.id}/edit`}><Button variant="ghost" size="icon"><PencilIcon className="h-4 w-4" /></Button></Link>
                                                <Button variant="ghost" size="icon" onClick={() => setDeleteId(teacher.id)}><TrashIcon className="h-4 w-4" /></Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {teachers.data.length === 0 && (
                                    <TableRow><TableCell colSpan={7} className="text-center py-8 text-muted-foreground">No teachers found.</TableCell></TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
            <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Teacher</AlertDialogTitle>
                        <AlertDialogDescription>Are you sure? This action cannot be undone.</AlertDialogDescription>
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
