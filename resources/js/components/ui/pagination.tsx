import { Button } from '@/components/ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { type PaginatedData } from '@/types';
import { router } from '@inertiajs/react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface DataTablePaginationProps<T> {
    data: PaginatedData<T>;
    routeName?: string;
    preserveState?: boolean;
}

export function DataTablePagination<T>({
    data,
    routeName,
    preserveState = true,
}: DataTablePaginationProps<T>) {
    const { t } = useTranslation('common');

    const goToPage = (url: string | null) => {
        if (url) {
            router.get(url, {}, { preserveState });
        }
    };

    const handlePerPageChange = (value: string) => {
        const url = new URL(data.first_page_url);
        url.searchParams.set('per_page', value);
        router.get(url.toString(), {}, { preserveState });
    };

    return (
        <div className="flex items-center justify-between px-2 py-4">
            <div className="text-muted-foreground flex-1 text-sm">
                {t('pagination.showing', { from: data.from, to: data.to, total: data.total })}
            </div>
            <div className="flex items-center space-x-6 lg:space-x-8">
                <div className="flex items-center space-x-2">
                    <p className="text-sm font-medium">{t('pagination.rows_per_page')}</p>
                    <Select
                        value={String(data.per_page)}
                        onValueChange={handlePerPageChange}
                    >
                        <SelectTrigger className="h-8 w-[70px]">
                            <SelectValue placeholder={data.per_page} />
                        </SelectTrigger>
                        <SelectContent side="top">
                            {[10, 20, 30, 40, 50].map((pageSize) => (
                                <SelectItem key={pageSize} value={String(pageSize)}>
                                    {pageSize}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className="flex w-[100px] items-center justify-center text-sm font-medium">
                    {t('pagination.page_of', { current: data.current_page, total: data.last_page })}
                </div>
                <div className="flex items-center space-x-2">
                    <Button
                        variant="outline"
                        className="hidden h-8 w-8 p-0 lg:flex"
                        onClick={() => goToPage(data.first_page_url)}
                        disabled={data.current_page === 1}
                    >
                        <span className="sr-only">{t('pagination.first_page')}</span>
                        <ChevronsLeft className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="outline"
                        className="h-8 w-8 p-0"
                        onClick={() => goToPage(data.prev_page_url)}
                        disabled={!data.prev_page_url}
                    >
                        <span className="sr-only">{t('pagination.previous_page')}</span>
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="outline"
                        className="h-8 w-8 p-0"
                        onClick={() => goToPage(data.next_page_url)}
                        disabled={!data.next_page_url}
                    >
                        <span className="sr-only">{t('pagination.next_page')}</span>
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="outline"
                        className="hidden h-8 w-8 p-0 lg:flex"
                        onClick={() => goToPage(data.last_page_url)}
                        disabled={data.current_page === data.last_page}
                    >
                        <span className="sr-only">{t('pagination.last_page')}</span>
                        <ChevronsRight className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </div>
    );
}
