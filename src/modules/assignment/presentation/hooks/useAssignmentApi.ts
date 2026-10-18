"use client";

import { useCallback, useState } from "react";
import { request } from "@/libs/apiClient";
import type { AssignmentQueryDTO } from "@/modules/assignment/domain/dto/AssignmentRequestDTO";
import type {
  AssignmentItemDTO,
  AssignmentListResponseDTO,
} from "@/modules/assignment/domain/dto/AssignmentResponseDTO";

export function useAssignmentApi() {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<AssignmentListResponseDTO | null>(null);

  const fetchAssignments = useCallback(async (query?: AssignmentQueryDTO) => {
    setLoading(true);
    setError(null);

    const searchParams = new URLSearchParams();
    if (query?.courseId !== undefined) {
      searchParams.set("courseId", query.courseId.toString());
    }
    if (query?.status) {
      searchParams.set("status", query.status);
    }
    if (query?.search) {
      searchParams.set("search", query.search);
    }

    const qs = searchParams.toString();
    const endpoint = `/api/assignments${qs ? `?${qs}` : ""}`;

    const res = await request<AssignmentListResponseDTO>(endpoint);

    if (res.data) {
      setData(res.data);
      setLoading(false);
      return res.data;
    }

    const message = res.error || "Gagal memuat daftar penugasan.";
    setError(message);
    setLoading(false);
    return null;
  }, []);

  const fetchAssignmentDetail = useCallback(async (assignmentId: string) => {
    const res = await request<AssignmentItemDTO>(
      `/api/assignments/${encodeURIComponent(assignmentId)}`,
    );
    if (res.data) {
      return res.data;
    }
    throw new Error(res.error || "Gagal memuat detail tugas.");
  }, []);

  const submitAssignment = useCallback(
    async (
      assignmentId: string,
      body: {
        onlineText?: string;
        fileIds?: string[];
      },
    ) => {
      const res = await request<AssignmentItemDTO>(
        `/api/assignments/${encodeURIComponent(assignmentId)}`,
        {
          method: "POST",
          body: JSON.stringify(body),
        },
      );
      if (res.data) {
        return res.data;
      }
      throw new Error(res.error || "Gagal mengirim tugas.");
    },
    [],
  );

  return {
    loading,
    error,
    data,
    fetchAssignments,
    fetchAssignmentDetail,
    submitAssignment,
  };
}
