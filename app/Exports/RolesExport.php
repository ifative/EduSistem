<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithStyles;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;
use Spatie\Permission\Models\Role;

class RolesExport implements FromCollection, WithHeadings, WithMapping, ShouldAutoSize, WithStyles
{
    public function collection()
    {
        return Role::with('permissions')->get();
    }

    public function headings(): array
    {
        return [
            'ID',
            'Name',
            'Guard',
            'Permissions',
            'Permission Count',
            'Created At',
        ];
    }

    public function map($role): array
    {
        return [
            $role->id,
            $role->name,
            $role->guard_name,
            $role->permissions->pluck('name')->implode(', '),
            $role->permissions->count(),
            $role->created_at->format('Y-m-d H:i:s'),
        ];
    }

    public function styles(Worksheet $sheet): array
    {
        return [
            1 => ['font' => ['bold' => true]],
        ];
    }
}
