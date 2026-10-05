import { useId, useRef, useState } from 'react'
import { Avatar } from '../components/Avatar'
import { Badge } from '../components/Badge'
import { Button } from '../components/Button'
import { FormField } from '../components/FormField'
import { Input } from '../components/Input'
import type { WorkspaceMember } from './settingsModel'

export function SettingsMembers({ members }: { members: WorkspaceMember[] }) {
  const [query, setQuery] = useState('')
  const searchRef = useRef<HTMLInputElement>(null)
  const headingId = useId()
  const normalized = query.trim().toLowerCase()
  const visible = members.filter((member) =>
    `${member.name} ${member.email} ${member.role}`.toLowerCase().includes(normalized),
  )
  return (
    <section aria-labelledby={headingId} className="settings-panel">
      <h2 id={headingId}>
        <span className="settings-section-number" aria-hidden="true">
          03
        </span>
        Team members
      </h2>
      <p className="settings-description">The people who have access to this workspace.</p>
      {members.length === 0 ? (
        <div className="settings-empty">
          <h3>Your team starts here</h3>
          <p>No team members yet.</p>
        </div>
      ) : (
        <>
          <FormField label="Search members">
            <Input
              ref={searchRef}
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search by name, email or role"
            />
          </FormField>
          <p role="status" className="settings-member-count">
            {visible.length} {visible.length === 1 ? 'member' : 'members'}
          </p>
          {visible.length === 0 ? (
            <div className="settings-empty">
              <h3>No results</h3>
              <p>No members match your search.</p>
              <Button
                intent="secondary"
                onClick={() => {
                  setQuery('')
                  searchRef.current?.focus()
                }}
              >
                Clear search
              </Button>
            </div>
          ) : (
            <ul className="settings-members" aria-label="Workspace members">
              {visible.map((member) => (
                <li key={member.id}>
                  <Avatar name={member.name} size="md" />
                  <div className="settings-member-details">
                    <strong>{member.name}</strong>
                    <span>{member.email}</span>
                  </div>
                  <Badge variant="outline" size="sm">
                    {member.role}
                  </Badge>
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </section>
  )
}
