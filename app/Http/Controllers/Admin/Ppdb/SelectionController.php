<?php

namespace App\Http\Controllers\Admin\Ppdb;

use App\Http\Controllers\Controller;
use App\Models\Ppdb\AdmissionPath;
use App\Models\Ppdb\AdmissionPeriod;
use App\Models\Ppdb\Registration;
use App\Models\Ppdb\Selection;
use App\Notifications\Ppdb\SelectionResultNotification;
use App\Services\Ppdb\SelectionService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Notification;
use Inertia\Inertia;

class SelectionController extends Controller
{
    public function __construct(
        protected SelectionService $selectionService
    ) {}

    public function index(Request $request)
    {
        $query = Selection::with([
            'registration' => function ($q) {
                $q->with(['path', 'period']);
            },
        ]);

        if ($request->filled('period_id')) {
            $query->whereHas('registration', function ($q) use ($request) {
                $q->where('admission_period_id', $request->period_id);
            });
        }

        if ($request->filled('path_id')) {
            $query->whereHas('registration', function ($q) use ($request) {
                $q->where('admission_path_id', $request->path_id);
            });
        }

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        $selections = $query->orderBy('rank')
            ->paginate(20)
            ->withQueryString();

        $periods = AdmissionPeriod::orderBy('name', 'desc')->get();
        $paths = AdmissionPath::orderBy('name')->get();

        return Inertia::render('admin/ppdb/selections/index', [
            'selections' => $selections,
            'periods' => $periods,
            'paths' => $paths,
            'filters' => $request->only(['period_id', 'path_id', 'status']),
        ]);
    }

    public function run(Request $request)
    {
        $validated = $request->validate([
            'path_id' => 'required|exists:admission_paths,id',
        ]);

        $path = AdmissionPath::findOrFail($validated['path_id']);

        $result = $this->selectionService->runSelection($path);

        return back()->with('success', "Selection completed. {$result['passed']} passed, {$result['failed']} failed, {$result['reserve']} reserve.");
    }

    public function updateStatus(Request $request, Selection $selection)
    {
        $validated = $request->validate([
            'status' => 'required|in:pending,passed,failed,reserve',
            'notes' => 'nullable|string',
        ]);

        $selection->update($validated);

        // Update registration status accordingly
        if ($validated['status'] === 'passed') {
            $selection->registration->update(['status' => 'accepted']);
        } elseif ($validated['status'] === 'failed') {
            $selection->registration->update(['status' => 'rejected']);
        }

        return back()->with('success', 'Selection status updated.');
    }

    public function announce(Request $request)
    {
        $validated = $request->validate([
            'period_id' => 'required|exists:admission_periods,id',
        ]);

        $period = AdmissionPeriod::findOrFail($validated['period_id']);

        // Update period status to announced
        $period->update(['status' => 'announced']);

        // Update all passed registrations
        Registration::where('admission_period_id', $period->id)
            ->whereHas('selection', function ($q) {
                $q->where('status', 'passed');
            })
            ->update(['status' => 'accepted']);

        // Update all failed registrations
        Registration::where('admission_period_id', $period->id)
            ->whereHas('selection', function ($q) {
                $q->where('status', 'failed');
            })
            ->update(['status' => 'rejected']);

        // Send email notifications to all registrations with selections
        $registrations = Registration::where('admission_period_id', $period->id)
            ->whereNotNull('email')
            ->whereHas('selection')
            ->with(['selection', 'path'])
            ->get();

        foreach ($registrations as $registration) {
            Notification::route('mail', $registration->email)
                ->notify(new SelectionResultNotification($registration, $registration->selection));
        }

        return back()->with('success', 'Selection results announced successfully. ' . $registrations->count() . ' emails sent.');
    }

    public function results(Request $request)
    {
        $periodId = $request->period_id;

        if (!$periodId) {
            $period = AdmissionPeriod::active()->first();
            $periodId = $period?->id;
        }

        $paths = [];
        if ($periodId) {
            $paths = AdmissionPath::where('admission_period_id', $periodId)
                ->withCount([
                    'registrations as total_registrations',
                    'registrations as passed_count' => function ($q) {
                        $q->whereHas('selection', fn($s) => $s->where('status', 'passed'));
                    },
                    'registrations as failed_count' => function ($q) {
                        $q->whereHas('selection', fn($s) => $s->where('status', 'failed'));
                    },
                ])
                ->get();
        }

        $periods = AdmissionPeriod::orderBy('name', 'desc')->get();

        return Inertia::render('admin/ppdb/selections/results', [
            'paths' => $paths,
            'periods' => $periods,
            'selectedPeriod' => $periodId,
        ]);
    }
}
