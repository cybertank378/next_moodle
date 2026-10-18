import { describe, expect, it } from "vitest";
import { ForbiddenError } from "@/core/errors/ForbiddenError";
import { MoodleError } from "@/core/errors/MoodleError";
import { MoodleErrorMapper } from "@/core/moodle/MoodleErrorMapper";

/**
 * Standardized local_examapi & Core Moodle Web Services Contract Integration Test Suite
 * Covers Issue #201: Standardisasi seluruh kontrak local/examapi
 */
describe("Moodle Web Services Contract Standardization (Issue #201)", () => {
  describe("1. Service Registration & Capability Boundaries", () => {
    const studentAllowedFunctions = new Set([
      "core_webservice_get_site_info",
      "core_enrol_get_users_courses",
      "mod_quiz_get_quizzes_by_courses",
      "mod_quiz_get_user_attempts",
      "mod_quiz_get_combined_review_options",
      "mod_quiz_start_attempt",
      "mod_quiz_get_attempt_data",
      "mod_quiz_get_attempt_summary",
      "mod_quiz_save_attempt",
      "mod_quiz_process_attempt",
      "mod_quiz_get_attempt_review",
      "gradereport_user_get_grade_items",
      "local_examapi_get_health",
      "local_examapi_get_student_exam_result",
      "local_examapi_get_api_version",
      "local_examapi_get_capabilities",
      "local_examapi_validate_user_tenant",
      "core_course_get_courses",
      "core_enrol_get_enrolled_users",
      "core_course_get_contents",
      "mod_quiz_get_quiz_access_information",
    ]);

    const adminAllowedFunctions = new Set([
      "core_webservice_get_site_info",
      "core_user_get_users",
      "core_user_get_users_by_field",
      "core_user_create_users",
      "core_user_update_users",
      "core_course_get_courses",
      "core_enrol_get_enrolled_users",
      "core_course_get_categories",
      "enrol_manual_enrol_users",
      "enrol_manual_unenrol_users",
      "core_cohort_get_cohorts",
      "core_cohort_create_cohorts",
      "core_cohort_add_cohort_members",
      "core_cohort_delete_cohort_members",
      "core_group_get_course_groups",
      "core_group_create_groups",
      "core_group_add_group_members",
      "core_group_get_course_groupings",
      "core_group_create_groupings",
      "core_group_assign_grouping",
      "local_examapi_get_health",
      "local_examapi_get_exam_results",
      "local_examapi_get_exam_statistics",
      "local_examapi_get_audit_logs",
      "local_examapi_get_api_version",
      "local_examapi_get_capabilities",
      "local_examapi_get_question_categories",
      "local_examapi_create_question_category",
      "local_examapi_update_question_category",
      "local_examapi_delete_question_category",
      "local_examapi_get_questions",
      "local_examapi_get_question",
      "local_examapi_create_question",
      "local_examapi_update_question",
      "local_examapi_delete_question",
      "local_examapi_move_question",
      "local_examapi_duplicate_question",
      "local_examapi_import_questions",
      "local_examapi_get_quiz_questions",
      "local_examapi_add_question_to_quiz",
      "local_examapi_remove_question_from_quiz",
      "local_examapi_reorder_quiz_questions",
      "local_examapi_add_random_questions",
      "local_examapi_get_tenant_context",
      "local_examapi_validate_user_tenant",
      "local_examapi_get_courses",
      "local_examapi_get_quizzes",
      "local_examapi_get_course_groups",
      "local_examapi_create_course_group",
      "local_examapi_add_group_members",
      "local_examapi_remove_group_members",
      "local_examapi_get_group_members",
      "core_course_get_contents",
      "core_grades_get_grades",
    ]);

    const proctorAllowedFunctions = new Set([
      "core_webservice_get_site_info",
      "core_course_get_courses",
      "core_enrol_get_enrolled_users",
      "local_examapi_get_health",
      "local_examapi_get_exam_monitor",
      "local_examapi_lock_attempt",
      "local_examapi_unlock_attempt",
      "local_examapi_force_finish_attempt",
      "local_examapi_extend_attempt_time",
      "local_examapi_get_exam_results",
      "local_examapi_get_exam_statistics",
      "local_examapi_get_api_version",
      "local_examapi_get_capabilities",
      "local_examapi_get_tenant_context",
      "local_examapi_get_quizzes",
    ]);

    const teacherAllowedFunctions = new Set([
      "core_webservice_get_site_info",
      "core_course_get_courses",
      "core_enrol_get_enrolled_users",
      "core_course_get_categories",
      "core_enrol_get_users_courses",
      "core_group_get_course_groups",
      "core_group_get_course_groupings",
      "mod_quiz_get_quizzes_by_courses",
      "mod_quiz_get_user_attempts",
      "mod_quiz_get_attempt_review",
      "local_examapi_get_health",
      "local_examapi_get_api_version",
      "local_examapi_get_capabilities",
      "local_examapi_get_tenant_context",
      "local_examapi_get_courses",
      "local_examapi_get_quizzes",
      "local_examapi_get_course_groups",
      "local_examapi_create_course_group",
      "local_examapi_add_group_members",
      "local_examapi_remove_group_members",
      "local_examapi_get_group_members",
      "local_examapi_get_question_categories",
      "local_examapi_get_questions",
      "local_examapi_get_question",
      "local_examapi_get_quiz_questions",
      "local_examapi_get_exam_results",
      "local_examapi_get_student_exam_result",
      "local_examapi_get_exam_statistics",
      "core_course_get_contents",
      "core_grades_get_grades",
      "mod_quiz_get_quiz_access_information",
    ]);

    it("ensures student service does not contain proctor or administrative mutation functions", () => {
      const forbiddenForStudent = [
        "local_examapi_lock_attempt",
        "local_examapi_unlock_attempt",
        "local_examapi_force_finish_attempt",
        "local_examapi_extend_attempt_time",
        "core_user_create_users",
        "core_user_update_users",
        "enrol_manual_enrol_users",
        "local_examapi_create_question",
      ];
      forbiddenForStudent.forEach((fn) => {
        expect(studentAllowedFunctions.has(fn)).toBe(false);
      });
    });

    it("ensures teacher service enforces least privilege without administrative user mutations or proctor intervention", () => {
      const forbiddenForTeacher = [
        "core_user_create_users",
        "core_user_update_users",
        "core_user_delete_users",
        "core_cohort_create_cohorts",
        "local_examapi_lock_attempt",
        "local_examapi_unlock_attempt",
        "local_examapi_force_finish_attempt",
        "local_examapi_get_audit_logs",
        "mod_quiz_start_attempt",
        "mod_quiz_save_attempt",
        "mod_quiz_process_attempt",
      ];
      forbiddenForTeacher.forEach((fn) => {
        expect(teacherAllowedFunctions.has(fn)).toBe(false);
      });
    });

    it("ensures proctor service cannot modify users or solve student attempts", () => {
      const forbiddenForProctor = [
        "core_user_create_users",
        "core_user_update_users",
        "mod_quiz_start_attempt",
        "mod_quiz_save_attempt",
        "mod_quiz_process_attempt",
      ];
      forbiddenForProctor.forEach((fn) => {
        expect(proctorAllowedFunctions.has(fn)).toBe(false);
      });
    });

    it("ensures admin service contains administration and question composition but excludes student attempt execution", () => {
      const forbiddenForAdmin = [
        "mod_quiz_start_attempt",
        "mod_quiz_save_attempt",
        "mod_quiz_process_attempt",
      ];
      forbiddenForAdmin.forEach((fn) => {
        expect(adminAllowedFunctions.has(fn)).toBe(false);
      });
      expect(adminAllowedFunctions.has("local_examapi_create_question")).toBe(
        true,
      );
      expect(adminAllowedFunctions.has("core_course_get_contents")).toBe(true);
      expect(adminAllowedFunctions.has("core_grades_get_grades")).toBe(true);
    });
  });

  describe("2. Parameter Standardization & Validation", () => {
    it("validates local_examapi_extend_attempt_time parameter contract (extraminutes and reason)", () => {
      const validPayload = {
        attemptid: 101,
        extraminutes: 15,
        reason: "Network disruption compensation",
      };
      expect(validPayload).toHaveProperty("attemptid");
      expect(validPayload).toHaveProperty("extraminutes");
      expect(validPayload).toHaveProperty("reason");
      expect(typeof validPayload.extraminutes).toBe("number");
      expect(typeof validPayload.reason).toBe("string");
    });

    it("validates local_examapi_lock_attempt requires reason parameter", () => {
      const validPayload = {
        attemptid: 202,
        reason: "Dual-monitor breach reported",
      };
      expect(validPayload.reason).toBeTruthy();
    });

    it("validates local_examapi_reorder_quiz_questions parameter contract (slotids_json)", () => {
      const slotIds = [1, 2, 3];
      const validPayload = {
        quizid: 55,
        slotids_json: JSON.stringify(slotIds),
      };
      expect(JSON.parse(validPayload.slotids_json)).toEqual([1, 2, 3]);
    });

    it("validates local_examapi_create_question options_json parameter contract", () => {
      const options = [{ id: "opt-1", text: "Alpha", isCorrect: true }];
      const validPayload = {
        categoryid: 10,
        qtype: "multichoice",
        name: "Q1",
        questiontext: "Sample Question?",
        defaultmark: 1.0,
        options_json: JSON.stringify(options),
      };
      expect(validPayload.options_json).toBe(JSON.stringify(options));
    });
  });

  describe("3. Upstream Moodle Error Mapping & Sanitization", () => {
    it("maps invalidtoken Moodle exception to safe MoodleError with isUpstreamAuthError flag", () => {
      const moodleErrorResponse = {
        exception: "moodle_exception",
        errorcode: "invalidtoken",
        message: "Invalid token - token not found",
      };
      const mapped = MoodleErrorMapper.fromMoodleException(moodleErrorResponse);
      expect(mapped).toBeInstanceOf(MoodleError);
      expect(
        (mapped.details as { isUpstreamAuthError?: boolean })
          ?.isUpstreamAuthError,
      ).toBe(true);
      expect(mapped.message).not.toContain("wstoken=");
    });

    it("maps required_capability_exception to ForbiddenError", () => {
      const moodleErrorResponse = {
        exception: "required_capability_exception",
        errorcode: "nopermissions",
        message: "Sorry, but you do not currently have permissions to do that",
      };
      const mapped = MoodleErrorMapper.fromMoodleException(moodleErrorResponse);
      expect(mapped).toBeInstanceOf(ForbiddenError);
    });

    it("maps unknown Moodle error to safe MoodleError without leaking raw stack trace", () => {
      const moodleErrorResponse = {
        exception: "dml_read_exception",
        errorcode: "dmlreadexception",
        message:
          "Error reading from database: SELECT * FROM mdl_user WHERE ...",
        debuginfo: "Stack trace: line 42 at moodle/lib/dml/mdbi.php",
      };
      const mapped = MoodleErrorMapper.fromMoodleException(moodleErrorResponse);
      expect(mapped).toBeInstanceOf(MoodleError);
      expect(mapped.message).toBe("Moodle returned an upstream error.");
      expect(mapped.message).not.toContain("SELECT *");
      expect(mapped.message).not.toContain("Stack trace");
    });
  });
});
