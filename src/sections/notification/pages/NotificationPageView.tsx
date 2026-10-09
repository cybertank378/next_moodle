// Files: src/sections/notification/pages/NotificationPageView.tsx
import type { UserRole } from "@/libs/enums";
import NotificationInboxView from "@/sections/notification/organisms/NotificationInboxView";

interface Props {
  userRole?: UserRole;
}

export default function NotificationPageView({ userRole }: Props) {
  return <NotificationInboxView userRole={userRole} />;
}
