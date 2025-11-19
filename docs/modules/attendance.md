# Attendance Module

Daily attendance tracking with multiple input methods and leave management.

## Overview

Comprehensive attendance system supporting:
- Manual entry by teacher
- QR code scanning
- Face recognition (optional)
- Leave/permit management

## Database Tables

### Attendance Records

#### `attendances`
| Column | Type | Description |
|--------|------|-------------|
| id | bigint | Primary key |
| classroom_id | foreign | Classroom |
| student_id | foreign | Student |
| date | date | Attendance date |
| status | enum | present/sick/permit/absent |
| check_in_time | time | Arrival time |
| check_out_time | time | Departure time |
| method | enum | manual/qr/face |
| notes | text | Additional notes |
| recorded_by | foreign | Teacher/staff |
| created_at | timestamp | Record time |

### Leave Management

#### `attendance_permits`
| Column | Type | Description |
|--------|------|-------------|
| id | bigint | Primary key |
| student_id | foreign | Student |
| type | enum | sick/permission/dispensation |
| start_date | date | Leave start |
| end_date | date | Leave end |
| reason | text | Reason |
| attachment | string | Supporting document |
| status | enum | pending/approved/rejected |
| approved_by | foreign | Approving teacher |
| approved_at | timestamp | Approval time |
| notes | text | Approval notes |

### Configuration

#### `attendance_settings`
| Column | Type | Description |
|--------|------|-------------|
| id | bigint | Primary key |
| academic_year_id | foreign | Academic year |
| check_in_start | time | Check-in window start |
| check_in_end | time | Late after this time |
| check_out_start | time | Check-out window |
| minimum_attendance | integer | Min % for promotion |
| qr_enabled | boolean | QR scanning active |
| face_enabled | boolean | Face recognition active |

## Features

### Teacher Features

#### Daily Attendance
- Select classroom
- View student list
- Mark attendance per student:
  - **Present**: Normal attendance
  - **Sick**: Illness (with/without note)
  - **Permit**: Approved leave
  - **Absent**: Unexcused absence
- Add notes for individual students
- Submit for entire class

#### QR Code Mode
- Generate daily QR code
- Students scan on entry
- Auto-records timestamp
- Manual override available

#### Leave Approval
- View permit requests
- Check attachments (doctor's note, parent letter)
- Approve or reject
- Auto-updates attendance records

### Student Features

#### Check-in
- Scan classroom QR code
- View today's status
- Request leave permit

#### Permit Request
- Submit leave request
- Upload supporting documents
- Track request status
- View history

### Admin Features

#### Reports
- Daily attendance summary
- Class attendance rates
- Student attendance history
- Absence patterns
- Monthly/semester reports

#### Bulk Operations
- Import attendance from Excel
- Export attendance data
- Generate absence letters

### Parent Features

#### Monitoring
- View child's attendance
- Real-time absence notifications
- Submit permit requests
- View attendance history

## Attendance Calculation

```
Attendance Rate = (Present Days / Total School Days) × 100

Present Days = days with status 'present' OR 'permit'
Total School Days = all scheduled school days in period

Minimum Attendance for Promotion: 75%
```

## Notifications

| Event | Recipients | Channel |
|-------|------------|---------|
| Daily absence | Parents | SMS, WhatsApp |
| Permit approved | Parents, Student | App notification |
| Low attendance warning | Parents, Homeroom | Email |
| Weekly summary | Parents | Email |

## API Endpoints

```
# Teacher
GET    /api/attendance/classrooms/{id}/students
POST   /api/attendance/record
PUT    /api/attendance/{id}
GET    /api/attendance/daily/{classroom_id}/{date}

# Permits
GET    /api/attendance/permits
POST   /api/attendance/permits
GET    /api/attendance/permits/{id}
PUT    /api/attendance/permits/{id}/approve
PUT    /api/attendance/permits/{id}/reject

# Student
POST   /api/attendance/check-in
GET    /api/attendance/my-history
POST   /api/attendance/permits

# Reports
GET    /api/attendance/reports/daily
GET    /api/attendance/reports/student/{id}
GET    /api/attendance/reports/classroom/{id}
GET    /api/attendance/reports/export
```

## Permissions

```
attendance.view
attendance.create
attendance.edit
attendance.delete

attendance.permits.view
attendance.permits.create
attendance.permits.approve

attendance.reports.view
attendance.reports.export

attendance.settings.view
attendance.settings.edit
```

## Integration

### QR Code System
- Daily rotating codes per classroom
- Encrypted with date + classroom ID
- Valid only during check-in window
- Prevents screenshot sharing

### Face Recognition (Optional)
- Uses device camera
- Liveness detection
- Matches against student photo database
- Requires initial enrollment
