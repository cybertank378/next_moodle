"use client";

import { useCallback, useState } from "react";
import { type RequestState, request } from "@/libs/apiClient";
import type {
  EnrolUserRequestDto,
  ListEnrolmentsQueryDto,
  UnenrolUserRequestDto,
} from "../../domain/dto/EnrolmentRequestDto";
import type { EnrolmentListResponseDto } from "../../domain/dto/EnrolmentResponseDto";

export function useEnrolmentApi() {
  const [enrolmentsState, setEnrolmentsState] = useState<
    RequestState<EnrolmentListResponseDto>
  >({
    data: null,
    error: null,
    loading: false,
  });

  const [enrolState, setEnrolState] = useState<
    RequestState<{ success: boolean }>
  >({
    data: null,
    error: null,
    loading: false,
  });

  const [unenrolState, setUnenrolState] = useState<
    RequestState<{ success: boolean }>
  >({
    data: null,
    error: null,
    loading: false,
  });

  const listEnrolments = useCallback(async (params: ListEnrolmentsQueryDto) => {
    setEnrolmentsState({ data: null, error: null, loading: true });
    const query = new URLSearchParams();
    query.set("courseId", String(params.courseId));
    if (params.search) query.set("search", params.search);
    if (params.page) query.set("page", String(params.page));
    if (params.pageSize) query.set("pageSize", String(params.pageSize));

    const result = await request<EnrolmentListResponseDto>(
      `/api/enrolments?${query.toString()}`,
    );
    setEnrolmentsState({ ...result, loading: false });
    return result;
  }, []);

  const enrolUser = useCallback(
    async (
      payload: EnrolUserRequestDto | { enrolments: EnrolUserRequestDto[] },
    ) => {
      setEnrolState({ data: null, error: null, loading: true });
      const body =
        "enrolments" in payload ? payload : { enrolments: [payload] };
      const result = await request<{ success: boolean }>("/api/enrolments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      setEnrolState({ ...result, loading: false });
      return result;
    },
    [],
  );

  const unenrolUser = useCallback(
    async (
      payload: UnenrolUserRequestDto | { enrolments: UnenrolUserRequestDto[] },
    ) => {
      setUnenrolState({ data: null, error: null, loading: true });
      const body =
        "enrolments" in payload ? payload : { enrolments: [payload] };
      const result = await request<{ success: boolean }>("/api/enrolments", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      setUnenrolState({ ...result, loading: false });
      return result;
    },
    [],
  );

  return {
    enrolmentsState,
    enrolState,
    unenrolState,
    listEnrolments,
    enrolUser,
    unenrolUser,
  };
}
