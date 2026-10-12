"use client";

import { useCallback, useState } from "react";
import { request } from "@/libs/apiClient";
import type { CalendarEventsQueryDTO } from "@/modules/calendar/domain/dto/CalendarRequestDTO";
import type { CalendarEventsResponseDTO } from "@/modules/calendar/domain/dto/CalendarResponseDTO";

export function useCalendarApi() {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<CalendarEventsResponseDTO | null>(null);

  const fetchEvents = useCallback(async (query: CalendarEventsQueryDTO) => {
    setLoading(true);
    setError(null);

    const searchParams = new URLSearchParams();
    searchParams.set("from", query.from);
    searchParams.set("to", query.to);
    if (query.types && query.types.length > 0) {
      searchParams.set("types", query.types.join(","));
    }

    const res = await request<CalendarEventsResponseDTO>(
      `/api/calendar/events?${searchParams.toString()}`,
    );

    if (res.data) {
      setData(res.data);
      setLoading(false);
      return res.data;
    }

    const message = res.error || "Gagal memuat agenda kalender.";
    setError(message);
    setLoading(false);
    return null;
  }, []);

  return {
    loading,
    error,
    data,
    fetchEvents,
  };
}
