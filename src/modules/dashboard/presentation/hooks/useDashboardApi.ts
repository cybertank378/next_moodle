"use client";

import { useCallback, useState } from "react";
import { request } from "@/libs/apiClient";
import type {
  AdminDashboardResponseDto,
  StudentDashboardResponseDto,
  TeacherDashboardResponseDto,
  TenantDashboardResponseDto,
  ProctorDashboardResponseDto,
} from "@/modules/dashboard/domain/dto/DashboardResponseDto";

export interface DashboardState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export function useDashboardApi() {
  const [adminState, setAdminState] = useState<DashboardState<AdminDashboardResponseDto>>({ data: null, loading: true, error: null });
  const [studentState, setStudentState] = useState<DashboardState<StudentDashboardResponseDto>>({ data: null, loading: true, error: null });
  const [teacherState, setTeacherState] = useState<DashboardState<TeacherDashboardResponseDto>>({ data: null, loading: true, error: null });
  const [tenantState, setTenantState] = useState<DashboardState<TenantDashboardResponseDto>>({ data: null, loading: true, error: null });
  const [proctorState, setProctorState] = useState<DashboardState<ProctorDashboardResponseDto>>({ data: null, loading: true, error: null });

  const fetchAdminOverview = useCallback(async (months?: number) => {
    setAdminState((prev) => ({ ...prev, loading: true, error: null }));
    const query = months ? `?months=${months}` : "";
    const res = await request<AdminDashboardResponseDto>(`/api/dashboard/admin${query}`, { method: "GET" });
    if (res.error || !res.data) {
      setAdminState((prev) => ({ data: prev.data, loading: false, error: res.error ?? "Gagal memuat ringkasan platform." }));
      return;
    }
    setAdminState({ data: res.data, loading: false, error: null });
  }, []);

  const fetchStudentOverview = useCallback(async () => {
    setStudentState((prev) => ({ ...prev, loading: true, error: null }));
    const res = await request<StudentDashboardResponseDto>(`/api/dashboard/student`, { method: "GET" });
    if (res.error || !res.data) {
      setStudentState((prev) => ({ data: prev.data, loading: false, error: res.error ?? "Gagal memuat data dashboard." }));
      return;
    }
    setStudentState({ data: res.data, loading: false, error: null });
  }, []);

  const fetchTeacherOverview = useCallback(async () => {
    setTeacherState((prev) => ({ ...prev, loading: true, error: null }));
    const res = await request<TeacherDashboardResponseDto>(`/api/dashboard/teacher`, { method: "GET" });
    if (res.error || !res.data) {
      setTeacherState((prev) => ({ data: prev.data, loading: false, error: res.error ?? "Gagal memuat data dashboard." }));
      return;
    }
    setTeacherState({ data: res.data, loading: false, error: null });
  }, []);

  const fetchTenantOverview = useCallback(async () => {
    setTenantState((prev) => ({ ...prev, loading: true, error: null }));
    const res = await request<TenantDashboardResponseDto>(`/api/dashboard/tenant`, { method: "GET" });
    if (res.error || !res.data) {
      setTenantState((prev) => ({ data: prev.data, loading: false, error: res.error ?? "Gagal memuat data dashboard." }));
      return;
    }
    setTenantState({ data: res.data, loading: false, error: null });
  }, []);

  const fetchProctorOverview = useCallback(async () => {
    setProctorState((prev) => ({ ...prev, loading: true, error: null }));
    const res = await request<ProctorDashboardResponseDto>(`/api/dashboard/proctor`, { method: "GET" });
    if (res.error || !res.data) {
      setProctorState((prev) => ({ data: prev.data, loading: false, error: res.error ?? "Gagal memuat data dashboard." }));
      return;
    }
    setProctorState({ data: res.data, loading: false, error: null });
  }, []);

  return {
    adminState,
    fetchAdminOverview,
    studentState,
    fetchStudentOverview,
    teacherState,
    fetchTeacherOverview,
    tenantState,
    fetchTenantOverview,
    proctorState,
    fetchProctorOverview,
  };
}
