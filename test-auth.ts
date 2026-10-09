import { MoodleRestClient } from "./src/core/moodle/MoodleRestClient";

async function test() {
  try {
    const res = await MoodleRestClient.authenticate(
      "http://moodle.local",
      "admin",
      "admin",
      10000,
      "nextjs_admin",
    );
    console.log("Success:", res);
  } catch (e) {
    console.error("Error:", (e as Error).message);
  }
}
test();
