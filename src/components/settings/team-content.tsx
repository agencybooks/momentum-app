"use client"

import { useState } from "react"
import { toast } from "sonner"
import { Lock, MoreHorizontal, UserPlus } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"
import type { SettingsTeamMember } from "@/lib/db/types"

const roleBadgeVariant: Record<
  SettingsTeamMember["role"],
  "default" | "secondary" | "outline"
> = {
  Admin: "default",
  Manager: "secondary",
  Viewer: "outline",
}

export function TeamContent({
  team: initialTeam,
  currentUserRole,
}: {
  team: SettingsTeamMember[]
  currentUserRole: string
}) {
  const [team, setTeam] = useState(initialTeam)
  const [revokeTarget, setRevokeTarget] = useState<SettingsTeamMember | null>(
    null
  )
  const [inviteOpen, setInviteOpen] = useState(false)
  const [inviteName, setInviteName] = useState("")
  const [inviteEmail, setInviteEmail] = useState("")
  const [inviteRole, setInviteRole] =
    useState<SettingsTeamMember["role"]>("Viewer")

  if (currentUserRole !== "Admin") {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-16 text-center">
          <Lock className="h-10 w-10 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-1">
            Admin Access Required
          </h3>
          <p className="text-sm text-muted-foreground max-w-sm">
            Contact your administrator to manage team and billing settings.
          </p>
        </CardContent>
      </Card>
    )
  }

  function handleRevoke() {
    if (!revokeTarget) return
    setTeam((prev) => prev.filter((m) => m.id !== revokeTarget.id))
    toast.success(`Access revoked for ${revokeTarget.name}`)
    setRevokeTarget(null)
  }

  function handleInvite() {
    if (!inviteName || !inviteEmail) return
    const newMember: SettingsTeamMember = {
      id: `tm-${Date.now()}`,
      name: inviteName,
      email: inviteEmail,
      role: inviteRole,
      status: "Invited",
    }
    setTeam((prev) => [...prev, newMember])
    toast.success(`Invitation sent to ${inviteEmail}`)
    setInviteName("")
    setInviteEmail("")
    setInviteRole("Viewer")
    setInviteOpen(false)
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Team & Access</h2>
          <p className="text-sm text-muted-foreground">
            Manage who has access to your agency workspace.
          </p>
        </div>
        <Button onClick={() => setInviteOpen(true)}>
          <UserPlus className="h-4 w-4 mr-2" />
          Invite User
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table className="table-fixed">
            <TableHeader>
              <TableRow>
                <TableHead className="text-sm font-medium text-muted-foreground border-b bg-transparent">Name</TableHead>
                <TableHead className="text-sm font-medium text-muted-foreground border-b bg-transparent">Email</TableHead>
                <TableHead className="text-sm font-medium text-muted-foreground border-b bg-transparent">Role</TableHead>
                <TableHead className="text-sm font-medium text-muted-foreground border-b bg-transparent">Status</TableHead>
                <TableHead className="w-12 text-sm font-medium text-muted-foreground border-b bg-transparent" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {team.map((member) => (
                <TableRow key={member.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold">
                        {member.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </div>
                      {member.name}
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {member.email}
                  </TableCell>
                  <TableCell>
                    <Badge variant={roleBadgeVariant[member.role]}>
                      {member.role}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        member.status === "Active" ? "default" : "secondary"
                      }
                    >
                      {member.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger
                        render={<Button variant="ghost" size="icon-xs" aria-label="Team member options" />}
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>Change Role</DropdownMenuItem>
                        <DropdownMenuItem
                          variant="destructive"
                          onClick={() => setRevokeTarget(member)}
                        >
                          Revoke Access
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Revoke Confirmation Dialog */}
      <Dialog
        open={!!revokeTarget}
        onOpenChange={(open) => !open && setRevokeTarget(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Revoke Access</DialogTitle>
            <DialogDescription>
              Are you sure you want to revoke access for {revokeTarget?.name}?
              They will immediately lose access to all agency data.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRevokeTarget(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleRevoke}>
              Revoke Access
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Invite User Dialog */}
      <Dialog open={inviteOpen} onOpenChange={setInviteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Invite Team Member</DialogTitle>
            <DialogDescription>
              Send an invitation to join your agency workspace.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Name</label>
              <Input
                value={inviteName}
                onChange={(e) => setInviteName(e.target.value)}
                placeholder="Full name"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Email</label>
              <Input
                type="email"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                placeholder="email@example.com"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Role</label>
              <Select
                value={inviteRole}
                onValueChange={(v) => {
                  if (v) setInviteRole(v as SettingsTeamMember["role"])
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Admin">Admin</SelectItem>
                  <SelectItem value="Manager">Manager</SelectItem>
                  <SelectItem value="Viewer">Viewer</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Admins have full access to billing, team management, and all
                financial data.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setInviteOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleInvite}
              disabled={!inviteName || !inviteEmail}
            >
              Send Invite
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
