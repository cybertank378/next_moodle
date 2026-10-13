"use client";

import { useCallback, useState } from "react";
import { request } from "@/libs/apiClient";
import type { ScheduleQueryDTO } from "@/modules/schedule/domain/dto/ScheduleRequestDTO";
import type {
  ScheduleResponseDTO,
  ScheduleSessionItemDTO,
} from "@/modules/schedule/domain/dto/ScheduleResponseDTO";

export function useScheduleApi() {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<ScheduleResponseDTO | null>(null);

  const fetchSchedule = useCallback(async (query: ScheduleQueryDTO) => {
    setLoading(true);
    setError(null);

    const searchParams = new URLSearchParams();
    searchParams.set("from", query.from);
    searchParams.set("to", query.to);
    if (query.types && query.types.length > 0) {
      searchParams.set("types", query.types.join(","));
    }
    if (query.courseId !== undefined) {
      searchParams.set("courseId", query.courseId.toString());
    }

    const res = await request<ScheduleResponseDTO>(
      `/api/schedule?${searchParams.toString()}`,
    );

    if (res.data) {
      setData(res.data);
      setLoading(false);
      return res.data;
    }

    const message = res.error || "Gagal memuat jadwal pelajaran.";
    setError(message);
    setLoading(false);
    return null;
  }, []);

  const fetchSessionDetail = useCallback(async (sessionId: string) => {
    const res = await request<ScheduleSessionItemDTO>(
      `/api/schedule/${encodeURIComponent(sessionId)}`,
    );
    if (res.data) {
      return res.data;
    }
    throw new Error(res.error || "Gagal memuat detail sesi jadwal.");
  }, []);

  const createSchedule = useCallback(
    async (body: {
      title: string;
      sessionType: string;
      courseId: number;
      startsAt: string;
      endsAt: string;
      room?: string;
      instructor?: string;
      classGroup?: string;
      description?: string;
    }) => {
      const res = await request<ScheduleSessionItemDTO>("/api/schedule", {
        method: "POST",
        body: JSON.stringify(body),
      });
      if (res.data) return res.data;
      throw new Error(res.error || "Gagal membuat jadwal pelajaran.");
    },
    [],
  );

  const updateSchedule = useCallback(
    async (sessionId: string, body: Record<string, unknown>) => {
      const res = await request<ScheduleSessionItemDTO>(
        `/api/schedule/${encodeURIComponent(sessionId)}`,
        {
          method: "PATCH",
          body: JSON.stringify(body),
        },
      );
      if (res.data) return res.data;
      throw new Error(res.error || "Gagal memperbarui jadwal.");
    },
    [],
  );

  const publishSchedule = useCallback(async (sessionId: string) => {
    const res = await request<ScheduleSessionItemDTO>(
      `/api/schedule/${encodeURIComponent(sessionId)}/publish`,
      { method: "POST" },
    );
    if (res.data) return res.data;
    throw new Error(res.error || "Gagal mempublikasikan jadwal.");
  }, []);

  const cancelSchedule = useCallback(
    async (sessionId: string, reason?: string) => {
      const res = await request<ScheduleSessionItemDTO>(
        `/api/schedule/${encodeURIComponent(sessionId)}`,
        {
          method: "DELETE",
          body: JSON.stringify({ reason }),
        },
      );
      if (res.data) return res.data;
      throw new Error(res.error || "Gagal membatalkan sesi jadwal.");
    },
    [],
  );

  return {
    loading,
    error,
    data,
    fetchSchedule,
    fetchSessionDetail,
    createSchedule,
    updateSchedule,
    publishSchedule,
    cancelSchedule,
  };
}
