// Files: src/modules/notification/infrastructure/providers/NotificationContentRenderer.ts

import type { NotificationContentRendererInterface } from "@/modules/notification/domain/interfaces/NotificationContentRendererInterface";
import { RichTextRenderer } from "@/shared-ui/component/RichTextEditor/richTextRenderer";

export class NotificationContentRenderer
  extends RichTextRenderer
  implements NotificationContentRendererInterface {}
