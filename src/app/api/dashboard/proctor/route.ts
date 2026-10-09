import { getDashboardController } from "@/app/api/dashboard/_factory";

export async function GET(req: Request) {
  const controller = getDashboardController();
  return controller.getProctorOverview(req);
}
