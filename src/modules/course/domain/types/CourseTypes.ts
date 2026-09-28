export interface CourseMetadata {
  readonly id: number;
  readonly shortName: string;
  readonly fullName: string;
  readonly displayName?: string;
  readonly idNumber?: string;
  readonly summary?: string;
  readonly format?: string;
  readonly startDate?: number;
  readonly endDate?: number;
  readonly categoryId?: number;
  readonly progress?: number | null;
  readonly isCompleted?: boolean;
  readonly imageUrl?: string | null;
}

export interface CourseModuleMetadata {
  readonly id: number;
  readonly name: string;
  readonly instanceId?: number;
  readonly modName: string; // e.g. "quiz", "resource", "forum", "assign"
  readonly url?: string;
  readonly isVisible: boolean;
  readonly completionStatus?: number;
}

export interface CourseSectionMetadata {
  readonly id: number;
  readonly name: string;
  readonly sectionNumber: number;
  readonly summary?: string;
  readonly isVisible: boolean;
  readonly modules: CourseModuleMetadata[];
}

export interface RawMoodleCourseOverviewFile {
  filename: string;
  fileurl: string;
  filesize?: number;
  mimetype?: string;
}

export interface RawMoodleCourse {
  id: number;
  shortname: string;
  fullname: string;
  displayname?: string;
  idnumber?: string;
  summary?: string;
  summaryformat?: number;
  format?: string;
  showgrades?: boolean;
  startdate?: number;
  enddate?: number;
  category?: number;
  progress?: number | null;
  completed?: boolean;
  overviewfiles?: RawMoodleCourseOverviewFile[];
}

export interface RawMoodleModule {
  id: number;
  url?: string;
  name: string;
  instance?: number;
  modicon?: string;
  modname: string;
  modplural?: string;
  indent?: number;
  onclick?: string;
  afterlink?: string;
  customdata?: string;
  completion?: number;
  visible?: number;
  uservisible?: boolean;
}

export interface RawMoodleSection {
  id: number;
  name: string;
  visible?: number;
  summary?: string;
  summaryformat?: number;
  section?: number;
  modules?: RawMoodleModule[];
}
