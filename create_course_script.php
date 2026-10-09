<?php
define('CLI_SCRIPT', true);
require('d:/Project/Website/moodle.local/moodle/public/config.php');
require_once($CFG->dirroot.'/course/lib.php');
require_once($CFG->dirroot.'/group/lib.php');
require_once($CFG->dirroot.'/lib/enrollib.php');
require_once($CFG->dirroot.'/user/lib.php');

echo "Bootstrapped Moodle.\n";

global $DB;

// 1. Check or Create Category
$category = $DB->get_record('course_categories', ['name' => 'General']);
if (!$category) {
    $category = $DB->get_record('course_categories', []); // just get first
}

// 2. Create Course
$course = $DB->get_record('course', ['shortname' => 'MTK-71']);
if (!$course) {
    $coursedata = new stdClass();
    $coursedata->fullname = 'Matematika Kelas 7.1';
    $coursedata->shortname = 'MTK-71';
    $coursedata->category = $category->id;
    $coursedata->visible = 1;
    $coursedata->startdate = time();
    $coursedata->format = 'topics';
    $coursedata->numsections = 4;
    
    $course = create_course($coursedata);
    echo "Created Course: " . $course->fullname . " (ID: " . $course->id . ")\n";
} else {
    echo "Course already exists: " . $course->fullname . "\n";
}

// 3. Find or Create Users
function get_or_create_user($username, $firstname, $lastname, $email) {
    global $DB;
    $user = $DB->get_record('user', ['username' => $username]);
    if (!$user) {
        $user = new stdClass();
        $user->username = $username;
        $user->password = hash_internal_user_password('Moodle123!');
        $user->firstname = $firstname;
        $user->lastname = $lastname;
        $user->email = $email;
        $user->confirmed = 1;
        $user->mnethostid = $CFG->mnet_localhost_id ?? 1;
        $user->lang = 'en';
        $user->auth = 'manual';
        $user->id = user_create_user($user);
        echo "Created User: " . $username . "\n";
    }
    return $user;
}

$student = get_or_create_user('siswa1', 'Siswa', 'Satu', 'siswa1@example.com');
$teacher = get_or_create_user('guru1', 'Guru', 'Satu', 'guru1@example.com');

// 4. Enrol Users
$enrol = enrol_get_plugin('manual');
$instances = enrol_get_instances($course->id, true);
$manualinstance = null;
foreach ($instances as $instance) {
    if ($instance->enrol === 'manual') {
        $manualinstance = $instance;
        break;
    }
}

if ($manualinstance) {
    $student_role = $DB->get_record('role', ['shortname' => 'student']);
    $teacher_role = $DB->get_record('role', ['shortname' => 'editingteacher']);
    
    $enrol->enrol_user($manualinstance, $student->id, $student_role->id);
    $enrol->enrol_user($manualinstance, $teacher->id, $teacher_role->id);
    echo "Enrolled Users.\n";
} else {
    echo "Manual enrol instance not found.\n";
}

// 5. Create Group and Assign
$group = $DB->get_record('groups', ['courseid' => $course->id, 'name' => 'Kelas 7.1']);
if (!$group) {
    $groupdata = new stdClass();
    $groupdata->courseid = $course->id;
    $groupdata->name = 'Kelas 7.1';
    $groupdata->description = 'Group Kelas 7.1';
    groups_create_group($groupdata);
    $group = $DB->get_record('groups', ['courseid' => $course->id, 'name' => 'Kelas 7.1']);
    echo "Created Group.\n";
}

groups_add_member($group->id, $student->id);
groups_add_member($group->id, $teacher->id);
echo "Added members to group.\n";

// 6. Create Quiz
$quiz = $DB->get_record('quiz', ['course' => $course->id, 'name' => 'Kuis Matematika 1']);
if (!$quiz) {
    require_once($CFG->dirroot.'/course/modlib.php');
    
    $quizdata = new stdClass();
    $quizdata->course = $course->id;
    $quizdata->name = 'Kuis Matematika 1';
    $quizdata->intro = 'Kuis ini berisi soal-soal matematika kelas 7.1';
    $quizdata->introformat = FORMAT_HTML;
    $quizdata->timeopen = 0;
    $quizdata->timeclose = 0;
    $quizdata->timelimit = 3600;
    $quizdata->modulename = 'quiz';
    
    // Create course module instance
    $module = $DB->get_record('modules', ['name' => 'quiz']);
    $quizdata->module = $module->id;
    $quizdata->section = 1;
    
    // Add module
    $quizdata->coursemodule = add_course_module($quizdata);
    $quizdata->section = course_add_cm_to_section($course, $quizdata->coursemodule, 1);
    
    // Insert quiz record (simplified)
    $quizdata->id = $DB->insert_record('quiz', $quizdata);
    
    // Update course module instance
    $DB->set_field('course_modules', 'instance', $quizdata->id, ['id' => $quizdata->coursemodule]);
    echo "Created Quiz.\n";
} else {
    echo "Quiz already exists.\n";
}

echo "Done.\n";
