import "server-only";
import { createNotificationOutboxWorker } from "@/app/api/cron/notification-outbox/_factory";

export async function POST(request: Request): Promise<Response> {
  const secret = process.env.NOTIFICATION_OUTBOX_CRON_SECRET;
  if (!secret || request.headers.get("authorization") !== `Bearer ${secret}`) {
    return Response.json(
      { success: false, error: { code: "UNAUTHORIZED", message: "Cron authorization required." } },
      { status: 401, headers: { "Cache-Control": "no-store" } },
    );
  }
  try {
    const result = await createNotificationOutboxWorker().processNextBatch(5);
    return Response.json({ success: true, data: result }, {
      headers: { "Cache-Control": "no-store" },
    });
  } catch {
    return Response.json(
      { success: false, error: { code: "OUTBOX_FAILED", message: "Pemrosesan antrean notifikasi gagal." } },
      { status: 500, headers: { "Cache-Control": "no-store" } },
    );
  }
}
