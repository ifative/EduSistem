<?php

namespace App\Http\Controllers\Ppdb;

use App\Http\Controllers\Controller;
use App\Models\Master\Level;
use App\Models\Master\Major;
use App\Models\Ppdb\AdmissionPath;
use App\Models\Ppdb\AdmissionPayment;
use App\Models\Ppdb\AdmissionPeriod;
use App\Models\Ppdb\Registration;
use App\Models\Ppdb\RegistrationAchievement;
use App\Models\Ppdb\RegistrationDocument;
use App\Models\Ppdb\RegistrationScore;
use App\Notifications\Ppdb\RegistrationSubmittedNotification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class PublicRegistrationController extends Controller
{
    public function index()
    {
        $period = AdmissionPeriod::active()
            ->with(['paths' => function ($q) {
                $q->where('is_active', true)->orderBy('sort_order');
            }])
            ->first();

        if (!$period || $period->status !== 'open') {
            return Inertia::render('ppdb/closed', [
                'period' => $period,
            ]);
        }

        return Inertia::render('ppdb/register', [
            'period' => $period,
            'paths' => $period->paths,
            'levels' => Level::where('is_active', true)->orderBy('order')->get(),
            'majors' => Major::where('is_active', true)->orderBy('name')->get(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'admission_path_id' => 'required|exists:admission_paths,id',
            'level_id' => 'nullable|exists:levels,id',
            'major_id' => 'nullable|exists:majors,id',
            'nisn' => 'nullable|string|max:20',
            'nik' => 'nullable|string|max:20',
            'name' => 'required|string|max:255',
            'gender' => 'required|in:male,female',
            'birth_place' => 'required|string|max:100',
            'birth_date' => 'required|date',
            'religion' => 'nullable|string|max:50',
            'address' => 'required|string',
            'village' => 'nullable|string|max:100',
            'district' => 'nullable|string|max:100',
            'city' => 'nullable|string|max:100',
            'province' => 'nullable|string|max:100',
            'postal_code' => 'nullable|string|max:10',
            'phone' => 'nullable|string|max:20',
            'email' => 'nullable|email|max:255',
            'previous_school' => 'nullable|string|max:255',
            'previous_school_address' => 'nullable|string',
            'graduation_year' => 'nullable|integer|min:2000|max:2100',
            'father_name' => 'nullable|string|max:255',
            'father_occupation' => 'nullable|string|max:100',
            'father_phone' => 'nullable|string|max:20',
            'mother_name' => 'nullable|string|max:255',
            'mother_occupation' => 'nullable|string|max:100',
            'mother_phone' => 'nullable|string|max:20',
            'guardian_name' => 'nullable|string|max:255',
            'guardian_phone' => 'nullable|string|max:20',
            'latitude' => 'nullable|numeric',
            'longitude' => 'nullable|numeric',
        ]);

        $path = AdmissionPath::findOrFail($validated['admission_path_id']);
        $period = $path->period;

        // Check if period is open
        if ($period->status !== 'open') {
            return back()->withErrors(['error' => 'Registration period is closed.']);
        }

        DB::beginTransaction();
        try {
            // Generate registration number
            $validated['registration_number'] = Registration::generateRegistrationNumber($period->id);
            $validated['admission_period_id'] = $period->id;
            $validated['status'] = 'draft';

            // Calculate distance if coordinates provided
            if (!empty($validated['latitude']) && !empty($validated['longitude'])) {
                // School coordinates (should be from settings)
                $schoolLat = -6.2088; // Example: Jakarta
                $schoolLng = 106.8456;
                $validated['distance'] = $this->calculateDistance(
                    $validated['latitude'],
                    $validated['longitude'],
                    $schoolLat,
                    $schoolLng
                );
            }

            $registration = Registration::create($validated);

            DB::commit();

            // Send email notification if email is provided
            if ($registration->email) {
                $registration->load(['period', 'path']);
                Notification::route('mail', $registration->email)
                    ->notify(new RegistrationSubmittedNotification($registration));
            }

            return redirect()->route('ppdb.success', ['registration' => $registration->registration_number]);
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withErrors(['error' => 'Registration failed. Please try again.']);
        }
    }

    public function success(string $registration)
    {
        $reg = Registration::where('registration_number', $registration)
            ->with(['period', 'path'])
            ->firstOrFail();

        return Inertia::render('ppdb/success', [
            'registration' => $reg,
        ]);
    }

    public function check()
    {
        return Inertia::render('ppdb/check');
    }

    public function status(Request $request)
    {
        $validated = $request->validate([
            'registration_number' => 'required|string',
            'birth_date' => 'required|date',
        ]);

        $registration = Registration::where('registration_number', $validated['registration_number'])
            ->whereDate('birth_date', $validated['birth_date'])
            ->with([
                'period',
                'path',
                'documents.requirement',
                'selection',
                'payments',
            ])
            ->first();

        if (!$registration) {
            return back()->withErrors(['error' => 'Registration not found. Please check your details.']);
        }

        return Inertia::render('ppdb/status', [
            'registration' => $registration,
        ]);
    }

    public function uploadDocument(Request $request, Registration $registration)
    {
        $validated = $request->validate([
            'requirement_id' => 'required|exists:admission_requirements,id',
            'file' => 'required|file|max:5120', // 5MB max
        ]);

        $file = $request->file('file');
        $path = $file->store('ppdb/documents/' . $registration->id, 'public');

        RegistrationDocument::updateOrCreate(
            [
                'registration_id' => $registration->id,
                'requirement_id' => $validated['requirement_id'],
            ],
            [
                'file_path' => $path,
                'file_name' => $file->getClientOriginalName(),
                'file_type' => $file->getClientMimeType(),
                'file_size' => $file->getSize(),
                'status' => 'pending',
            ]
        );

        return back()->with('success', 'Document uploaded successfully.');
    }

    public function addScore(Request $request, Registration $registration)
    {
        $validated = $request->validate([
            'subject' => 'required|string|max:100',
            'score' => 'required|numeric|min:0|max:100',
            'type' => 'required|in:rapor,ujian,test',
            'semester' => 'nullable|string|max:50',
        ]);

        $validated['registration_id'] = $registration->id;
        RegistrationScore::create($validated);

        return back()->with('success', 'Score added successfully.');
    }

    public function addAchievement(Request $request, Registration $registration)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'type' => 'required|in:academic,non_academic,sports,arts,other',
            'level' => 'required|in:school,district,city,province,national,international',
            'rank' => 'required|in:participant,finalist,third,second,first',
            'year' => 'required|integer|min:2000|max:2100',
            'organizer' => 'nullable|string|max:255',
            'certificate' => 'nullable|file|max:2048',
        ]);

        $validated['registration_id'] = $registration->id;
        $validated['points'] = RegistrationAchievement::calculatePoints($validated['level'], $validated['rank']);

        if ($request->hasFile('certificate')) {
            $file = $request->file('certificate');
            $validated['certificate_path'] = $file->store('ppdb/achievements/' . $registration->id, 'public');
        }

        unset($validated['certificate']);
        RegistrationAchievement::create($validated);

        return back()->with('success', 'Achievement added successfully.');
    }

    public function submit(Registration $registration)
    {
        if ($registration->status !== 'draft') {
            return back()->withErrors(['error' => 'Registration already submitted.']);
        }

        $registration->update([
            'status' => 'submitted',
            'submitted_at' => now(),
        ]);

        return back()->with('success', 'Registration submitted successfully.');
    }

    /**
     * Calculate distance between two coordinates using Haversine formula
     */
    private function calculateDistance(float $lat1, float $lon1, float $lat2, float $lon2): float
    {
        $earthRadius = 6371; // km

        $dLat = deg2rad($lat2 - $lat1);
        $dLon = deg2rad($lon2 - $lon1);

        $a = sin($dLat / 2) * sin($dLat / 2) +
            cos(deg2rad($lat1)) * cos(deg2rad($lat2)) *
            sin($dLon / 2) * sin($dLon / 2);

        $c = 2 * atan2(sqrt($a), sqrt(1 - $a));

        return round($earthRadius * $c, 2);
    }
}
