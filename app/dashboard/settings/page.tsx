"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { Modal, ModalFooter } from "@/components/ui/Modal";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const inviteSchema = z.object({
  email: z.string().email("Invalid email address"),
  role: z.enum(["admin", "member", "viewer"]),
});

type InviteFormData = z.infer<typeof inviteSchema>;

const teamMembers = [
  {
    id: "1",
    name: "John Doe",
    email: "john@company.com",
    role: "admin",
    avatar: "JD",
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane@company.com",
    role: "member",
    avatar: "JS",
  },
  {
    id: "3",
    name: "Bob Wilson",
    email: "bob@company.com",
    role: "viewer",
    avatar: "BW",
  },
];

export default function SettingsPage() {
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<InviteFormData>({
    resolver: zodResolver(inviteSchema),
    defaultValues: {
      role: "member",
    },
  });

  const onSubmitInvite = (data: InviteFormData) => {
    setIsInviteModalOpen(false);
    // TODO: Implement invite
    if (process.env.NODE_ENV === "development") {
      console.log("Invite:", data);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Settings</h1>
        <p className="text-slate-400 mt-1">Manage your team and preferences</p>
      </div>

      <Tabs defaultValue="general">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="team">Team Members</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Organization</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Organization Name
                  </label>
                  <Input defaultValue="Acme Inc." />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Timezone
                  </label>
                  <select className="h-10 w-full rounded-lg bg-surface-dark border border-slate-700 px-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary">
                    <option>UTC</option>
                    <option>America/New_York</option>
                    <option>America/Los_Angeles</option>
                    <option>Europe/London</option>
                  </select>
                </div>
                <Button variant="primary">Save Changes</Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="team">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-white">Team Members</h2>
                <p className="text-sm text-slate-400">
                  Manage who has access to your workspace
                </p>
              </div>
              <Button variant="primary" onClick={() => setIsInviteModalOpen(true)}>
                Invite Member
              </Button>
            </div>

            <Card>
              <CardContent className="p-0">
                <div className="divide-y divide-slate-700">
                  {teamMembers.map((member) => (
                    <div
                      key={member.id}
                      className="flex items-center justify-between p-4"
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center">
                          <span className="text-white text-sm font-medium">
                            {member.avatar}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-white">{member.name}</p>
                          <p className="text-sm text-slate-400">{member.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge variant="default">
                          {member.role.charAt(0).toUpperCase() + member.role.slice(1)}
                        </Badge>
                        <select className="h-9 rounded-lg bg-surface-dark border border-slate-700 px-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary">
                          <option>Admin</option>
                          <option>Member</option>
                          <option>Viewer</option>
                        </select>
                        <Button variant="ghost" size="sm">
                          Remove
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-white">Email Notifications</p>
                  <p className="text-sm text-slate-400">
                    Receive email alerts for critical incidents
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-white">Slack Notifications</p>
                  <p className="text-sm text-slate-400">
                    Send incident updates to Slack
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-white">Weekly Summary</p>
                  <p className="text-sm text-slate-400">
                    Get a weekly report of incidents and metrics
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" />
                  <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>
              <Button variant="primary" className="mt-4">Save Preferences</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Modal
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
        title="Invite Team Member"
      >
        <form onSubmit={handleSubmit(onSubmitInvite)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Email
            </label>
            <Input
              type="email"
              placeholder="colleague@company.com"
              icon={<span className="material-symbols-outlined">mail</span>}
              {...register("email")}
              error={errors.email?.message}
            />
            {errors.email && (
              <p className="mt-1 text-xs text-severity-p1">{errors.email.message}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Role
            </label>
            <select
              className="h-10 w-full rounded-lg bg-surface-dark border border-slate-700 px-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary"
              {...register("role")}
            >
              <option value="member">Member</option>
              <option value="admin">Admin</option>
              <option value="viewer">Viewer</option>
            </select>
          </div>
          <ModalFooter>
            <Button
              type="button"
              variant="ghost"
              onClick={() => setIsInviteModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Send Invite
            </Button>
          </ModalFooter>
        </form>
      </Modal>
    </div>
  );
}

