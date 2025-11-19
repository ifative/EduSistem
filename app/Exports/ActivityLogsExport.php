<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithStyles;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;
use Spatie\Activitylog\Models\Activity;

class ActivityLogsExport implements FromCollection, WithHeadings, WithMapping, ShouldAutoSize, WithStyles
{
    public function collection()
    {
        return Activity::with('causer')->latest()->get();
    }

    public function headings(): array
    {
        return [
            'ID',
            'Log Name',
            'Description',
            'Subject Type',
            'Subject ID',
            'Causer',
            'Properties',
            'Created At',
        ];
    }

    public function map($activity): array
    {
        return [
            $activity->id,
            $activity->log_name,
            $activity->description,
            $activity->subject_type ? class_basename($activity->subject_type) : '-',
            $activity->subject_id ?? '-',
            $activity->causer?->name ?? 'System',
            json_encode($activity->properties->toArray()),
            $activity->created_at->format('Y-m-d H:i:s'),
        ];
    }

    public function styles(Worksheet $sheet): array
    {
        return [
            1 => ['font' => ['bold' => true]],
        ];
    }
}
