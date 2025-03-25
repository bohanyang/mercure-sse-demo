
import {
    useQuery,
  } from '@tanstack/react-query'
import { getProject } from './getProjects';

export const ProjectCard = ({ id }: { id: string }) => {
    const { data: project, isLoading, error } = useQuery({ queryKey: ['projects', id], queryFn: () => getProject(id) });
    if (isLoading) return <div>Loading project...</div>;
    if (error || !project) return <div>Error loading project</div>;
  
    return (
      <div>
        <h3>{project.name}</h3>
        {project.isCalculating ? <p>残り時間: {project.estimatedCalculationTime}</p> : null}
        <p>Status: {project.isCalculating ? '計算中' : '計算完了'}</p>
      </div>
    );
};