'use client'
import { AppSidebar } from "@/components/app-sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import {
  useQuery,
  useQueryClient,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'


import { ProjectCard } from "./ProjectCard"
import { PublishProject } from "./PublishProject"
import { useEffect } from 'react'
import { EventSourcePlus } from "event-source-plus";

const queryClient = new QueryClient();
export default function Page() {
  
  return (
            <QueryClientProvider client={queryClient}>
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#">
                    Building Your Application
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Data Fetching</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="grid auto-rows-min gap-4 md:grid-cols-3">
            <ProjectList />
            <div className="aspect-video rounded-xl" />
          </div>
          <div className="min-h-[100vh] flex-1 rounded-xl md:min-h-min">
          <PublishProject />
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
                </QueryClientProvider>
  )
}

function ProjectList() {

  const { data: tokenResp } = useQuery({queryKey:['subToken', process.env.NEXT_PUBLIC_ORGANIZATION_ID], queryFn:async () => {
    const response = await fetch(`/api/generateSubscriberToken/${process.env.NEXT_PUBLIC_ORGANIZATION_ID}`, {
      method: 'POST'})
    return response.json()
  }})
  const queryClient = useQueryClient()
  useEffect(() => {
    if (!tokenResp?.token) return;
    const subscribeURL = new URL(process.env.NEXT_PUBLIC_MERCURE_ENDPOINT);
  subscribeURL.searchParams.append("topic", `/organizations/${process.env.NEXT_PUBLIC_ORGANIZATION_ID}/projects`);

    const eventSource = new EventSourcePlus(subscribeURL, {
      // this value will remain the same for every request
      headers: {
          Authorization: `Bearer ${tokenResp.token}`,
      },
  });

  eventSource.listen({
    onMessage({ data }) {
      const update = JSON.parse(data);
      console.log(update);
      queryClient.setQueryData(['projects', update.id], (oldData) => ({...oldData, ...update}));
    },
});
    return () => {
    }
}, [tokenResp, queryClient])
return <>
<div className="bg-muted/50 aspect-video rounded-xl">
            <ProjectCard id="1" />
            </div>
            <div className="bg-muted/50 aspect-video rounded-xl">
            
            <ProjectCard id="2" /></div></>
}