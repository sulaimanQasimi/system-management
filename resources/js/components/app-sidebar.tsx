import { Link } from '@inertiajs/react';
import {
    Headset,
    LayoutGrid,
    Server,
    ServerCog,
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
import { useCurrentUrl } from '@/hooks/use-current-url';
import { dashboard } from '@/routes';
import { index as adUsers } from '@/routes/ad-users';
import { index as itSupport } from '@/routes/it-support';
import { index as serverModels } from '@/routes/server-models';
import { index as serverServices } from '@/routes/server-services';
import type { NavItem } from '@/types';

const platformItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
        icon: LayoutGrid,
    },
];

const directoryItems: NavItem[] = [
    {
        title: 'AD Users',
        href: adUsers(),
        icon: Users,
    },
];

const infrastructureItems: NavItem[] = [
    {
        title: 'Server Models',
        href: serverModels(),
        icon: Server,
    },
    {
        title: 'Server Services',
        href: serverServices(),
        icon: ServerCog,
    },
];

const supportItems: NavItem[] = [
    {
        title: 'IT Support',
        href: itSupport(),
        icon: Headset,
    },
];

function NavSection({ label, items }: { label: string; items: NavItem[] }) {
    const { isCurrentUrl } = useCurrentUrl();

    return (
        <SidebarGroup className="px-2 py-0">
            <SidebarGroupLabel>{label}</SidebarGroupLabel>
            <SidebarMenu>
                {items.map((item) => (
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
                <NavMain items={platformItems} />
                <NavSection label="Directory" items={directoryItems} />
                <NavSection
                    label="Infrastructure"
                    items={infrastructureItems}
                />
                <NavSection label="Support" items={supportItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
