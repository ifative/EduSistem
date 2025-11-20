import { Button } from '@/components/ui/button';
import { router } from '@inertiajs/react';
import { Camera, Loader2, Trash2, User } from 'lucide-react';
import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

interface AvatarUploadProps {
    currentAvatar?: string;
    userName: string;
}

export function AvatarUpload({ currentAvatar, userName }: AvatarUploadProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [preview, setPreview] = useState<string | null>(null);
    const { t } = useTranslation('common');

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
            toast.error(t('settings.select_image'));
            return;
        }

        // Validate file size (2MB)
        if (file.size > 2 * 1024 * 1024) {
            toast.error(t('settings.image_too_large'));
            return;
        }

        // Show preview
        const reader = new FileReader();
        reader.onload = (e) => {
            setPreview(e.target?.result as string);
        };
        reader.readAsDataURL(file);

        // Upload file
        setIsUploading(true);
        const formData = new FormData();
        formData.append('avatar', file);

        router.post('/settings/profile/avatar', formData, {
            forceFormData: true,
            onSuccess: () => {
                toast.success(t('settings.avatar_updated'));
                setPreview(null);
            },
            onError: (errors) => {
                toast.error(errors.avatar || t('settings.avatar_update_error'));
                setPreview(null);
            },
            onFinish: () => {
                setIsUploading(false);
                if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                }
            },
        });
    };

    const handleDelete = () => {
        setIsDeleting(true);
        router.delete('/settings/profile/avatar', {
            onSuccess: () => {
                toast.success(t('settings.avatar_removed'));
            },
            onError: () => {
                toast.error(t('settings.avatar_remove_error'));
            },
            onFinish: () => {
                setIsDeleting(false);
            },
        });
    };

    const displayImage = preview || currentAvatar;

    return (
        <div className="flex items-center gap-4">
            <div className="relative">
                <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-full bg-muted">
                    {displayImage ? (
                        <img
                            src={displayImage}
                            alt={userName}
                            className="h-full w-full object-cover"
                        />
                    ) : (
                        <User className="h-8 w-8 text-muted-foreground" />
                    )}
                </div>
                {isUploading && (
                    <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50">
                        <Loader2 className="h-6 w-6 animate-spin text-white" />
                    </div>
                )}
            </div>

            <div className="flex flex-col gap-2">
                <div className="flex gap-2">
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isUploading || isDeleting}
                    >
                        <Camera className="mr-2 h-4 w-4" />
                        {currentAvatar ? t('settings.change') : t('actions.update')}
                    </Button>
                    {currentAvatar && (
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={handleDelete}
                            disabled={isUploading || isDeleting}
                        >
                            {isDeleting ? (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : (
                                <Trash2 className="mr-2 h-4 w-4" />
                            )}
                            {t('settings.remove')}
                        </Button>
                    )}
                </div>
                <p className="text-xs text-muted-foreground">
                    {t('settings.avatar_hint')}
                </p>
            </div>

            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
            />
        </div>
    );
}
