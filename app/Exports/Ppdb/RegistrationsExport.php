<?php

namespace App\Exports\Ppdb;

use App\Models\Ppdb\Registration;
use Maatwebsite\Excel\Concerns\FromQuery;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;

class RegistrationsExport implements FromQuery, WithHeadings, WithMapping, ShouldAutoSize
{
    protected array $filters;

    public function __construct(array $filters = [])
    {
        $this->filters = $filters;
    }

    public function query()
    {
        $query = Registration::query()
            ->with(['period', 'path', 'level', 'major', 'selection']);

        if (!empty($this->filters['search'])) {
            $search = $this->filters['search'];
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('registration_number', 'like', "%{$search}%")
                    ->orWhere('nisn', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%");
            });
        }

        if (!empty($this->filters['period_id'])) {
            $query->where('admission_period_id', $this->filters['period_id']);
        }

        if (!empty($this->filters['path_id'])) {
            $query->where('admission_path_id', $this->filters['path_id']);
        }

        if (!empty($this->filters['status'])) {
            $query->where('status', $this->filters['status']);
        }

        return $query->orderBy('registration_number');
    }

    public function headings(): array
    {
        return [
            'Registration Number',
            'Period',
            'Path',
            'Name',
            'NISN',
            'NIK',
            'Gender',
            'Birth Place',
            'Birth Date',
            'Religion',
            'Address',
            'Village',
            'District',
            'City',
            'Province',
            'Postal Code',
            'Phone',
            'Email',
            'Father Name',
            'Father Occupation',
            'Father Phone',
            'Mother Name',
            'Mother Occupation',
            'Mother Phone',
            'Guardian Name',
            'Guardian Phone',
            'Previous School',
            'Graduation Year',
            'Level',
            'Major',
            'Status',
            'Selection Status',
            'Final Score',
            'Rank',
            'Registered At',
        ];
    }

    public function map($registration): array
    {
        return [
            $registration->registration_number,
            $registration->period?->name ?? '-',
            $registration->path?->name ?? '-',
            $registration->name,
            $registration->nisn ?? '-',
            $registration->nik ?? '-',
            ucfirst($registration->gender),
            $registration->birth_place,
            $registration->birth_date?->format('Y-m-d'),
            $registration->religion ?? '-',
            $registration->address,
            $registration->village ?? '-',
            $registration->district ?? '-',
            $registration->city ?? '-',
            $registration->province ?? '-',
            $registration->postal_code ?? '-',
            $registration->phone ?? '-',
            $registration->email ?? '-',
            $registration->father_name ?? '-',
            $registration->father_occupation ?? '-',
            $registration->father_phone ?? '-',
            $registration->mother_name ?? '-',
            $registration->mother_occupation ?? '-',
            $registration->mother_phone ?? '-',
            $registration->guardian_name ?? '-',
            $registration->guardian_phone ?? '-',
            $registration->previous_school ?? '-',
            $registration->graduation_year ?? '-',
            $registration->level?->name ?? '-',
            $registration->major?->name ?? '-',
            ucfirst($registration->status),
            $registration->selection?->status ? ucfirst($registration->selection->status) : '-',
            $registration->selection?->final_score ?? '-',
            $registration->selection?->rank ?? '-',
            $registration->created_at?->format('Y-m-d H:i:s'),
        ];
    }
}
