<?php

namespace App\Services\Ppdb;

use App\Models\Ppdb\AdmissionPath;
use App\Models\Ppdb\Registration;
use App\Models\Ppdb\RegistrationAchievement;
use App\Models\Ppdb\Selection;

class SelectionService
{
    /**
     * Run selection for a specific admission path
     */
    public function runSelection(AdmissionPath $path): array
    {
        // Get all verified registrations for this path
        $registrations = Registration::where('admission_path_id', $path->id)
            ->where('status', 'verified')
            ->with(['scores', 'achievements'])
            ->get();

        $results = ['passed' => 0, 'failed' => 0, 'reserve' => 0];

        // Calculate scores for each registration
        $scoredRegistrations = $registrations->map(function ($registration) use ($path) {
            $scoreBreakdown = $this->calculateScore($registration, $path);
            return [
                'registration' => $registration,
                'final_score' => $scoreBreakdown['total'],
                'score_breakdown' => $scoreBreakdown,
            ];
        });

        // Sort by final score descending
        $scoredRegistrations = $scoredRegistrations->sortByDesc('final_score')->values();

        // Assign ranks and determine pass/fail
        $quota = $path->quota;
        $reserveQuota = (int) ceil($quota * 0.1); // 10% reserve

        foreach ($scoredRegistrations as $index => $item) {
            $rank = $index + 1;
            $status = 'failed';

            if ($rank <= $quota) {
                $status = 'passed';
                $results['passed']++;
            } elseif ($rank <= $quota + $reserveQuota) {
                $status = 'reserve';
                $results['reserve']++;
            } else {
                $results['failed']++;
            }

            // Create or update selection record
            Selection::updateOrCreate(
                ['registration_id' => $item['registration']->id],
                [
                    'final_score' => $item['final_score'],
                    'rank' => $rank,
                    'status' => $status,
                    'score_breakdown' => $item['score_breakdown'],
                ]
            );
        }

        return $results;
    }

    /**
     * Calculate score based on path type
     */
    protected function calculateScore(Registration $registration, AdmissionPath $path): array
    {
        return match ($path->type) {
            'zonasi' => $this->calculateZonasiScore($registration, $path),
            'prestasi' => $this->calculatePrestasiScore($registration, $path),
            'afirmasi' => $this->calculateAfirmasiScore($registration, $path),
            default => $this->calculateRegulerScore($registration, $path),
        };
    }

    /**
     * Calculate score for Zonasi (distance-based) path
     * Priority: distance (closer = higher score)
     */
    protected function calculateZonasiScore(Registration $registration, AdmissionPath $path): array
    {
        $maxDistance = $path->max_distance ?? 10; // Default 10km
        $distance = $registration->distance ?? $maxDistance;

        // Distance score: 100 points for 0km, decreasing linearly
        $distanceScore = max(0, 100 - ($distance / $maxDistance * 100));

        // Age score: older students get slight priority (max 10 points)
        $ageScore = $this->calculateAgeScore($registration);

        return [
            'distance_score' => round($distanceScore, 2),
            'age_score' => round($ageScore, 2),
            'total' => round($distanceScore + $ageScore, 2),
        ];
    }

    /**
     * Calculate score for Prestasi (achievement) path
     * Based on academic scores and achievements/certificates
     */
    protected function calculatePrestasiScore(Registration $registration, AdmissionPath $path): array
    {
        // Academic score (from rapor/test scores)
        $academicScore = $this->calculateAcademicScore($registration);

        // Achievement score (from certificates/competitions)
        $achievementScore = $this->calculateAchievementScore($registration);

        // Weight: 60% academic, 40% achievement
        $total = ($academicScore * 0.6) + ($achievementScore * 0.4);

        return [
            'academic_score' => round($academicScore, 2),
            'achievement_score' => round($achievementScore, 2),
            'total' => round($total, 2),
        ];
    }

    /**
     * Calculate score for Afirmasi (affirmation) path
     * For disadvantaged students, priority based on economic/social factors
     */
    protected function calculateAfirmasiScore(Registration $registration, AdmissionPath $path): array
    {
        // Basic academic score
        $academicScore = $this->calculateAcademicScore($registration);

        // Distance score (also considered for afirmasi)
        $maxDistance = $path->max_distance ?? 10;
        $distance = $registration->distance ?? $maxDistance;
        $distanceScore = max(0, 100 - ($distance / $maxDistance * 100));

        // Weight: 70% academic, 30% distance
        $total = ($academicScore * 0.7) + ($distanceScore * 0.3);

        return [
            'academic_score' => round($academicScore, 2),
            'distance_score' => round($distanceScore, 2),
            'total' => round($total, 2),
        ];
    }

    /**
     * Calculate score for regular path
     */
    protected function calculateRegulerScore(Registration $registration, AdmissionPath $path): array
    {
        $academicScore = $this->calculateAcademicScore($registration);
        $ageScore = $this->calculateAgeScore($registration);

        $total = ($academicScore * 0.9) + ($ageScore * 0.1);

        return [
            'academic_score' => round($academicScore, 2),
            'age_score' => round($ageScore, 2),
            'total' => round($total, 2),
        ];
    }

    /**
     * Calculate academic score from registration scores
     */
    protected function calculateAcademicScore(Registration $registration): float
    {
        $scores = $registration->scores;

        if ($scores->isEmpty()) {
            return 0;
        }

        return $scores->avg('score') ?? 0;
    }

    /**
     * Calculate achievement score from certificates/competitions
     */
    protected function calculateAchievementScore(Registration $registration): float
    {
        $achievements = $registration->achievements;

        if ($achievements->isEmpty()) {
            return 0;
        }

        // Sum all achievement points, max 100
        $totalPoints = $achievements->sum('points');

        return min(100, $totalPoints);
    }

    /**
     * Calculate age score (older students get slight priority)
     */
    protected function calculateAgeScore(Registration $registration): float
    {
        if (!$registration->birth_date) {
            return 0;
        }

        $age = $registration->birth_date->age;

        // Score: 10 points for age 15+, decreasing for younger
        return min(10, max(0, $age - 5));
    }
}
