import { DataTable } from '@/components/ui/data-table';
import { EmptyState } from '@/components/empty-state';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { DataTablePagination } from '@/components/ui/pagination';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type PaginatedData } from '@/types';
import { Head, router } from '@inertiajs/react';
import { Activity, Download, Loader2, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import { useTranslation } from 'react-i18next';
import { createColumns, type ActivityLog } from './columns';

interface Props {
    activities: PaginatedData<ActivityLog>;
    filters: { search?: string };
}

export default function ActivityLogsIndex({ activities, filters }: Props) {
    const { t } = useTranslation();
    const [search, setSearch] = useState(filters.search || '');
    const [isSearching, setIsSearching] = useState(false);

    const breadcrumbs: BreadcrumbItem[] = [
        { title: t('admin:breadcrumbs.dashboard'), href: '/dashboard' },
        { title: t('admin:breadcrumbs.activity_logs'), href: '/admin/activity-logs' },
    ];

    const columns = createColumns(t);

    const debouncedSearch = useDebouncedCallback((value: string) => {
        router.get('/admin/activity-logs', { search: value }, {
            preserveState: true,
            onFinish: () => setIsSearching(false),
        });
    }, 300);

    const handleSearchChange = (value: string) => {
        setSearch(value);
        setIsSearching(true);
        debouncedSearch(value);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('admin:activity_logs.title')} />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">{t('admin:activity_logs.title')}</h1>
                    <a href="/admin/export/activity-logs">
                        <Button variant="outline">
                            <Download className="mr-2 h-4 w-4" />
                            {t('common:export.export')}
                        </Button>
                    </a>
                </div>

                <Card className="flex-1">
                    <CardContent className="flex flex-col gap-3 px-4">
                        <div className="flex gap-2">
                            <div className="relative w-full sm:w-72">
                                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    placeholder={t('admin:activity_logs.search_placeholder')}
                                    value={search}
                                    onChange={(e) => handleSearchChange(e.target.value)}
                                    className="pl-10"
                                />
                                {isSearching && (
                                    <Loader2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-muted-foreground" />
                                )}
                            </div>
                        </div>

                        {activities.data.length === 0 ? (
                            <EmptyState
                                icon={<Activity className="h-12 w-12" />}
                                title={t('admin:activity_logs.empty_title')}
                                description={search ? t('admin:activity_logs.empty_search') : t('admin:activity_logs.empty_description')}
                            />
                        ) : (
                            <>
                                <DataTable columns={columns} data={activities.data} />
                                <DataTablePagination data={activities} />
                            </>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
