<?php

namespace App\Exports;

use App\Models\Master\Student;
use App\Models\Master\Semester;
use Maatwebsite\Excel\Concerns\FromQuery;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;

class StudentsExport implements FromQuery, WithHeadings, WithMapping, ShouldAutoSize
{
    protected array $filters;

    public function __construct(array $filters = [])
    {
        $this->filters = $filters;
    }

    public function query()
    {
        $query = Student::query()
            ->with(['classrooms' => function ($q) {
                $activeSemester = Semester::getActive();
                if ($activeSemester) {
                    $q->wherePivot('semester_id', $activeSemester->id);
                }
            }]);

        if (!empty($this->filters['search'])) {
            $search = $this->filters['search'];
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('nis', 'like', "%{$search}%")
                    ->orWhere('nisn', 'like', "%{$search}%");
            });
        }

        if (!empty($this->filters['status'])) {
            $query->where('status', $this->filters['status']);
        }

        return $query->orderBy('name');
    }

    public function headings(): array
    {
        return [
            'NIS',
            'NISN',
            'Name',
            'Gender',
            'Birth Place',
            'Birth Date',
            'Religion',
            'Phone',
            'Address',
            'Parent Name',
            'Parent Phone',
            'Parent Email',
            'Entry Year',
            'Previous School',
            'Status',
            'Current Classroom',
        ];
    }

    public function map($student): array
    {
        $classroom = $student->classrooms->first();

        return [
            $student->nis,
            $student->nisn,
            $student->name,
            ucfirst($student->gender),
            $student->birth_place,
            $student->birth_date->format('Y-m-d'),
            $student->religion,
            $student->phone,
            $student->address,
            $student->parent_name,
            $student->parent_phone,
            $student->parent_email,
            $student->entry_year,
            $student->previous_school,
            ucfirst($student->status),
            $classroom ? $classroom->name : '-',
        ];
    }
}
