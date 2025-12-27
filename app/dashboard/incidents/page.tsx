"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table";
import { IncidentCard } from "@/components/features/IncidentCard";
import { CreateIncidentModal } from "@/components/features/CreateIncidentModal";
import type { Incident } from "@/lib/types";

const incidents: Incident[] = [
  {
    id: "INC-2847",
    title: "Payment API 500 errors",
    service: "payment-service",
    severity: "P1",
    status: "resolved",
    mttr: "8 min",
    createdAt: "2024-12-22T03:42:00Z",
  },
  {
    id: "INC-2846",
    title: "High latency in checkout",
    service: "checkout-api",
    severity: "P2",
    status: "investigating",
    mttr: null,
    createdAt: "2024-12-22T08:15:00Z",
  },
  {
    id: "INC-2845",
    title: "Database connection pool exhausted",
    service: "user-service",
    severity: "P2",
    status: "resolved",
    mttr: "15 min",
    createdAt: "2024-12-22T01:30:00Z",
  },
  {
    id: "INC-2844",
    title: "Cache miss rate spike",
    service: "api-gateway",
    severity: "P3",
    status: "resolved",
    mttr: "5 min",
    createdAt: "2024-12-21T22:10:00Z",
  },
];

export default function IncidentsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Incidents</h1>
          <p className="text-slate-400 mt-1 text-sm">
            Monitor and manage production incidents
          </p>
        </div>
        <Button size="lg" onClick={() => setIsModalOpen(true)}>
          New Incident
        </Button>
      </div>

      <CreateIncidentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />

      <Card>
        <CardHeader>
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex-1 min-w-[200px]">
              <Input
                placeholder="Search incidents..."
                icon={<span className="material-symbols-outlined">search</span>}
              />
            </div>
            <select className="h-11 rounded-lg bg-surface-dark border border-slate-700 px-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors hover:border-slate-600">
              <option>All Severities</option>
              <option>P1</option>
              <option>P2</option>
              <option>P3</option>
            </select>
            <select className="h-11 rounded-lg bg-surface-dark border border-slate-700 px-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors hover:border-slate-600">
              <option>All Statuses</option>
              <option>Active</option>
              <option>Investigating</option>
              <option>Resolved</option>
            </select>
            <select className="h-11 rounded-lg bg-surface-dark border border-slate-700 px-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors hover:border-slate-600">
              <option>All Services</option>
              <option>payment-service</option>
              <option>checkout-api</option>
              <option>user-service</option>
            </select>
          </div>
        </CardHeader>
        <CardContent>
          {incidents.length === 0 ? (
            <div className="py-12 text-center">
              <span className="material-symbols-outlined text-6xl text-slate-600 mb-4">
                check_circle
              </span>
              <h3 className="text-lg font-medium text-white mb-2">
                All quiet on the production front
              </h3>
              <p className="text-slate-400">
                No incidents to display. Great job keeping things running smoothly!
              </p>
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Severity</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Service</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>MTTR</TableHead>
                    <TableHead>Time</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {incidents.map((incident) => (
                    <IncidentCard key={incident.id} incident={incident} />
                  ))}
                </TableBody>
              </Table>
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-700">
                <p className="text-sm text-slate-400">
                  Showing {incidents.length} incidents
                </p>
                <div className="flex items-center gap-2">
                  <Button variant="secondary" size="md" disabled>
                    Previous
                  </Button>
                  <Button variant="secondary" size="md">
                    Next
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

