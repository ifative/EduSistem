import { Head, Link, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Dashboard', href: '/dashboard' }, { title: 'Master Data', href: '#' }, { title: 'Majors', href: '/admin/master/majors' }, { title: 'Create', href: '#' }];

export default function MajorsCreate() {
    const { data, setData, post, processing, errors } = useForm({ name: '', code: '' });

    const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); post('/admin/master/majors'); };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Major" />
            <div className="flex flex-col gap-4 p-4">
                <h1 className="text-2xl font-bold">Create Major</h1>
                <Card>
                    <CardHeader><CardTitle>Major Information</CardTitle></CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2"><Label htmlFor="name">Name *</Label><Input id="name" placeholder="e.g., Science" value={data.name} onChange={(e) => setData('name', e.target.value)} />{errors.name && <p className="text-sm text-destructive">{errors.name}</p>}</div>
                                <div className="space-y-2"><Label htmlFor="code">Code *</Label><Input id="code" placeholder="e.g., IPA" value={data.code} onChange={(e) => setData('code', e.target.value)} />{errors.code && <p className="text-sm text-destructive">{errors.code}</p>}</div>
                            </div>
                            <div className="flex gap-4 pt-4"><Button type="submit" disabled={processing}>{processing ? 'Creating...' : 'Create Major'}</Button><Link href="/admin/master/majors"><Button type="button" variant="outline">Cancel</Button></Link></div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
