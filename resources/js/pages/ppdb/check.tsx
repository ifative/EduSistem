import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import GuestLayout from '@/layouts/guest-layout';
import ppdb from '@/routes/ppdb';
import { Head, Link, useForm } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';

export default function Check() {
    const { t } = useTranslation('ppdb');

    const { data, setData, post, processing, errors } = useForm({
        registration_number: '',
        birth_date: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(ppdb.status.url());
    };

    return (
        <GuestLayout
            title={t('check_status')}
            description={t('check_status_description')}
        >
            <Head title={t('check_status')} />

            <div className="mx-auto max-w-md">
                <Card>
                    <CardHeader>
                        <CardTitle>{t('check_status')}</CardTitle>
                        <CardDescription>
                            {t('check_status_description')}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="registration_number">
                                    {t('registration_number')}
                                </Label>
                                <Input
                                    id="registration_number"
                                    value={data.registration_number}
                                    onChange={(e) =>
                                        setData(
                                            'registration_number',
                                            e.target.value
                                        )
                                    }
                                    placeholder="PPDB-2024-XXXXX"
                                    required
                                />
                                <InputError
                                    message={errors.registration_number}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="birth_date">
                                    {t('birth_date')}
                                </Label>
                                <Input
                                    id="birth_date"
                                    type="date"
                                    value={data.birth_date}
                                    onChange={(e) =>
                                        setData('birth_date', e.target.value)
                                    }
                                    required
                                />
                                <InputError message={errors.birth_date} />
                            </div>

                            <Button
                                type="submit"
                                className="w-full"
                                disabled={processing}
                            >
                                {processing && <Spinner />}
                                {t('check')}
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                <div className="mt-4 text-center">
                    <Link
                        href={ppdb.index.url()}
                        className="text-sm text-muted-foreground hover:underline"
                    >
                        {t('register_now')}
                    </Link>
                </div>
            </div>
        </GuestLayout>
    );
}
