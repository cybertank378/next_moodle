"use client";

import Button, {
  type Props as ButtonProps,
} from "@/shared-ui/component/Button";

export type LinkButtonProps = ButtonProps;

export default function LinkButton(props: ButtonProps) {
  return <Button {...props} />;
}
