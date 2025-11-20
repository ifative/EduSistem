import AppLogoIcon from '@/components/app-logo-icon';
import { home } from '@/routes';
import { Link } from '@inertiajs/react';
import { type PropsWithChildren } from 'react';

interface GuestLayoutProps {
    title?: string;
    description?: string;
    className?: string;
}

export default function GuestLayout({
    children,
    title,
    description,
    className = '',
}: PropsWithChildren<GuestLayoutProps>) {
    return (
        <div className="flex min-h-svh flex-col bg-background">
            <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="container mx-auto flex h-14 items-center px-4">
                    <Link
                        href={home()}
                        className="flex items-center gap-2 font-medium"
                    >
                        <AppLogoIcon className="size-6 fill-current text-[var(--foreground)] dark:text-white" />
                        <span className="font-semibold">EduSistem</span>
                    </Link>
                </div>
            </header>

            <main className={`flex-1 ${className}`}>
                {(title || description) && (
                    <div className="border-b bg-muted/50">
                        <div className="container mx-auto px-4 py-8">
                            {title && (
                                <h1 className="text-2xl font-bold md:text-3xl">
                                    {title}
                                </h1>
                            )}
                            {description && (
                                <p className="mt-2 text-muted-foreground">
                                    {description}
                                </p>
                            )}
                        </div>
                    </div>
                )}
                <div className="container mx-auto px-4 py-6">{children}</div>
            </main>

            <footer className="border-t bg-muted/50">
                <div className="container mx-auto px-4 py-6 text-center text-sm text-muted-foreground">
                    &copy; {new Date().getFullYear()} EduSistem. All rights
                    reserved.
                </div>
            </footer>
        </div>
    );
}
