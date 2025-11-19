import { Head, Link, router } from '@inertiajs/react';
import { PlusIcon, PencilIcon, TrashIcon } from 'lucide-react';
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

interface Subject { id: number; name: string; code: string; group: string; credits: number; }
interface Props { subjects: { data: Subject[] }; filters: { search?: string; group?: string }; groups: string[]; }

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Dashboard', href: '/dashboard' }, { title: 'Master Data', href: '#' }, { title: 'Subjects', href: '/admin/master/subjects' }];

export default function SubjectsIndex({ subjects, filters, groups }: Props) {
    const [search, setSearch] = useState(filters.search || '');
    const [group, setGroup] = useState(filters.group || '__all__');
    const [deleteId, setDeleteId] = useState<number | null>(null);

    const handleFilter = () => router.get('/admin/master/subjects', { search: search || undefined, group: group === '__all__' ? undefined : group }, { preserveState: true });
    const handleDelete = () => { if (deleteId) { router.delete(`/admin/master/subjects/${deleteId}`); setDeleteId(null); } };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Subjects" />
            <div className="flex flex-col gap-4 p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Subjects</h1>
                    <Link href="/admin/master/subjects/create"><Button><PlusIcon className="mr-2 h-4 w-4" />Add Subject</Button></Link>
                </div>
                <Card>
                    <CardHeader>
                        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                            <CardTitle>All Subjects</CardTitle>
                            <div className="flex flex-wrap gap-2">
                                <Input placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-48" />
                                <Select value={group} onValueChange={setGroup}><SelectTrigger className="w-32"><SelectValue placeholder="Group" /></SelectTrigger><SelectContent><SelectItem value="__all__">All Groups</SelectItem>{groups.map((g) => <SelectItem key={g} value={g}>{g}</SelectItem>)}</SelectContent></Select>
                                <Button onClick={handleFilter} variant="secondary">Filter</Button>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader><TableRow><TableHead>Code</TableHead><TableHead>Name</TableHead><TableHead>Group</TableHead><TableHead>Credits</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
                            <TableBody>
                                {subjects.data.map((s) => (
                                    <TableRow key={s.id}>
                                        <TableCell className="font-mono">{s.code}</TableCell>
                                        <TableCell className="font-medium">{s.name}</TableCell>
                                        <TableCell><Badge variant="outline">{s.group}</Badge></TableCell>
                                        <TableCell>{s.credits}</TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Link href={`/admin/master/subjects/${s.id}/edit`}><Button variant="ghost" size="icon"><PencilIcon className="h-4 w-4" /></Button></Link>
                                                <Button variant="ghost" size="icon" onClick={() => setDeleteId(s.id)}><TrashIcon className="h-4 w-4" /></Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {subjects.data.length === 0 && <TableRow><TableCell colSpan={5} className="text-center py-8 text-muted-foreground">No subjects found.</TableCell></TableRow>}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
            <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}><AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Delete Subject</AlertDialogTitle><AlertDialogDescription>Are you sure?</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction></AlertDialogFooter></AlertDialogContent></AlertDialog>
        </AppLayout>
    );
}
