import type { SettingsData } from "./types"

export const CURRENT_USER_ROLE: "Admin" | "Manager" | "Viewer" = "Admin"

export const settingsData: SettingsData = {
  profile: {
    firstName: "David",
    lastName: "Aleckson",
    email: "david@agencybooks.io",
    theme: "system",
    timezone: "America/Chicago",
  },
  team: [
    {
      id: "tm-1",
      name: "David Aleckson",
      email: "david@agencybooks.io",
      role: "Admin",
      status: "Active",
    },
    {
      id: "tm-2",
      name: "Sarah Chen",
      email: "sarah@agencybooks.io",
      role: "Manager",
      status: "Active",
    },
    {
      id: "tm-3",
      name: "Marcus Johnson",
      email: "marcus@agencybooks.io",
      role: "Viewer",
      status: "Active",
    },
    {
      id: "tm-4",
      name: "Emily Rodriguez",
      email: "emily@agencybooks.io",
      role: "Manager",
      status: "Invited",
    },
    {
      id: "tm-5",
      name: "Jake Thompson",
      email: "jake@agencybooks.io",
      role: "Viewer",
      status: "Active",
    },
  ],
  billing: {
    plan: { name: "Pro Tier", price: 299, interval: "month" },
    paymentMethod: { last4: "4242", brand: "Visa", expiry: "12/27" },
    invoices: [
      { id: "inv-1", date: "2026-05-01", amount: 299, status: "Pending" },
      { id: "inv-2", date: "2026-04-01", amount: 299, status: "Paid" },
      { id: "inv-3", date: "2026-03-01", amount: 299, status: "Paid" },
    ],
  },
  notifications: {
    emailDigestDaily: true,
    emailDigestWeekly: false,
    slackConnected: false,
  },
  security: {
    twoFactorEnabled: false,
  },
}
