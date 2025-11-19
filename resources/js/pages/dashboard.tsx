import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Activity, Plus, Settings, Shield, ShieldCheck, TrendingUp, Users } from 'lucide-react';

interface Stats {
    total_users: number;
    total_roles: number;
    total_permissions: number;
    recent_users: number;
}

interface RecentActivity {
    id: number;
    description: string;
    subject_type: string | null;
    subject_id: number | null;
    causer_name: string;
    created_at: string;
}

interface Props {
    stats: Stats;
    recentActivities: RecentActivity[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
];

export default function Dashboard({ stats, recentActivities }: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-6 p-4">
                {/* Stats Grid */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.total_users}</div>
                            <p className="text-xs text-muted-foreground">
                                <span className="text-green-600">+{stats.recent_users}</span> this week
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Roles</CardTitle>
                            <Shield className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.total_roles}</div>
                            <p className="text-xs text-muted-foreground">
                                Active role configurations
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Permissions</CardTitle>
                            <ShieldCheck className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.total_permissions}</div>
                            <p className="text-xs text-muted-foreground">
                                Access control rules
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Growth</CardTitle>
                            <TrendingUp className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {stats.total_users > 0
                                    ? `${Math.round((stats.recent_users / stats.total_users) * 100)}%`
                                    : '0%'}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                New users this week
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Main Content */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                    {/* Recent Activity */}
                    <Card className="lg:col-span-4">
                        <CardHeader>
                            <CardTitle>Recent Activity</CardTitle>
                            <CardDescription>
                                Latest actions performed in the system
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {recentActivities.length === 0 ? (
                                <p className="text-sm text-muted-foreground">No recent activity</p>
                            ) : (
                                <div className="space-y-4">
                                    {recentActivities.map((activity) => (
                                        <div key={activity.id} className="flex items-center gap-4">
                                            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-muted">
                                                <Activity className="h-4 w-4" />
                                            </div>
                                            <div className="flex-1 space-y-1">
                                                <p className="text-sm font-medium leading-none">
                                                    {activity.description}
                                                    {activity.subject_type && (
                                                        <span className="text-muted-foreground">
                                                            {' '}{activity.subject_type} #{activity.subject_id}
                                                        </span>
                                                    )}
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    by {activity.causer_name} · {activity.created_at}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Quick Actions */}
                    <Card className="lg:col-span-3">
                        <CardHeader>
                            <CardTitle>Quick Actions</CardTitle>
                            <CardDescription>
                                Common tasks and shortcuts
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid gap-2">
                                <Link
                                    href="/admin/users/create"
                                    className="flex items-center gap-3 rounded-lg border p-3 hover:bg-muted"
                                >
                                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                                        <Plus className="h-4 w-4 text-primary" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium">Add New User</p>
                                        <p className="text-xs text-muted-foreground">Create a user account</p>
                                    </div>
                                </Link>

                                <Link
                                    href="/admin/roles/create"
                                    className="flex items-center gap-3 rounded-lg border p-3 hover:bg-muted"
                                >
                                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                                        <Shield className="h-4 w-4 text-primary" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium">Create Role</p>
                                        <p className="text-xs text-muted-foreground">Define new access role</p>
                                    </div>
                                </Link>

                                <Link
                                    href="/admin/settings"
                                    className="flex items-center gap-3 rounded-lg border p-3 hover:bg-muted"
                                >
                                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                                        <Settings className="h-4 w-4 text-primary" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium">App Settings</p>
                                        <p className="text-xs text-muted-foreground">Configure application</p>
                                    </div>
                                </Link>

                                <Link
                                    href="/admin/activity-logs"
                                    className="flex items-center gap-3 rounded-lg border p-3 hover:bg-muted"
                                >
                                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                                        <Activity className="h-4 w-4 text-primary" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium">Activity Logs</p>
                                        <p className="text-xs text-muted-foreground">View all activities</p>
                                    </div>
                                </Link>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
