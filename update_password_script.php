<?php
define('CLI_SCRIPT', true);
require('d:/Project/Website/moodle.local/moodle/public/config.php');
require_once($CFG->dirroot.'/user/lib.php');

echo "Bootstrapped Moodle.\n";

global $DB;

$usernames = ['siswa1', 'guru1'];

foreach ($usernames as $username) {
    $user = $DB->get_record('user', ['username' => $username]);
    if ($user) {
        $user->password = hash_internal_user_password('Moodle123!');
        $DB->update_record('user', $user);
        echo "Updated password for user: " . $username . "\n";
    }
}
echo "Done.\n";
