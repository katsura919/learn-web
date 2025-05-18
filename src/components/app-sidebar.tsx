"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import axios from "axios";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { NavUser } from "@/components/nav-user";
import { fetchUserById } from "@/lib/api/user";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();
  const [user, setUser] = React.useState<{ name: string; email: string } | null>(null);

  React.useEffect(() => {
    const loadUser = async () => {
      try {
        const userData = await fetchUserById();
        setUser({
          name: `${userData.firstName} ${userData.lastName}`,
          email: userData.email,
        });
      } catch (error) {
        console.error("Failed to fetch user:", error);
      }
    };

    loadUser();
  }, []);

  const navMain = [
    {
      title: "Navigation",
      url: "#",
      items: [
        { title: "Home", url: "/dashboard" },
        { title: "Create Lesson", url: "/dashboard/create" },
        { title: "Notebooks", url: "/dashboard/notebooks" },
        { title: "Questions", url: "/dashboard/questions" },
      ],
    },
  ];

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <Image
                    src="/icons/logo.png"
                    alt="My Icon"
                    width={30}
                    height={20}
                    className="size-7"
                  />
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-semibold">Lesson Learn</span>
                  <span className="">v1.0.0</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {navMain.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild>
                  <a
                    href={item.url}
                    className={`font-medium ${pathname === item.url ? "text-primary font-bold" : ""}`}
                  >
                    {item.title}
                  </a>
                </SidebarMenuButton>
                {item.items?.length ? (
                  <SidebarMenuSub>
                    {item.items.map((subItem) => {
                      const isActive = pathname === subItem.url;
                      return (
                        <SidebarMenuSubItem key={subItem.title}>
                          <SidebarMenuSubButton asChild isActive={isActive}>
                            <a href={subItem.url} className={isActive ? "text-primary font-bold" : ""}>
                              {subItem.title}
                            </a>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      );
                    })}
                  </SidebarMenuSub>
                ) : null}
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        {user ? <NavUser user={user} /> : <span className="text-sm text-muted-foreground">Loading...</span>}
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
