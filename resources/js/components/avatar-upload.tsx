import { Button } from '@/components/ui/button';
import { router } from '@inertiajs/react';
import { Camera, Loader2, Trash2, User } from 'lucide-react';
import { useRef, useState } from 'react';
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

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
            toast.error('Please select an image file');
            return;
        }

        // Validate file size (2MB)
        if (file.size > 2 * 1024 * 1024) {
            toast.error('Image must be less than 2MB');
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
                toast.success('Avatar updated successfully');
                setPreview(null);
            },
            onError: (errors) => {
                toast.error(errors.avatar || 'Failed to upload avatar');
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
                toast.success('Avatar removed successfully');
            },
            onError: () => {
                toast.error('Failed to remove avatar');
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
                        {currentAvatar ? 'Change' : 'Upload'}
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
                            Remove
                        </Button>
                    )}
                </div>
                <p className="text-xs text-muted-foreground">
                    JPG, PNG or GIF. Max 2MB.
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
