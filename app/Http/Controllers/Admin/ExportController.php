<?php

namespace App\Http\Controllers\Admin;

use App\Exports\ActivityLogsExport;
use App\Exports\RolesExport;
use App\Exports\UsersExport;
use App\Http\Controllers\Controller;
use Maatwebsite\Excel\Facades\Excel;
use Symfony\Component\HttpFoundation\BinaryFileResponse;

class ExportController extends Controller
{
    public function users(): BinaryFileResponse
    {
        return Excel::download(new UsersExport, 'users-'.now()->format('Y-m-d').'.xlsx');
    }

    public function roles(): BinaryFileResponse
    {
        return Excel::download(new RolesExport, 'roles-'.now()->format('Y-m-d').'.xlsx');
    }

    public function activityLogs(): BinaryFileResponse
    {
        return Excel::download(new ActivityLogsExport, 'activity-logs-'.now()->format('Y-m-d').'.xlsx');
    }
}
