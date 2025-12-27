"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Modal, ModalFooter } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { createIncidentSchema, type CreateIncidentDto } from "@/lib/api/incidents/dto";
import { incidentsApi } from "@/lib/api/incidents";
import { useRouter } from "next/navigation";

interface CreateIncidentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateIncidentModal({ isOpen, onClose }: CreateIncidentModalProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateIncidentDto>({
    resolver: zodResolver(createIncidentSchema),
    defaultValues: {
      severity: "P2",
      status: "ai-investigating",
    },
  });

  const onSubmit = async (data: CreateIncidentDto) => {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const response = await incidentsApi.create({
        title: data.title,
        service: data.service,
        severity: data.severity,
        status: data.status || "ai-investigating",
        description: data.description,
      });

      if (!response.success || response.error) {
        const errorMsg = response.error?.message || response.error?.code || "Failed to create incident";
        console.error("API Error:", response.error);
        setSubmitError(errorMsg);
        return;
      }
      
      if (!response.data) {
        setSubmitError("No data returned from server");
        return;
      }

      // Reset form and close modal
      reset();
      onClose();
      
      // Refresh the page to show new incident
      router.refresh();
      
      // Optionally navigate to the incident detail page
      if (response.data) {
        router.push(`/dashboard/incidents/${response.data.id}`);
      }
    } catch (error) {
      console.error("Error creating incident:", error);
      let errorMessage = "Failed to create incident";
      
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === "object" && error !== null) {
        const apiError = error as { error?: { message?: string; statusCode?: number } };
        if (apiError.error?.message) {
          errorMessage = apiError.error.message;
          if (apiError.error.statusCode === 401) {
            errorMessage = "Unauthorized. Please log in again.";
          } else if (apiError.error.statusCode === 400) {
            errorMessage = apiError.error.message || "Invalid data. Please check your input.";
          }
        }
      }
      
      setSubmitError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      reset();
      setSubmitError(null);
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Create New Incident" size="lg">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Title"
          placeholder="e.g., Database Connection Timeout"
          error={errors.title?.message}
          {...register("title")}
          required
        />

        <Input
          label="Service"
          placeholder="e.g., checkout-db"
          error={errors.service?.message}
          {...register("service")}
          required
        />

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Severity <span className="text-severity-p1">*</span>
          </label>
          <select
            className="flex h-10 w-full rounded-lg bg-surface-dark border border-slate-700 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background-dark focus:border-transparent"
            {...register("severity")}
          >
            <option value="P1">P1 - Critical</option>
            <option value="P2">P2 - High</option>
            <option value="P3">P3 - Medium</option>
            <option value="P4">P4 - Low</option>
          </select>
          {errors.severity && (
            <p className="mt-1 text-xs text-severity-p1">{errors.severity.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Description (Optional)
          </label>
          <textarea
            className="flex min-h-[100px] w-full rounded-lg bg-surface-dark border border-slate-700 px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background-dark focus:border-transparent resize-none"
            placeholder="Describe the incident..."
            {...register("description")}
          />
          {errors.description && (
            <p className="mt-1 text-xs text-severity-p1">{errors.description.message}</p>
          )}
        </div>

        {submitError && (
          <div className="rounded-lg bg-severity-p1/10 border border-severity-p1/50 p-3">
            <p className="text-sm text-severity-p1">{submitError}</p>
          </div>
        )}

        <ModalFooter>
          <Button
            type="button"
            variant="secondary"
            onClick={handleClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button type="submit" variant="primary" loading={isSubmitting}>
            Create Incident
          </Button>
        </ModalFooter>
      </form>
    </Modal>
  );
}

