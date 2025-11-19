import { Head, Link, router } from '@inertiajs/react';
import { PlusIcon, PencilIcon, TrashIcon, EyeIcon } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';

interface Classroom {
    id: number; name: string; code: string; capacity: number; students_count: number;
    level: { id: number; name: string }; major?: { id: number; name: string }; homeroom_teacher?: { id: number; name: string };
}
interface Props {
    classrooms: { data: Classroom[] }; levels: { id: number; name: string }[]; majors: { id: number; name: string }[];
    filters: { search?: string; level_id?: string; major_id?: string };
}

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Dashboard', href: '/dashboard' }, { title: 'Master Data', href: '#' }, { title: 'Classrooms', href: '/admin/master/classrooms' }];

export default function ClassroomsIndex({ classrooms, levels, majors, filters }: Props) {
    const [search, setSearch] = useState(filters.search || '');
    const [levelId, setLevelId] = useState(filters.level_id || '');
    const [majorId, setMajorId] = useState(filters.major_id || '');
    const [deleteId, setDeleteId] = useState<number | null>(null);

    const handleFilter = () => router.get('/admin/master/classrooms', { search: search || undefined, level_id: levelId || undefined, major_id: majorId || undefined }, { preserveState: true });
    const handleDelete = () => { if (deleteId) { router.delete(`/admin/master/classrooms/${deleteId}`); setDeleteId(null); } };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Classrooms" />
            <div className="flex flex-col gap-6 p-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Classrooms</h1>
                    <Link href="/admin/master/classrooms/create"><Button><PlusIcon className="mr-2 h-4 w-4" />Add Classroom</Button></Link>
                </div>
                <Card>
                    <CardHeader>
                        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                            <CardTitle>All Classrooms</CardTitle>
                            <div className="flex flex-wrap gap-2">
                                <Input placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-40" />
                                <Select value={levelId} onValueChange={setLevelId}><SelectTrigger className="w-32"><SelectValue placeholder="Level" /></SelectTrigger><SelectContent><SelectItem value="">All Levels</SelectItem>{levels.map((l) => <SelectItem key={l.id} value={String(l.id)}>{l.name}</SelectItem>)}</SelectContent></Select>
                                <Select value={majorId} onValueChange={setMajorId}><SelectTrigger className="w-32"><SelectValue placeholder="Major" /></SelectTrigger><SelectContent><SelectItem value="">All Majors</SelectItem>{majors.map((m) => <SelectItem key={m.id} value={String(m.id)}>{m.name}</SelectItem>)}</SelectContent></Select>
                                <Button onClick={handleFilter} variant="secondary">Filter</Button>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader><TableRow><TableHead>Name</TableHead><TableHead>Code</TableHead><TableHead>Level</TableHead><TableHead>Major</TableHead><TableHead>Homeroom</TableHead><TableHead>Students</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
                            <TableBody>
                                {classrooms.data.map((c) => (
                                    <TableRow key={c.id}>
                                        <TableCell className="font-medium">{c.name}</TableCell>
                                        <TableCell>{c.code}</TableCell>
                                        <TableCell>{c.level?.name}</TableCell>
                                        <TableCell>{c.major?.name || '-'}</TableCell>
                                        <TableCell>{c.homeroom_teacher?.name || '-'}</TableCell>
                                        <TableCell>{c.students_count}/{c.capacity}</TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Link href={`/admin/master/classrooms/${c.id}`}><Button variant="ghost" size="icon"><EyeIcon className="h-4 w-4" /></Button></Link>
                                                <Link href={`/admin/master/classrooms/${c.id}/edit`}><Button variant="ghost" size="icon"><PencilIcon className="h-4 w-4" /></Button></Link>
                                                <Button variant="ghost" size="icon" onClick={() => setDeleteId(c.id)}><TrashIcon className="h-4 w-4" /></Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {classrooms.data.length === 0 && <TableRow><TableCell colSpan={7} className="text-center py-8 text-muted-foreground">No classrooms found.</TableCell></TableRow>}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
            <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}><AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Delete Classroom</AlertDialogTitle><AlertDialogDescription>Are you sure?</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction></AlertDialogFooter></AlertDialogContent></AlertDialog>
        </AppLayout>
    );
}
