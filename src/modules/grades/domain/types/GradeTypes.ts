export interface RawMoodleGradeItem {
  id: number;
  itemname?: string | null;
  itemtype: string;
  itemmodule?: string | null;
  iteminstance?: number | null;
  itemnumber?: number | null;
  idnumber?: string | null;
  categoryid?: number | null;
  outcomeid?: number | null;
  scaleid?: number | null;
  locked?: boolean | number | null;
  cmid?: number | null;
  graderaw?: number | null;
  gradedatesubmitted?: number | null;
  gradedategraded?: number | null;
  gradeformatted?: string | null;
  grademin?: number | null;
  grademax?: number | null;
  gradepass?: number | null;
  feedback?: string | null;
  feedbackformat?: number | null;
  percentageformatted?: string | null;
  lettergradeformatted?: string | null;
  rank?: number | null;
  numusers?: number | null;
  averageformatted?: string | null;
}

export interface RawMoodleUserGrade {
  courseid: number;
  userid: number;
  userfullname?: string | null;
  useridnumber?: string | null;
  maxdepth?: number;
  gradeitems?: RawMoodleGradeItem[];
}

export interface RawMoodleGradeReportResponse {
  usergrades?: RawMoodleUserGrade[];
  warnings?: Array<{
    item?: string;
    itemid?: number;
    warningcode: string;
    message: string;
  }>;
}

export interface RawMoodleCoreGradeItem {
  activityid?: number | string;
  itemnumber?: number;
  scaleid?: number;
  name?: string;
  grades?: Array<{
    id: number;
    userid: number;
    grade?: number | null;
    str_grade?: string | null;
    str_long_grade?: string | null;
    locked?: number | boolean;
    hidden?: number | boolean;
    overridden?: number | boolean;
    feedback?: string | null;
    feedbackformat?: number;
    usermodified?: number;
    datesubmitted?: number | null;
    dategraded?: number | null;
  }>;
}

export interface RawMoodleCoreGradesResponse {
  items?: RawMoodleCoreGradeItem[];
  outcomes?: unknown[];
  warnings?: Array<{
    item?: string;
    itemid?: number;
    warningcode: string;
    message: string;
  }>;
}
