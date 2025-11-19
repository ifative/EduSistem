<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Spatie\MediaLibrary\MediaCollections\Models\Media;

class MediaController extends Controller
{
    public function index(Request $request): Response
    {
        $perPage = $request->input('per_page', 20);

        $media = Media::query()
            ->when($request->search, fn ($query, $search) => $query->where('name', 'like', "%{$search}%")
                ->orWhere('file_name', 'like', "%{$search}%"))
            ->when($request->type, function ($query, $type) {
                return match ($type) {
                    'image' => $query->where('mime_type', 'like', 'image/%'),
                    'document' => $query->whereIn('mime_type', [
                        'application/pdf',
                        'application/msword',
                        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                        'application/vnd.ms-excel',
                        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                    ]),
                    'video' => $query->where('mime_type', 'like', 'video/%'),
                    default => $query,
                };
            })
            ->latest()
            ->paginate($perPage)
            ->through(fn ($item) => [
                'id' => $item->id,
                'name' => $item->name,
                'file_name' => $item->file_name,
                'mime_type' => $item->mime_type,
                'size' => $item->size,
                'human_readable_size' => $item->human_readable_size,
                'url' => $item->getUrl(),
                'thumbnail' => $item->hasGeneratedConversion('thumb')
                    ? $item->getUrl('thumb')
                    : ($this->isImage($item->mime_type) ? $item->getUrl() : null),
                'collection_name' => $item->collection_name,
                'model_type' => $item->model_type ? class_basename($item->model_type) : null,
                'model_id' => $item->model_id,
                'created_at' => $item->created_at->format('Y-m-d H:i'),
            ])
            ->withQueryString();

        return Inertia::render('admin/media/index', [
            'media' => $media,
            'filters' => $request->only(['search', 'type']),
        ]);
    }

    public function destroy(Media $medium): RedirectResponse
    {
        $medium->delete();

        return back()->with('success', 'Media deleted successfully.');
    }

    private function isImage(string $mimeType): bool
    {
        return str_starts_with($mimeType, 'image/');
    }
}
