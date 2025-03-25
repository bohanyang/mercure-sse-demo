'use client';
import { AppSidebar } from '@/components/app-sidebar';
import { Separator } from '@/components/ui/separator';
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import {
  useQuery,
  useQueryClient,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';

import { ProjectCard } from './ProjectCard';
import { PublishProject } from './PublishProject';
import { useEffect } from 'react';
import { fetchEventSource } from '@microsoft/fetch-event-source';

import { useParams } from 'next/navigation';

const queryClient = new QueryClient();

export default function Page() {
  const { organizationId } = useParams<{ organizationId: string }>();
  return (
    <QueryClientProvider client={queryClient}>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <header className='flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12'>
            <div className='flex items-center gap-2 px-4'>
              <SidebarTrigger className='-ml-1' />
              <Separator
                orientation='vertical'
                className='mr-2 data-[orientation=vertical]:h-4'
              />
              {organizationId}
            </div>
          </header>
          <div className='flex flex-1 flex-col gap-4 p-4 pt-0'>
            <div className='grid auto-rows-min gap-4 md:grid-cols-3'>
              <ProjectList organizationId={organizationId} />
              <div className='aspect-video rounded-xl' />
            </div>
            <div className='min-h-[100vh] flex-1 rounded-xl md:min-h-min'>
              <PublishProject organizationId={organizationId} />
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </QueryClientProvider>
  );
}

function ProjectList({ organizationId }: { organizationId: string }) {
  const { data: tokenResp } = useQuery({
    queryKey: ['subscriberToken', organizationId],
    queryFn: async () => {
      const response = await fetch(
        `/api/generateSubscriberToken/${organizationId}`,
        {
          method: 'POST',
        },
      );
      return response.json();
    },
  });
  const queryClient = useQueryClient();
  useEffect(() => {
    if (!tokenResp?.token) return;
    const subscribeURL = new URL(process.env.NEXT_PUBLIC_MERCURE_ENDPOINT);
    subscribeURL.searchParams.append(
      'topic',
      `/organizations/${organizationId}/projects/{projectId}`,
    );

    fetchEventSource(subscribeURL.toString(), {
      headers: {
        Authorization: `Bearer ${tokenResp.token}`,
      },
      onmessage({ data }) {
        const update = JSON.parse(data);
        queryClient.setQueryData(['projects', update.id], () => update);
      },
    });
    return () => {};
  }, [tokenResp, queryClient, organizationId]);
  return (
    <>
      <div className='bg-muted/50 aspect-video rounded-xl flex justify-center items-center'>
        <ProjectCard id='1' />
      </div>
      <div className='bg-muted/50 aspect-video rounded-xl flex justify-center items-center'>
        <ProjectCard id='2' />
      </div>
    </>
  );
}
