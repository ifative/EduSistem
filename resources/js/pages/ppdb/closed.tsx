import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import GuestLayout from '@/layouts/guest-layout';
import ppdb from '@/routes/ppdb';
import { Head, Link } from '@inertiajs/react';
import { CalendarXIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function Closed() {
    const { t } = useTranslation('ppdb');

    return (
        <GuestLayout>
            <Head title={t('registration_closed')} />

            <div className="mx-auto max-w-md">
                <Card>
                    <CardHeader className="text-center">
                        <div className="mx-auto mb-4 rounded-full bg-muted p-3">
                            <CalendarXIcon className="h-12 w-12 text-muted-foreground" />
                        </div>
                        <CardTitle>{t('registration_closed')}</CardTitle>
                        <CardDescription>
                            {t('registration_closed_description')}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button asChild className="w-full">
                            <Link href={ppdb.check.url()}>
                                {t('check_status')}
                            </Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </GuestLayout>
    );
}
