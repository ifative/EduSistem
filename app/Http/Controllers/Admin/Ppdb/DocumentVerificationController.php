<?php

namespace App\Http\Controllers\Admin\Ppdb;

use App\Http\Controllers\Controller;
use App\Models\Ppdb\Registration;
use App\Models\Ppdb\RegistrationDocument;
use App\Notifications\Ppdb\DocumentVerificationNotification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Notification;
use Inertia\Inertia;

class DocumentVerificationController extends Controller
{
    public function index(Request $request)
    {
        $query = RegistrationDocument::with([
            'registration' => function ($q) {
                $q->select('id', 'registration_number', 'name');
            },
            'requirement',
        ]);

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        } else {
            // Default to pending documents
            $query->where('status', 'pending');
        }

        $documents = $query->orderBy('created_at', 'asc')
            ->paginate(20)
            ->withQueryString();

        return Inertia::render('admin/ppdb/documents/index', [
            'documents' => $documents,
            'filters' => $request->only(['status']),
        ]);
    }

    public function verify(Request $request, RegistrationDocument $document)
    {
        $validated = $request->validate([
            'status' => 'required|in:approved,rejected',
            'rejection_reason' => 'required_if:status,rejected|nullable|string',
        ]);

        $document->update([
            'status' => $validated['status'],
            'rejection_reason' => $validated['rejection_reason'] ?? null,
            'verified_by' => auth()->id(),
            'verified_at' => now(),
        ]);

        // Check if all documents are verified for this registration
        $this->checkAllDocumentsVerified($document->registration_id);

        return back()->with('success', 'Document verification updated.');
    }

    public function bulkVerify(Request $request)
    {
        $validated = $request->validate([
            'document_ids' => 'required|array',
            'document_ids.*' => 'exists:registration_documents,id',
            'status' => 'required|in:approved,rejected',
            'rejection_reason' => 'required_if:status,rejected|nullable|string',
        ]);

        RegistrationDocument::whereIn('id', $validated['document_ids'])
            ->update([
                'status' => $validated['status'],
                'rejection_reason' => $validated['rejection_reason'] ?? null,
                'verified_by' => auth()->id(),
                'verified_at' => now(),
            ]);

        // Check registrations for each updated document
        $registrationIds = RegistrationDocument::whereIn('id', $validated['document_ids'])
            ->pluck('registration_id')
            ->unique();

        foreach ($registrationIds as $registrationId) {
            $this->checkAllDocumentsVerified($registrationId);
        }

        return back()->with('success', 'Documents verified successfully.');
    }

    private function checkAllDocumentsVerified(int $registrationId): void
    {
        $registration = Registration::find($registrationId);

        if (!$registration) {
            return;
        }

        $pendingDocuments = $registration->documents()->where('status', 'pending')->count();
        $rejectedDocuments = $registration->documents()->where('status', 'rejected')->count();

        if ($pendingDocuments === 0) {
            if ($rejectedDocuments > 0) {
                // Some documents rejected, need revision
                $registration->update(['status' => 'revision']);

                // Send email notification
                if ($registration->email) {
                    $rejectedDocs = $registration->documents()
                        ->where('status', 'rejected')
                        ->pluck('rejection_reason')
                        ->filter()
                        ->implode('; ');

                    Notification::route('mail', $registration->email)
                        ->notify(new DocumentVerificationNotification($registration, 'revision', $rejectedDocs));
                }
            } elseif ($registration->status === 'submitted') {
                // All documents approved
                $registration->update([
                    'status' => 'verified',
                    'verified_at' => now(),
                    'verified_by' => auth()->id(),
                ]);

                // Send email notification
                if ($registration->email) {
                    Notification::route('mail', $registration->email)
                        ->notify(new DocumentVerificationNotification($registration, 'verified'));
                }
            }
        }
    }
}
