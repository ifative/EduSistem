import { NavCollapsible } from '@/components/nav-collapsible';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import { type NavItem, type NavItemWithChildren } from '@/types';
import { Link } from '@inertiajs/react';
import {
    Activity,
    ClipboardList,
    Database,
    Image,
    LayoutGrid,
    Settings,
    Trophy,
    Users,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import AppLogo from './app-logo';

export function AppSidebar() {
    const { t } = useTranslation('common');

    // Primary navigation - Most frequently used
    const mainNavItems: NavItem[] = [
        {
            title: t('sidebar.nav.dashboard'),
            href: dashboard(),
            icon: LayoutGrid,
        },
    ];

    // Master Data - Collapsible menu for data management
    const masterDataItems: NavItemWithChildren[] = [
        {
            title: t('sidebar.nav.master_data'),
            icon: Database,
            items: [
                {
                    title: t('sidebar.nav.academic_years'),
                    href: '/admin/master/academic-years',
                },
                {
                    title: t('sidebar.nav.students'),
                    href: '/admin/master/students',
                },
                {
                    title: t('sidebar.nav.teachers'),
                    href: '/admin/master/teachers',
                },
                {
                    title: t('sidebar.nav.classrooms'),
                    href: '/admin/master/classrooms',
                },
                {
                    title: t('sidebar.nav.subjects'),
                    href: '/admin/master/subjects',
                },
                {
                    title: t('sidebar.nav.levels'),
                    href: '/admin/master/levels',
                },
                {
                    title: t('sidebar.nav.majors'),
                    href: '/admin/master/majors',
                },
                {
                    title: t('sidebar.nav.extracurriculars'),
                    href: '/admin/master/extracurriculars',
                },
            ],
        },
    ];

    // PPDB - Student Admission Management
    const ppdbItems: NavItemWithChildren[] = [
        {
            title: t('sidebar.nav.ppdb'),
            icon: ClipboardList,
            items: [
                {
                    title: t('sidebar.nav.periods'),
                    href: '/admin/ppdb/periods',
                },
                {
                    title: t('sidebar.nav.paths'),
                    href: '/admin/ppdb/paths',
                },
                {
                    title: t('sidebar.nav.registrations'),
                    href: '/admin/ppdb/registrations',
                },
                {
                    title: t('sidebar.nav.documents'),
                    href: '/admin/ppdb/documents',
                },
                {
                    title: t('sidebar.nav.selections'),
                    href: '/admin/ppdb/selections',
                },
            ],
        },
    ];

    // User & Access Management - Security related
    const userManagementItems: NavItemWithChildren[] = [
        {
            title: t('sidebar.nav.user_management'),
            icon: Users,
            items: [
                {
                    title: t('sidebar.nav.users'),
                    href: '/admin/users',
                },
                {
                    title: t('sidebar.nav.roles'),
                    href: '/admin/roles',
                },
                {
                    title: t('sidebar.nav.permissions'),
                    href: '/admin/permissions',
                },
            ],
        },
    ];

    // System administration items
    const systemItems: NavItem[] = [
        {
            title: t('sidebar.nav.activity_logs'),
            href: '/admin/activity-logs',
            icon: Activity,
        },
        {
            title: t('sidebar.nav.media_library'),
            href: '/admin/media',
            icon: Image,
        },
        {
            title: t('sidebar.nav.settings'),
            href: '/admin/settings',
            icon: Settings,
        },
    ];

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                {/* Primary Navigation */}
                <NavMain items={mainNavItems} label={t('sidebar.labels.menu')} />

                {/* Academic Data Management */}
                <NavCollapsible items={masterDataItems} label={t('sidebar.labels.academic')} />

                {/* PPDB - Student Admission */}
                <NavCollapsible items={ppdbItems} label={t('sidebar.labels.admission')} />

                {/* Access Control */}
                <NavCollapsible items={userManagementItems} label={t('sidebar.labels.access_control')} />

                {/* System Administration */}
                <NavMain items={systemItems} label={t('sidebar.labels.system')} />
            </SidebarContent>

            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
