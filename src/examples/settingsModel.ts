export interface WorkspaceSettings {
  name: string
  email: string
  notifications: boolean
  digest: 'daily' | 'weekly'
}

export interface WorkspaceMember {
  id: string
  name: string
  email: string
  role: 'Owner' | 'Editor' | 'Viewer'
}

export const defaultSettings: WorkspaceSettings = {
  name: 'Bauhaus Studio',
  email: 'studio@example.com',
  notifications: true,
  digest: 'weekly',
}

export const defaultMembers: WorkspaceMember[] = [
  { id: 'walter', name: 'Walter Gropius', email: 'walter@example.com', role: 'Owner' },
  { id: 'anni', name: 'Anni Albers', email: 'anni@example.com', role: 'Editor' },
  { id: 'paul', name: 'Paul Klee', email: 'paul@example.com', role: 'Viewer' },
]
