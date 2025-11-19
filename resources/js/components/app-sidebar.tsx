import { NavCollapsible } from '@/components/nav-collapsible';
import { NavFooter } from '@/components/nav-footer';
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
    BookOpen,
    Building2,
    Calendar,
    Database,
    GraduationCap,
    HelpCircle,
    Image,
    LayoutGrid,
    Settings,
    Shield,
    ShieldCheck,
    Users,
} from 'lucide-react';
import AppLogo from './app-logo';

// Primary navigation - Most frequently used
const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
        icon: LayoutGrid,
    },
];

// Master Data - Collapsible menu for data management
const masterDataItems: NavItemWithChildren[] = [
    {
        title: 'Master Data',
        icon: Database,
        items: [
            {
                title: 'Academic Years',
                href: '/admin/master/academic-years',
            },
            {
                title: 'Students',
                href: '/admin/master/students',
            },
            {
                title: 'Teachers',
                href: '/admin/master/teachers',
            },
            {
                title: 'Classrooms',
                href: '/admin/master/classrooms',
            },
            {
                title: 'Subjects',
                href: '/admin/master/subjects',
            },
            {
                title: 'Levels',
                href: '/admin/master/levels',
            },
            {
                title: 'Majors',
                href: '/admin/master/majors',
            },
        ],
    },
];

// User & Access Management - Security related
const userManagementItems: NavItemWithChildren[] = [
    {
        title: 'User Management',
        icon: Users,
        items: [
            {
                title: 'Users',
                href: '/admin/users',
            },
            {
                title: 'Roles',
                href: '/admin/roles',
            },
            {
                title: 'Permissions',
                href: '/admin/permissions',
            },
        ],
    },
];

// System administration items
const systemItems: NavItem[] = [
    {
        title: 'Activity Logs',
        href: '/admin/activity-logs',
        icon: Activity,
    },
    {
        title: 'Media Library',
        href: '/admin/media',
        icon: Image,
    },
    {
        title: 'Settings',
        href: '/admin/settings',
        icon: Settings,
    },
];

// Footer navigation - Help & Resources
const footerNavItems: NavItem[] = [
    {
        title: 'Help & Support',
        href: 'https://github.com/ifative/EduSistem/issues',
        icon: HelpCircle,
    },
    {
        title: 'Documentation',
        href: 'https://github.com/ifative/EduSistem/wiki',
        icon: BookOpen,
    },
];

export function AppSidebar() {
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
                <NavMain items={mainNavItems} label="Menu" />

                {/* Academic Data Management */}
                <NavCollapsible items={masterDataItems} label="Academic" />

                {/* Access Control */}
                <NavCollapsible items={userManagementItems} label="Access Control" />

                {/* System Administration */}
                <NavMain items={systemItems} label="System" />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
