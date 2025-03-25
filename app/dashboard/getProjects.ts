
const defaultProjectData = new Map(
    [
      ['1', {
        id: '1',
        name: 'Project 1',
        estimatedCalculationTime: 1000,
        isCalculating: true,
      }],
  
      ['2', {
        id: '2',
        name: 'Project 2',
        estimatedCalculationTime: 1000,
        isCalculating: true,
      }]
    ]
  )
export const getProjects = async () => {
    return Promise.resolve(Array.from(defaultProjectData.values()))
}
export const getProject = async (id: string) => {
    const data = defaultProjectData.get(id)
    if (data) {
      return Promise.resolve(data)
    }
    return Promise.reject(new Error('Project not found'))
}
