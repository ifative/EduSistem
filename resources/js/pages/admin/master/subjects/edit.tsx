import { Head, Link, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';

interface Subject { id: number; name: string; code: string; group: string; credits: number; }
interface Props { subject: Subject; groups: string[]; }

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Dashboard', href: '/dashboard' }, { title: 'Master Data', href: '#' }, { title: 'Subjects', href: '/admin/master/subjects' }, { title: 'Edit', href: '#' }];

export default function SubjectsEdit({ subject, groups }: Props) {
    const { data, setData, put, processing, errors } = useForm({ name: subject.name, code: subject.code, group: subject.group, credits: String(subject.credits) });

    const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); put(`/admin/master/subjects/${subject.id}`); };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Subject" />
            <div className="flex flex-col gap-4 p-4">
                <h1 className="text-2xl font-bold">Edit Subject</h1>
                <Card>
                    <CardHeader><CardTitle>Subject Information</CardTitle></CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2"><Label htmlFor="name">Name *</Label><Input id="name" value={data.name} onChange={(e) => setData('name', e.target.value)} />{errors.name && <p className="text-sm text-destructive">{errors.name}</p>}</div>
                                <div className="space-y-2"><Label htmlFor="code">Code *</Label><Input id="code" value={data.code} onChange={(e) => setData('code', e.target.value)} />{errors.code && <p className="text-sm text-destructive">{errors.code}</p>}</div>
                            </div>
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2"><Label>Group *</Label><Select value={data.group} onValueChange={(v) => setData('group', v)}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{groups.map((g) => <SelectItem key={g} value={g}>{g}</SelectItem>)}</SelectContent></Select></div>
                                <div className="space-y-2"><Label htmlFor="credits">Credits *</Label><Input id="credits" type="number" min="1" max="10" value={data.credits} onChange={(e) => setData('credits', e.target.value)} />{errors.credits && <p className="text-sm text-destructive">{errors.credits}</p>}</div>
                            </div>
                            <div className="flex gap-4 pt-4"><Button type="submit" disabled={processing}>{processing ? 'Saving...' : 'Save Changes'}</Button><Link href="/admin/master/subjects"><Button type="button" variant="outline">Cancel</Button></Link></div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
