import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Activity, Plus, Settings, Shield, ShieldCheck, TrendingUp, Users } from 'lucide-react';
import { useTranslation } from 'react-i18next';

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

export default function Dashboard({ stats, recentActivities }: Props) {
    const { t } = useTranslation('admin');

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: t('breadcrumbs.dashboard'),
            href: dashboard().url,
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('dashboard.title')} />
            <div className="flex h-full flex-1 flex-col gap-6 p-4">
                {/* Stats Grid */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">{t('dashboard.total_users')}</CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.total_users}</div>
                            <p className="text-xs text-muted-foreground">
                                <span className="text-green-600">+{stats.recent_users}</span> {t('dashboard.this_week', { count: '' }).trim()}
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">{t('dashboard.total_roles')}</CardTitle>
                            <Shield className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.total_roles}</div>
                            <p className="text-xs text-muted-foreground">
                                {t('dashboard.active_roles')}
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">{t('dashboard.total_permissions')}</CardTitle>
                            <ShieldCheck className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.total_permissions}</div>
                            <p className="text-xs text-muted-foreground">
                                {t('dashboard.access_rules')}
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">{t('dashboard.growth')}</CardTitle>
                            <TrendingUp className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {stats.total_users > 0
                                    ? `${Math.round((stats.recent_users / stats.total_users) * 100)}%`
                                    : '0%'}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                {t('dashboard.new_users_week')}
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Main Content */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                    {/* Recent Activity */}
                    <Card className="lg:col-span-4">
                        <CardHeader>
                            <CardTitle>{t('dashboard.recent_activity')}</CardTitle>
                            <CardDescription>
                                {t('dashboard.latest_actions')}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {recentActivities.length === 0 ? (
                                <p className="text-sm text-muted-foreground">{t('dashboard.no_recent')}</p>
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
                                                    {t('dashboard.by_user', { name: activity.causer_name })} · {activity.created_at}
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
                            <CardTitle>{t('dashboard.quick_actions')}</CardTitle>
                            <CardDescription>
                                {t('dashboard.common_tasks')}
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
                                        <p className="text-sm font-medium">{t('dashboard.add_new_user')}</p>
                                        <p className="text-xs text-muted-foreground">{t('dashboard.create_user_account')}</p>
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
                                        <p className="text-sm font-medium">{t('dashboard.create_role')}</p>
                                        <p className="text-xs text-muted-foreground">{t('dashboard.define_role')}</p>
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
                                        <p className="text-sm font-medium">{t('dashboard.app_settings')}</p>
                                        <p className="text-xs text-muted-foreground">{t('dashboard.configure_app')}</p>
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
                                        <p className="text-sm font-medium">{t('dashboard.activity_logs')}</p>
                                        <p className="text-xs text-muted-foreground">{t('dashboard.view_activities')}</p>
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
