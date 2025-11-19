# PPDB Module (Student Admission)

Online student registration and selection system (Penerimaan Peserta Didik Baru).

## Overview

Complete admission workflow:
1. Admin creates admission period
2. Public registration opens
3. Applicants submit documents
4. Staff verifies documents
5. System runs selection
6. Results announced
7. Accepted students re-register
8. Payment processed

## Database Tables

### Configuration

#### `admission_periods`
| Column | Type | Description |
|--------|------|-------------|
| id | bigint | Primary key |
| academic_year_id | foreign | Target year |
| name | string | Period name |
| start_date | datetime | Registration opens |
| end_date | datetime | Registration closes |
| quota | integer | Total slots |
| registration_fee | decimal | Fee amount |
| is_active | boolean | Currently active |

#### `admission_paths`
| Column | Type | Description |
|--------|------|-------------|
| id | bigint | Primary key |
| period_id | foreign | Admission period |
| name | string | e.g., "Zonasi" |
| type | enum | zonasi/achievement/affirmation |
| quota | integer | Slots for this path |
| description | text | Requirements |

#### `admission_requirements`
| Column | Type | Description |
|--------|------|-------------|
| id | bigint | Primary key |
| period_id | foreign | Admission period |
| name | string | e.g., "Birth Certificate" |
| is_required | boolean | Mandatory document |
| file_type | string | pdf/image/any |

### Registrations

#### `registrations`
| Column | Type | Description |
|--------|------|-------------|
| id | bigint | Primary key |
| period_id | foreign | Admission period |
| path_id | foreign | Selected path |
| registration_number | string | Auto-generated |
| name | string | Applicant name |
| nisn | string | National ID |
| gender | enum | male/female |
| birth_place | string | Birth place |
| birth_date | date | Birth date |
| previous_school | string | Origin school |
| address | text | Home address |
| distance_km | decimal | Distance to school |
| parent_name | string | Parent name |
| parent_phone | string | Contact |
| parent_email | string | Email |
| status | enum | See status flow |
| created_at | timestamp | Submitted at |

**Status Flow:**
- `pending` → Initial submission
- `verified` → Documents approved
- `accepted` → Passed selection
- `rejected` → Failed selection
- `enrolled` → Completed re-registration

#### `registration_documents`
| Column | Type | Description |
|--------|------|-------------|
| id | bigint | Primary key |
| registration_id | foreign | Registration |
| requirement_id | foreign | Document type |
| file_path | string | Uploaded file |
| status | enum | pending/approved/rejected |
| notes | text | Verification notes |

#### `registration_scores`
| Column | Type | Description |
|--------|------|-------------|
| id | bigint | Primary key |
| registration_id | foreign | Registration |
| subject | string | Subject name |
| score | decimal | Grade/score |

#### `registration_achievements`
| Column | Type | Description |
|--------|------|-------------|
| id | bigint | Primary key |
| registration_id | foreign | Registration |
| name | string | Achievement name |
| level | enum | school/district/province/national/international |
| year | year | Achievement year |
| certificate | string | Certificate file |

### Selection & Payment

#### `admission_selections`
| Column | Type | Description |
|--------|------|-------------|
| id | bigint | Primary key |
| period_id | foreign | Period |
| path_id | foreign | Path |
| selected_at | timestamp | When selection ran |
| announced_at | timestamp | When published |

#### `admission_payments`
| Column | Type | Description |
|--------|------|-------------|
| id | bigint | Primary key |
| registration_id | foreign | Registration |
| amount | decimal | Payment amount |
| method | string | Payment method |
| status | enum | pending/paid/failed |
| paid_at | timestamp | Payment time |
| reference | string | Transaction ref |

## Features

### Admin Features

#### Period Management
- Create admission periods
- Set dates and quotas
- Configure registration fee
- Activate/deactivate periods

#### Path Configuration
- Create selection paths
- Set path quotas
- Define criteria per path:
  - **Zonasi**: Distance-based
  - **Achievement**: Score + certificates
  - **Affirmation**: Special criteria

#### Document Requirements
- Define required documents
- Set file type restrictions
- Mark as mandatory/optional

#### Verification
- List pending registrations
- Preview uploaded documents
- Approve/reject with notes
- Bulk verification

#### Selection
- Run selection algorithm
- Preview results before publish
- Publish results
- Send notifications

#### Reports
- Registration statistics
- Demographics
- Path distribution
- Payment status

### Public Features

#### Online Registration
- Multi-step form
- Document upload
- Save & continue
- Print registration proof

#### Status Check
- Enter registration number
- View current status
- View selection result
- Re-registration instructions

### Selection Algorithms

#### Zonasi (Distance-based)
```
Score = MAX_DISTANCE - actual_distance
Sort by score DESC
Select top N based on quota
```

#### Achievement (Merit-based)
```
Score = (average_grade * 0.6) + (achievement_points * 0.4)

Achievement points:
- International: 100
- National: 80
- Province: 60
- District: 40
- School: 20

Sort by score DESC
Select top N based on quota
```

#### Affirmation
```
Filter by criteria (economic, disability, etc.)
Sort by submission time
Select top N based on quota
```

## Notifications

| Event | Recipients | Channel |
|-------|------------|---------|
| Registration received | Applicant | Email, SMS |
| Document rejected | Applicant | Email |
| Selection result | Applicant | Email, SMS |
| Payment reminder | Accepted | Email |
| Enrollment confirmed | Applicant | Email |

## API Endpoints

```
# Public
POST   /api/ppdb/register
GET    /api/ppdb/status/{registration_number}
POST   /api/ppdb/documents

# Admin
GET    /api/ppdb/periods
POST   /api/ppdb/periods
PUT    /api/ppdb/periods/{id}

GET    /api/ppdb/registrations
GET    /api/ppdb/registrations/{id}
PUT    /api/ppdb/registrations/{id}/verify
PUT    /api/ppdb/registrations/{id}/documents/{doc_id}

POST   /api/ppdb/selection/run
POST   /api/ppdb/selection/publish

GET    /api/ppdb/reports/statistics
GET    /api/ppdb/reports/export
```

## Permissions

```
ppdb.periods.view
ppdb.periods.create
ppdb.periods.edit
ppdb.periods.delete

ppdb.registrations.view
ppdb.registrations.verify

ppdb.selection.run
ppdb.selection.publish

ppdb.payments.view
ppdb.payments.confirm

ppdb.reports.view
ppdb.reports.export
```
