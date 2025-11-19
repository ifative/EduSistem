import { Head, Link, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';

interface Level { id: number; name: string; code: string; }
interface Props { level: Level; }

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Dashboard', href: '/dashboard' }, { title: 'Master Data', href: '#' }, { title: 'Levels', href: '/admin/master/levels' }, { title: 'Edit', href: '#' }];

export default function LevelsEdit({ level }: Props) {
    const { data, setData, put, processing, errors } = useForm({ name: level.name, code: level.code });

    const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); put(`/admin/master/levels/${level.id}`); };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Level" />
            <div className="flex flex-col gap-6 p-6">
                <h1 className="text-2xl font-bold">Edit Level</h1>
                <Card>
                    <CardHeader><CardTitle>Level Information</CardTitle></CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2"><Label htmlFor="name">Name *</Label><Input id="name" value={data.name} onChange={(e) => setData('name', e.target.value)} />{errors.name && <p className="text-sm text-destructive">{errors.name}</p>}</div>
                                <div className="space-y-2"><Label htmlFor="code">Code *</Label><Input id="code" value={data.code} onChange={(e) => setData('code', e.target.value)} />{errors.code && <p className="text-sm text-destructive">{errors.code}</p>}</div>
                            </div>
                            <div className="flex gap-4 pt-4"><Button type="submit" disabled={processing}>{processing ? 'Saving...' : 'Save Changes'}</Button><Link href="/admin/master/levels"><Button type="button" variant="outline">Cancel</Button></Link></div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
