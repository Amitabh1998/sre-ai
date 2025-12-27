/**
 * Incidents API - Type-safe API functions for incidents
 */

import { apiClient } from "./client";
import type { Incident, PaginatedResponse, PaginationParams, ApiResponse } from "@/lib/types";

export const incidentsApi = {
  /**
   * Get all incidents with pagination
   */
  async getAll(params?: PaginationParams): Promise<ApiResponse<PaginatedResponse<Incident>>> {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append("page", params.page.toString());
    if (params?.pageSize) queryParams.append("pageSize", params.pageSize.toString());
    if (params?.sortBy) queryParams.append("sortBy", params.sortBy);
    if (params?.sortOrder) queryParams.append("sortOrder", params.sortOrder);

    const query = queryParams.toString();
    return apiClient.get<PaginatedResponse<Incident>>(
      `/api/incidents${query ? `?${query}` : ""}`
    );
  },

  /**
   * Get incident by ID
   */
  async getById(id: string): Promise<ApiResponse<Incident>> {
    return apiClient.get<Incident>(`/api/incidents/${id}`);
  },

  /**
   * Create new incident
   */
  async create(data: Omit<Incident, "id" | "createdAt">): Promise<ApiResponse<Incident>> {
    return apiClient.post<Incident>("/api/incidents", data);
  },

  /**
   * Update incident
   */
  async update(
    id: string,
    data: Partial<Incident>
  ): Promise<ApiResponse<Incident>> {
    return apiClient.put<Incident>(`/api/incidents/${id}`, data);
  },

  /**
   * Delete incident
   */
  async delete(id: string): Promise<ApiResponse<void>> {
    return apiClient.delete<void>(`/api/incidents/${id}`);
  },
};

