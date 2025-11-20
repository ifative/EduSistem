import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ConfirmDialog } from '@/components/confirm-dialog';
import { EmptyState } from '@/components/empty-state';
import { Input } from '@/components/ui/input';
import { DataTablePagination } from '@/components/ui/pagination';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type PaginatedData } from '@/types';
import { Head, router } from '@inertiajs/react';
import { Download, Eye, File, FileImage, FileText, FileVideo, Image, Loader2, Search, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { useDebouncedCallback } from 'use-debounce';

interface MediaItem {
    id: number;
    name: string;
    file_name: string;
    mime_type: string;
    size: number;
    human_readable_size: string;
    url: string;
    thumbnail: string | null;
    collection_name: string;
    model_type: string | null;
    model_id: number | null;
    created_at: string;
}

interface Props {
    media: PaginatedData<MediaItem>;
    filters: { search?: string; type?: string };
}

function getFileIcon(mimeType: string) {
    if (mimeType.startsWith('image/')) return <FileImage className="h-8 w-8 text-blue-500" />;
    if (mimeType.startsWith('video/')) return <FileVideo className="h-8 w-8 text-purple-500" />;
    if (mimeType.includes('pdf')) return <FileText className="h-8 w-8 text-red-500" />;
    return <File className="h-8 w-8 text-gray-500" />;
}

export default function MediaIndex({ media, filters }: Props) {
    const { t } = useTranslation();
    const [search, setSearch] = useState(filters.search || '');
    const [isSearching, setIsSearching] = useState(false);
    const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; media: MediaItem | null; isLoading: boolean }>({
        open: false,
        media: null,
        isLoading: false,
    });
    const [previewMedia, setPreviewMedia] = useState<MediaItem | null>(null);

    const breadcrumbs: BreadcrumbItem[] = [
        { title: t('admin:breadcrumbs.dashboard'), href: '/dashboard' },
        { title: t('admin:breadcrumbs.media'), href: '/admin/media' },
    ];

    const debouncedSearch = useDebouncedCallback((value: string) => {
        router.get('/admin/media', { search: value, type: filters.type }, {
            preserveState: true,
            onFinish: () => setIsSearching(false),
        });
    }, 300);

    const handleSearchChange = (value: string) => {
        setSearch(value);
        setIsSearching(true);
        debouncedSearch(value);
    };

    const handleTypeChange = (value: string) => {
        router.get('/admin/media', { search, type: value === 'all' ? undefined : value }, {
            preserveState: true,
        });
    };

    const handleDeleteClick = (item: MediaItem) => {
        setDeleteDialog({ open: true, media: item, isLoading: false });
    };

    const handleDeleteConfirm = () => {
        if (!deleteDialog.media) return;

        setDeleteDialog((prev) => ({ ...prev, isLoading: true }));

        router.delete(`/admin/media/${deleteDialog.media.id}`, {
            onSuccess: () => {
                toast.success(t('admin:media.deleted_success'));
                setDeleteDialog({ open: false, media: null, isLoading: false });
            },
            onError: () => {
                toast.error(t('admin:media.deleted_error'));
                setDeleteDialog((prev) => ({ ...prev, isLoading: false }));
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('admin:media.title')} />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">{t('admin:media.title')}</h1>
                </div>

                <Card className="flex-1">
                    <CardContent className="flex flex-col gap-4 px-4">
                        <div className="flex flex-wrap gap-2">
                            <div className="relative w-full sm:w-72">
                                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    placeholder={t('admin:media.search_placeholder')}
                                    value={search}
                                    onChange={(e) => handleSearchChange(e.target.value)}
                                    className="pl-10"
                                />
                                {isSearching && (
                                    <Loader2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-muted-foreground" />
                                )}
                            </div>
                            <Select value={filters.type || 'all'} onValueChange={handleTypeChange}>
                                <SelectTrigger className="w-40">
                                    <SelectValue placeholder={t('admin:media.all_types')} />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">{t('admin:media.all_types')}</SelectItem>
                                    <SelectItem value="image">{t('admin:media.images')}</SelectItem>
                                    <SelectItem value="document">{t('admin:media.documents')}</SelectItem>
                                    <SelectItem value="video">{t('admin:media.videos')}</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {media.data.length === 0 ? (
                            <EmptyState
                                icon={<Image className="h-12 w-12" />}
                                title={t('admin:media.empty_title')}
                                description={search || filters.type ? t('admin:media.empty_search') : t('admin:media.empty_description')}
                            />
                        ) : (
                            <>
                                <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                                    {media.data.map((item) => (
                                        <div
                                            key={item.id}
                                            className="group relative overflow-hidden rounded-lg border bg-card"
                                        >
                                            <div className="aspect-square flex items-center justify-center bg-muted p-4">
                                                {item.thumbnail ? (
                                                    <img
                                                        src={item.thumbnail}
                                                        alt={item.name}
                                                        className="h-full w-full object-cover"
                                                    />
                                                ) : (
                                                    getFileIcon(item.mime_type)
                                                )}
                                            </div>
                                            <div className="p-3">
                                                <p className="truncate text-sm font-medium" title={item.file_name}>
                                                    {item.file_name}
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    {item.human_readable_size}
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    {item.created_at}
                                                </p>
                                            </div>
                                            <div className="absolute inset-0 flex items-center justify-center gap-1 bg-black/60 opacity-0 transition-opacity group-hover:opacity-100">
                                                {item.mime_type.startsWith('image/') && (
                                                    <Button
                                                        variant="secondary"
                                                        size="icon"
                                                        className="h-8 w-8"
                                                        onClick={() => setPreviewMedia(item)}
                                                    >
                                                        <Eye className="h-4 w-4" />
                                                    </Button>
                                                )}
                                                <a href={item.url} download>
                                                    <Button variant="secondary" size="icon" className="h-8 w-8">
                                                        <Download className="h-4 w-4" />
                                                    </Button>
                                                </a>
                                                <Button
                                                    variant="destructive"
                                                    size="icon"
                                                    className="h-8 w-8"
                                                    onClick={() => handleDeleteClick(item)}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <DataTablePagination data={media} />
                            </>
                        )}
                    </CardContent>
                </Card>
            </div>

            <ConfirmDialog
                open={deleteDialog.open}
                onOpenChange={(open) => setDeleteDialog({ open, media: null, isLoading: false })}
                title={t('admin:media.delete_title')}
                description={t('admin:media.delete_description', { name: deleteDialog.media?.file_name })}
                confirmText={t('common:dialog.delete')}
                variant="destructive"
                isLoading={deleteDialog.isLoading}
                onConfirm={handleDeleteConfirm}
            />

            {/* Image Preview Modal */}
            {previewMedia && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
                    onClick={() => setPreviewMedia(null)}
                >
                    <div className="max-h-[90vh] max-w-[90vw]">
                        <img
                            src={previewMedia.url}
                            alt={previewMedia.name}
                            className="max-h-[90vh] max-w-[90vw] object-contain"
                        />
                    </div>
                </div>
            )}
        </AppLayout>
    );
}
