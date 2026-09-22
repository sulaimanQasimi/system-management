import { Link } from '@inertiajs/react';
import {
    HardDrive,
    Headset,
    LayoutGrid,
    Server,
    ServerCog,
    UserRound,
    Users,
} from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { useCan } from '@/hooks/use-can';
import { useCurrentUrl } from '@/hooks/use-current-url';
import { dashboard } from '@/routes';
import { index as adUsers } from '@/routes/ad-users';
import { index as itSupport } from '@/routes/it-support';
import { index as serverModels } from '@/routes/server-models';
import { index as serverServices } from '@/routes/server-services';
import { index as servers } from '@/routes/servers';
import { index as users } from '@/routes/users';
import type { NavItem } from '@/types';

const platformItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
        icon: LayoutGrid,
    },
];

function NavSection({
    label,
    items,
}: {
    label: string;
    items: (NavItem & { permission?: string })[];
}) {
    const { isCurrentUrl } = useCurrentUrl();
    const { can } = useCan();
    const visible = items.filter(
        (item) => !item.permission || can(item.permission),
    );

    if (visible.length === 0) {
        return null;
    }

    return (
        <SidebarGroup className="px-2 py-0">
            <SidebarGroupLabel>{label}</SidebarGroupLabel>
            <SidebarMenu>
                {visible.map((item) => (
                    <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton
                            asChild
                            isActive={isCurrentUrl(item.href)}
                            tooltip={{ children: item.title }}
                        >
                            <Link href={item.href} prefetch>
                                {item.icon && <item.icon />}
                                <span>{item.title}</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                ))}
            </SidebarMenu>
        </SidebarGroup>
    );
}

const footerNavItems: NavItem[] = [];

export function AppSidebar() {
    const directoryItems = [
        {
            title: 'AD Users',
            href: adUsers(),
            icon: Users,
            permission: 'ad_user.view',
        },
    ];

    const infrastructureItems = [
        {
            title: 'Servers',
            href: servers(),
            icon: HardDrive,
            permission: 'server.view',
        },
        {
            title: 'Server Models',
            href: serverModels(),
            icon: Server,
            permission: 'server_model.view',
        },
        {
            title: 'Server Services',
            href: serverServices(),
            icon: ServerCog,
            permission: 'server_service.view',
        },
    ];

    const supportItems = [
        {
            title: 'IT Support',
            href: itSupport(),
            icon: Headset,
            permission: 'it_support.view',
        },
    ];

    const adminItems = [
        {
            title: 'Users',
            href: users(),
            icon: UserRound,
            permission: 'user.view',
        },
    ];

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader className="pb-3">
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

            <SidebarContent className="gap-3 px-1">
                <NavMain items={platformItems} />
                <NavSection label="Directory" items={directoryItems} />
                <NavSection
                    label="Infrastructure"
                    items={infrastructureItems}
                />
                <NavSection label="Support" items={supportItems} />
                <NavSection label="Administration" items={adminItems} />
            </SidebarContent>

            <SidebarFooter className="pt-3">
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
