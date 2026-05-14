"use client"

import { useState } from "react"
import { toast } from "sonner"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import type { SettingsData } from "@/lib/db/types"

export function SecurityContent({
  security,
}: {
  security: SettingsData["security"]
}) {
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [twoFactor, setTwoFactor] = useState(security.twoFactorEnabled)
  const [saving, setSaving] = useState(false)

  const canSubmitPassword =
    currentPassword.length > 0 &&
    newPassword.length > 0 &&
    newPassword === confirmPassword

  function handleUpdatePassword() {
    setSaving(true)
    setTimeout(() => {
      setSaving(false)
      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")
      toast.success("Password updated")
    }, 600)
  }

  return (
    <div className="flex flex-col gap-8">
      <Card>
        <CardHeader>
          <CardTitle>Change Password</CardTitle>
          <CardDescription>Update your account password.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Current Password</label>
            <Input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="max-w-sm"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium">New Password</label>
            <Input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="max-w-sm"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Confirm New Password</label>
            <Input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="max-w-sm"
            />
            {confirmPassword.length > 0 && newPassword !== confirmPassword && (
              <p className="text-xs text-destructive">Passwords do not match.</p>
            )}
          </div>
          <div className="flex justify-end pt-2">
            <Button onClick={handleUpdatePassword} disabled={!canSubmitPassword || saving}>
              {saving ? "Updating..." : "Update Password"}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Two-Factor Authentication</CardTitle>
          <CardDescription>Add an extra layer of security to your account.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Enable 2FA</p>
              <p className="text-sm text-muted-foreground">
                Require a verification code in addition to your password when signing in.
              </p>
            </div>
            <Switch
              checked={twoFactor}
              onCheckedChange={(val) => {
                setTwoFactor(val)
                toast.success(val ? "Two-factor authentication enabled" : "Two-factor authentication disabled")
              }}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
