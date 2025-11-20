import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
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
import { CheckCircle2Icon, CopyIcon } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

interface Registration {
    id: number;
    registration_number: string;
    full_name: string;
}

interface SuccessProps {
    registration: Registration;
}

export default function Success({ registration }: SuccessProps) {
    const { t } = useTranslation('ppdb');
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(
                registration.registration_number
            );
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    const nextSteps = t('success.next_steps_list', {
        returnObjects: true,
    }) as string[];

    return (
        <GuestLayout>
            <Head title={t('success.title')} />

            <div className="mx-auto max-w-lg">
                <div className="mb-6 flex flex-col items-center text-center">
                    <div className="mb-4 rounded-full bg-green-100 p-3 dark:bg-green-900/30">
                        <CheckCircle2Icon className="h-12 w-12 text-green-600 dark:text-green-400" />
                    </div>
                    <h1 className="text-2xl font-bold">{t('success.title')}</h1>
                    <p className="mt-2 text-muted-foreground">
                        {t('success.description')}
                    </p>
                </div>

                <Card className="mb-6">
                    <CardHeader className="text-center">
                        <CardDescription>
                            {t('success.registration_number')}
                        </CardDescription>
                        <CardTitle className="text-3xl tracking-wider">
                            {registration.registration_number}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="flex justify-center">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleCopy}
                        >
                            <CopyIcon className="h-4 w-4" />
                            {copied ? 'Copied!' : 'Copy'}
                        </Button>
                    </CardContent>
                </Card>

                <Alert className="mb-6">
                    <AlertTitle>{t('success.save_instruction')}</AlertTitle>
                </Alert>

                <Card className="mb-6">
                    <CardHeader>
                        <CardTitle className="text-lg">
                            {t('success.next_steps')}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ol className="list-decimal space-y-2 pl-5 text-sm">
                            {nextSteps.map((step, index) => (
                                <li key={index}>{step}</li>
                            ))}
                        </ol>
                    </CardContent>
                </Card>

                <div className="flex flex-col gap-3">
                    <Button asChild className="w-full">
                        <Link href={ppdb.check.url()}>
                            {t('success.check_status')}
                        </Link>
                    </Button>
                    <Button asChild variant="outline" className="w-full">
                        <Link href={ppdb.index.url()}>
                            {t('back_to_registration')}
                        </Link>
                    </Button>
                </div>
            </div>
        </GuestLayout>
    );
}
