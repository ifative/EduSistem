import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Spinner } from '@/components/ui/spinner';
import { Textarea } from '@/components/ui/textarea';
import GuestLayout from '@/layouts/guest-layout';
import ppdb from '@/routes/ppdb';
import { Head, Link, useForm } from '@inertiajs/react';
import { CheckIcon } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

interface Period {
    id: number;
    name: string;
    academic_year: string;
}

interface Path {
    id: number;
    name: string;
    description?: string;
}

interface Level {
    id: number;
    name: string;
    code: string;
}

interface Major {
    id: number;
    name: string;
    code: string;
}

interface RegisterProps {
    period: Period;
    paths: Path[];
    levels: Level[];
    majors: Major[];
}

export default function Register({
    period,
    paths,
    levels,
    majors,
}: RegisterProps) {
    const { t } = useTranslation('ppdb');
    const [currentStep, setCurrentStep] = useState(1);
    const [confirmed, setConfirmed] = useState(false);

    const { data, setData, post, processing, errors } = useForm({
        // Step 1 - Path selection
        admission_path_id: '',
        level_id: '',
        major_id: '',

        // Step 2 - Personal info
        name: '',
        nisn: '',
        nik: '',
        gender: '',
        birth_place: '',
        birth_date: '',
        religion: '',

        // Step 3 - Address
        address: '',
        village: '',
        district: '',
        city: '',
        province: '',
        postal_code: '',
        phone: '',
        email: '',

        // Step 4 - Parents
        father_name: '',
        father_occupation: '',
        father_phone: '',
        mother_name: '',
        mother_occupation: '',
        mother_phone: '',
        guardian_name: '',
        guardian_phone: '',

        // Step 5 - Previous school
        previous_school: '',
        previous_school_address: '',
        graduation_year: '',
    });

    const steps = [
        { number: 1, key: 'path' },
        { number: 2, key: 'personal' },
        { number: 3, key: 'address' },
        { number: 4, key: 'parents' },
        { number: 5, key: 'school' },
        { number: 6, key: 'review' },
    ];

    const religions = [
        'islam',
        'kristen',
        'katolik',
        'hindu',
        'buddha',
        'konghucu',
        'other',
    ];

    const handleNext = () => {
        if (currentStep < 6) {
            setCurrentStep(currentStep + 1);
        }
    };

    const handlePrevious = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(ppdb.store.url());
    };

    const getSelectedPath = () =>
        paths.find((p) => p.id.toString() === data.admission_path_id);
    const getSelectedLevel = () =>
        levels.find((l) => l.id.toString() === data.level_id);
    const getSelectedMajor = () =>
        majors.find((m) => m.id.toString() === data.major_id);

    const renderStepIndicator = () => (
        <div className="mb-8">
            <div className="flex items-center justify-between">
                {steps.map((step, index) => (
                    <div key={step.number} className="flex items-center">
                        <div className="flex flex-col items-center">
                            <div
                                className={`flex h-8 w-8 items-center justify-center rounded-full border-2 text-sm font-medium ${
                                    currentStep > step.number
                                        ? 'border-primary bg-primary text-primary-foreground'
                                        : currentStep === step.number
                                          ? 'border-primary text-primary'
                                          : 'border-muted-foreground/30 text-muted-foreground/50'
                                }`}
                            >
                                {currentStep > step.number ? (
                                    <CheckIcon className="h-4 w-4" />
                                ) : (
                                    step.number
                                )}
                            </div>
                            <span
                                className={`mt-1 hidden text-xs md:block ${
                                    currentStep >= step.number
                                        ? 'text-foreground'
                                        : 'text-muted-foreground/50'
                                }`}
                            >
                                {t(`steps.${step.key}`)}
                            </span>
                        </div>
                        {index < steps.length - 1 && (
                            <div
                                className={`mx-2 h-0.5 w-8 md:w-16 ${
                                    currentStep > step.number
                                        ? 'bg-primary'
                                        : 'bg-muted-foreground/30'
                                }`}
                            />
                        )}
                    </div>
                ))}
            </div>
        </div>
    );

    const renderStep1 = () => (
        <div className="space-y-6">
            <div className="space-y-2">
                <Label htmlFor="admission_path_id">
                    {t('step_1.select_path')} *
                </Label>
                <Select
                    value={data.admission_path_id}
                    onValueChange={(value) => setData('admission_path_id', value)}
                >
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder={t('step_1.select_path')} />
                    </SelectTrigger>
                    <SelectContent>
                        {paths.map((path) => (
                            <SelectItem key={path.id} value={path.id.toString()}>
                                {path.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <InputError message={errors.admission_path_id} />
            </div>

            <div className="space-y-2">
                <Label htmlFor="level_id">{t('step_1.select_level')} *</Label>
                <Select
                    value={data.level_id}
                    onValueChange={(value) => setData('level_id', value)}
                >
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder={t('step_1.select_level')} />
                    </SelectTrigger>
                    <SelectContent>
                        {levels.map((level) => (
                            <SelectItem
                                key={level.id}
                                value={level.id.toString()}
                            >
                                {level.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <InputError message={errors.level_id} />
            </div>

            {majors.length > 0 && (
                <div className="space-y-2">
                    <Label htmlFor="major_id">{t('step_1.select_major')}</Label>
                    <Select
                        value={data.major_id}
                        onValueChange={(value) => setData('major_id', value)}
                    >
                        <SelectTrigger className="w-full">
                            <SelectValue
                                placeholder={t('step_1.select_major')}
                            />
                        </SelectTrigger>
                        <SelectContent>
                            {majors.map((major) => (
                                <SelectItem
                                    key={major.id}
                                    value={major.id.toString()}
                                >
                                    {major.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <InputError message={errors.major_id} />
                </div>
            )}
        </div>
    );

    const renderStep2 = () => (
        <div className="space-y-6">
            <div className="space-y-2">
                <Label htmlFor="name">{t('step_2.full_name')} *</Label>
                <Input
                    id="name"
                    value={data.name}
                    onChange={(e) => setData('name', e.target.value)}
                />
                <InputError message={errors.name} />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                    <Label htmlFor="nisn">{t('step_2.nisn')} *</Label>
                    <Input
                        id="nisn"
                        value={data.nisn}
                        onChange={(e) => setData('nisn', e.target.value)}
                        maxLength={10}
                    />
                    <InputError message={errors.nisn} />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="nik">{t('step_2.nik')} *</Label>
                    <Input
                        id="nik"
                        value={data.nik}
                        onChange={(e) => setData('nik', e.target.value)}
                        maxLength={16}
                    />
                    <InputError message={errors.nik} />
                </div>
            </div>

            <div className="space-y-2">
                <Label>{t('step_2.gender')} *</Label>
                <div className="flex gap-4">
                    <div className="flex items-center space-x-2">
                        <input
                            type="radio"
                            id="male"
                            name="gender"
                            value="male"
                            checked={data.gender === 'male'}
                            onChange={(e) => setData('gender', e.target.value)}
                            className="h-4 w-4"
                        />
                        <Label htmlFor="male" className="font-normal">
                            {t('step_2.male')}
                        </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <input
                            type="radio"
                            id="female"
                            name="gender"
                            value="female"
                            checked={data.gender === 'female'}
                            onChange={(e) => setData('gender', e.target.value)}
                            className="h-4 w-4"
                        />
                        <Label htmlFor="female" className="font-normal">
                            {t('step_2.female')}
                        </Label>
                    </div>
                </div>
                <InputError message={errors.gender} />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                    <Label htmlFor="birth_place">
                        {t('step_2.birth_place')} *
                    </Label>
                    <Input
                        id="birth_place"
                        value={data.birth_place}
                        onChange={(e) => setData('birth_place', e.target.value)}
                    />
                    <InputError message={errors.birth_place} />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="birth_date">
                        {t('step_2.birth_date')} *
                    </Label>
                    <Input
                        id="birth_date"
                        type="date"
                        value={data.birth_date}
                        onChange={(e) => setData('birth_date', e.target.value)}
                    />
                    <InputError message={errors.birth_date} />
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="religion">{t('step_2.religion')} *</Label>
                <Select
                    value={data.religion}
                    onValueChange={(value) => setData('religion', value)}
                >
                    <SelectTrigger className="w-full">
                        <SelectValue
                            placeholder={t('step_2.select_religion')}
                        />
                    </SelectTrigger>
                    <SelectContent>
                        {religions.map((religion) => (
                            <SelectItem key={religion} value={religion}>
                                {t(`step_2.religions.${religion}`)}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <InputError message={errors.religion} />
            </div>
        </div>
    );

    const renderStep3 = () => (
        <div className="space-y-6">
            <div className="space-y-2">
                <Label htmlFor="address">{t('step_3.address')} *</Label>
                <Textarea
                    id="address"
                    value={data.address}
                    onChange={(e) => setData('address', e.target.value)}
                    rows={3}
                />
                <InputError message={errors.address} />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                    <Label htmlFor="village">{t('step_3.village')} *</Label>
                    <Input
                        id="village"
                        value={data.village}
                        onChange={(e) => setData('village', e.target.value)}
                    />
                    <InputError message={errors.village} />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="district">{t('step_3.district')} *</Label>
                    <Input
                        id="district"
                        value={data.district}
                        onChange={(e) => setData('district', e.target.value)}
                    />
                    <InputError message={errors.district} />
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                    <Label htmlFor="city">{t('step_3.city')} *</Label>
                    <Input
                        id="city"
                        value={data.city}
                        onChange={(e) => setData('city', e.target.value)}
                    />
                    <InputError message={errors.city} />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="province">{t('step_3.province')} *</Label>
                    <Input
                        id="province"
                        value={data.province}
                        onChange={(e) => setData('province', e.target.value)}
                    />
                    <InputError message={errors.province} />
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                    <Label htmlFor="postal_code">
                        {t('step_3.postal_code')}
                    </Label>
                    <Input
                        id="postal_code"
                        value={data.postal_code}
                        onChange={(e) => setData('postal_code', e.target.value)}
                        maxLength={5}
                    />
                    <InputError message={errors.postal_code} />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="phone">{t('step_3.phone')} *</Label>
                    <Input
                        id="phone"
                        type="tel"
                        value={data.phone}
                        onChange={(e) => setData('phone', e.target.value)}
                    />
                    <InputError message={errors.phone} />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="email">{t('step_3.email')} *</Label>
                    <Input
                        id="email"
                        type="email"
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                    />
                    <InputError message={errors.email} />
                </div>
            </div>
        </div>
    );

    const renderStep4 = () => (
        <div className="space-y-8">
            {/* Father */}
            <div className="space-y-4">
                <h3 className="font-semibold">{t('step_4.father')}</h3>
                <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                        <Label htmlFor="father_name">{t('step_4.name')} *</Label>
                        <Input
                            id="father_name"
                            value={data.father_name}
                            onChange={(e) =>
                                setData('father_name', e.target.value)
                            }
                        />
                        <InputError message={errors.father_name} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="father_occupation">
                            {t('step_4.occupation')}
                        </Label>
                        <Input
                            id="father_occupation"
                            value={data.father_occupation}
                            onChange={(e) =>
                                setData('father_occupation', e.target.value)
                            }
                        />
                        <InputError message={errors.father_occupation} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="father_phone">
                            {t('step_4.phone')}
                        </Label>
                        <Input
                            id="father_phone"
                            type="tel"
                            value={data.father_phone}
                            onChange={(e) =>
                                setData('father_phone', e.target.value)
                            }
                        />
                        <InputError message={errors.father_phone} />
                    </div>
                </div>
            </div>

            {/* Mother */}
            <div className="space-y-4">
                <h3 className="font-semibold">{t('step_4.mother')}</h3>
                <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                        <Label htmlFor="mother_name">{t('step_4.name')} *</Label>
                        <Input
                            id="mother_name"
                            value={data.mother_name}
                            onChange={(e) =>
                                setData('mother_name', e.target.value)
                            }
                        />
                        <InputError message={errors.mother_name} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="mother_occupation">
                            {t('step_4.occupation')}
                        </Label>
                        <Input
                            id="mother_occupation"
                            value={data.mother_occupation}
                            onChange={(e) =>
                                setData('mother_occupation', e.target.value)
                            }
                        />
                        <InputError message={errors.mother_occupation} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="mother_phone">
                            {t('step_4.phone')}
                        </Label>
                        <Input
                            id="mother_phone"
                            type="tel"
                            value={data.mother_phone}
                            onChange={(e) =>
                                setData('mother_phone', e.target.value)
                            }
                        />
                        <InputError message={errors.mother_phone} />
                    </div>
                </div>
            </div>

            {/* Guardian */}
            <div className="space-y-4">
                <h3 className="font-semibold">{t('step_4.guardian')}</h3>
                <p className="text-sm text-muted-foreground">
                    {t('step_4.guardian_info')}
                </p>
                <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                        <Label htmlFor="guardian_name">
                            {t('step_4.name')}
                        </Label>
                        <Input
                            id="guardian_name"
                            value={data.guardian_name}
                            onChange={(e) =>
                                setData('guardian_name', e.target.value)
                            }
                        />
                        <InputError message={errors.guardian_name} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="guardian_phone">
                            {t('step_4.phone')}
                        </Label>
                        <Input
                            id="guardian_phone"
                            type="tel"
                            value={data.guardian_phone}
                            onChange={(e) =>
                                setData('guardian_phone', e.target.value)
                            }
                        />
                        <InputError message={errors.guardian_phone} />
                    </div>
                </div>
            </div>
        </div>
    );

    const renderStep5 = () => (
        <div className="space-y-6">
            <div className="space-y-2">
                <Label htmlFor="previous_school">
                    {t('step_5.school_name')} *
                </Label>
                <Input
                    id="previous_school"
                    value={data.previous_school}
                    onChange={(e) =>
                        setData('previous_school', e.target.value)
                    }
                />
                <InputError message={errors.previous_school} />
            </div>

            <div className="space-y-2">
                <Label htmlFor="previous_school_address">
                    {t('step_5.school_address')}
                </Label>
                <Textarea
                    id="previous_school_address"
                    value={data.previous_school_address}
                    onChange={(e) =>
                        setData('previous_school_address', e.target.value)
                    }
                    rows={3}
                />
                <InputError message={errors.previous_school_address} />
            </div>

            <div className="space-y-2">
                <Label htmlFor="graduation_year">
                    {t('step_5.graduation_year')} *
                </Label>
                <Input
                    id="graduation_year"
                    value={data.graduation_year}
                    onChange={(e) =>
                        setData('graduation_year', e.target.value)
                    }
                    placeholder={new Date().getFullYear().toString()}
                />
                <InputError message={errors.graduation_year} />
            </div>
        </div>
    );

    const renderStep6 = () => (
        <div className="space-y-6">
            {/* Path Selection */}
            <Card>
                <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-base">
                            {t('steps.path')}
                        </CardTitle>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setCurrentStep(1)}
                        >
                            {t('step_6.edit')}
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="text-sm">
                    <dl className="grid gap-2">
                        <div className="flex justify-between">
                            <dt className="text-muted-foreground">
                                {t('status.path')}:
                            </dt>
                            <dd className="font-medium">
                                {getSelectedPath()?.name || '-'}
                            </dd>
                        </div>
                        <div className="flex justify-between">
                            <dt className="text-muted-foreground">
                                {t('status.level')}:
                            </dt>
                            <dd className="font-medium">
                                {getSelectedLevel()?.name || '-'}
                            </dd>
                        </div>
                        {data.major_id && (
                            <div className="flex justify-between">
                                <dt className="text-muted-foreground">
                                    {t('status.major')}:
                                </dt>
                                <dd className="font-medium">
                                    {getSelectedMajor()?.name || '-'}
                                </dd>
                            </div>
                        )}
                    </dl>
                </CardContent>
            </Card>

            {/* Personal Info */}
            <Card>
                <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-base">
                            {t('steps.personal')}
                        </CardTitle>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setCurrentStep(2)}
                        >
                            {t('step_6.edit')}
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="text-sm">
                    <dl className="grid gap-2">
                        <div className="flex justify-between">
                            <dt className="text-muted-foreground">
                                {t('step_2.full_name')}:
                            </dt>
                            <dd className="font-medium">
                                {data.name || '-'}
                            </dd>
                        </div>
                        <div className="flex justify-between">
                            <dt className="text-muted-foreground">
                                {t('step_2.nisn')}:
                            </dt>
                            <dd className="font-medium">{data.nisn || '-'}</dd>
                        </div>
                        <div className="flex justify-between">
                            <dt className="text-muted-foreground">
                                {t('step_2.nik')}:
                            </dt>
                            <dd className="font-medium">{data.nik || '-'}</dd>
                        </div>
                        <div className="flex justify-between">
                            <dt className="text-muted-foreground">
                                {t('step_2.gender')}:
                            </dt>
                            <dd className="font-medium">
                                {data.gender
                                    ? t(`step_2.${data.gender}`)
                                    : '-'}
                            </dd>
                        </div>
                        <div className="flex justify-between">
                            <dt className="text-muted-foreground">
                                {t('step_2.birth_place')},{' '}
                                {t('step_2.birth_date')}:
                            </dt>
                            <dd className="font-medium">
                                {data.birth_place}, {data.birth_date || '-'}
                            </dd>
                        </div>
                        <div className="flex justify-between">
                            <dt className="text-muted-foreground">
                                {t('step_2.religion')}:
                            </dt>
                            <dd className="font-medium">
                                {data.religion
                                    ? t(`step_2.religions.${data.religion}`)
                                    : '-'}
                            </dd>
                        </div>
                    </dl>
                </CardContent>
            </Card>

            {/* Address */}
            <Card>
                <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-base">
                            {t('steps.address')}
                        </CardTitle>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setCurrentStep(3)}
                        >
                            {t('step_6.edit')}
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="text-sm">
                    <dl className="grid gap-2">
                        <div className="flex justify-between">
                            <dt className="text-muted-foreground">
                                {t('step_3.address')}:
                            </dt>
                            <dd className="font-medium text-right">
                                {data.address || '-'}
                            </dd>
                        </div>
                        <div className="flex justify-between">
                            <dt className="text-muted-foreground">
                                {t('step_3.village')}, {t('step_3.district')}:
                            </dt>
                            <dd className="font-medium">
                                {data.village}, {data.district || '-'}
                            </dd>
                        </div>
                        <div className="flex justify-between">
                            <dt className="text-muted-foreground">
                                {t('step_3.city')}, {t('step_3.province')}:
                            </dt>
                            <dd className="font-medium">
                                {data.city}, {data.province || '-'}
                            </dd>
                        </div>
                        <div className="flex justify-between">
                            <dt className="text-muted-foreground">
                                {t('step_3.phone')}:
                            </dt>
                            <dd className="font-medium">{data.phone || '-'}</dd>
                        </div>
                        <div className="flex justify-between">
                            <dt className="text-muted-foreground">
                                {t('step_3.email')}:
                            </dt>
                            <dd className="font-medium">{data.email || '-'}</dd>
                        </div>
                    </dl>
                </CardContent>
            </Card>

            {/* Parents */}
            <Card>
                <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-base">
                            {t('steps.parents')}
                        </CardTitle>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setCurrentStep(4)}
                        >
                            {t('step_6.edit')}
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="text-sm">
                    <div className="space-y-4">
                        <div>
                            <h4 className="font-medium">{t('step_4.father')}</h4>
                            <p className="text-muted-foreground">
                                {data.father_name || '-'}
                                {data.father_occupation &&
                                    ` - ${data.father_occupation}`}
                            </p>
                        </div>
                        <div>
                            <h4 className="font-medium">{t('step_4.mother')}</h4>
                            <p className="text-muted-foreground">
                                {data.mother_name || '-'}
                                {data.mother_occupation &&
                                    ` - ${data.mother_occupation}`}
                            </p>
                        </div>
                        {data.guardian_name && (
                            <div>
                                <h4 className="font-medium">
                                    {t('step_4.guardian')}
                                </h4>
                                <p className="text-muted-foreground">
                                    {data.guardian_name}
                                </p>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Previous School */}
            <Card>
                <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-base">
                            {t('steps.school')}
                        </CardTitle>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setCurrentStep(5)}
                        >
                            {t('step_6.edit')}
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="text-sm">
                    <dl className="grid gap-2">
                        <div className="flex justify-between">
                            <dt className="text-muted-foreground">
                                {t('step_5.school_name')}:
                            </dt>
                            <dd className="font-medium">
                                {data.previous_school || '-'}
                            </dd>
                        </div>
                        <div className="flex justify-between">
                            <dt className="text-muted-foreground">
                                {t('step_5.graduation_year')}:
                            </dt>
                            <dd className="font-medium">
                                {data.graduation_year || '-'}
                            </dd>
                        </div>
                    </dl>
                </CardContent>
            </Card>

            {/* Confirmation */}
            <div className="flex items-start space-x-3 rounded-lg border p-4">
                <Checkbox
                    id="confirm"
                    checked={confirmed}
                    onCheckedChange={(checked) =>
                        setConfirmed(checked as boolean)
                    }
                />
                <Label htmlFor="confirm" className="text-sm leading-relaxed">
                    {t('step_6.confirm')}
                </Label>
            </div>
        </div>
    );

    return (
        <GuestLayout
            title={t('title')}
            description={`${period.name} - ${period.academic_year}`}
        >
            <Head title={t('registration')} />

            <div className="mx-auto max-w-3xl">
                {renderStepIndicator()}

                <Card>
                    <CardHeader>
                        <CardTitle>
                            {t(`step_${currentStep}.title`)}
                        </CardTitle>
                        <CardDescription>
                            {t(`step_${currentStep}.description`)}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit}>
                            {currentStep === 1 && renderStep1()}
                            {currentStep === 2 && renderStep2()}
                            {currentStep === 3 && renderStep3()}
                            {currentStep === 4 && renderStep4()}
                            {currentStep === 5 && renderStep5()}
                            {currentStep === 6 && renderStep6()}

                            <div className="mt-8 flex justify-between">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={handlePrevious}
                                    disabled={currentStep === 1}
                                >
                                    {t('actions.previous')}
                                </Button>

                                {currentStep < 6 ? (
                                    <Button type="button" onClick={handleNext}>
                                        {t('actions.next')}
                                    </Button>
                                ) : (
                                    <Button
                                        type="submit"
                                        disabled={processing || !confirmed}
                                    >
                                        {processing && <Spinner />}
                                        {processing
                                            ? t('actions.submitting')
                                            : t('actions.submit')}
                                    </Button>
                                )}
                            </div>
                        </form>
                    </CardContent>
                </Card>

                <div className="mt-4 text-center">
                    <Link
                        href={ppdb.check.url()}
                        className="text-sm text-muted-foreground hover:underline"
                    >
                        {t('check_status')}
                    </Link>
                </div>
            </div>
        </GuestLayout>
    );
}
