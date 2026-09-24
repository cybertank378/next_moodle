"use client";

import { useEffect, useRef, useState } from "react";
import { TERMS_CONTENT } from "@/sections/auth/atoms/terms";
import Button from "@/shared-ui/component/Button";
import { Modal } from "@/shared-ui/component/Modal";

interface Props {
  readonly open: boolean;
  readonly onClose: () => void;
  readonly onAgree?: () => void;
}

export default function TermsConditionsModal({
  open,
  onClose,
  onAgree,
}: Props) {
  const [checked, setChecked] = useState(false);
  const [hasReadAll, setHasReadAll] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (open) {
      setChecked(false);
      setHasReadAll(false);
    }
  }, [open]);
  return (
    <Modal open={open} onClose={onClose} size="lg">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-800">
          Syarat & Ketentuan
        </h2>
        <p className="text-sm text-gray-600">
          Harap baca hingga selesai untuk melanjutkan
        </p>
      </div>
      <div
        ref={contentRef}
        className="max-h-72 overflow-y-auto whitespace-pre-line pr-2 text-sm leading-7 text-gray-700"
        onScroll={(event) => {
          const element = event.currentTarget;
          if (
            element.scrollTop + element.clientHeight >=
            element.scrollHeight - 8
          )
            setHasReadAll(true);
        }}
      >
        {TERMS_CONTENT}
      </div>
      <div className="mt-6 space-y-4 border-t pt-4">
        {onAgree ? (
          <label className="flex items-start gap-2 text-sm text-gray-700">
            <input
              checked={checked}
              disabled={!hasReadAll}
              onChange={(event) => setChecked(event.target.checked)}
              type="checkbox"
            />
            {hasReadAll
              ? "Saya telah membaca dan menyetujui Syarat & Ketentuan"
              : "Scroll ke bawah untuk mengaktifkan persetujuan"}
          </label>
        ) : null}
        <div className="flex justify-end gap-3">
          <Button onClick={onClose} variant="ghost">
            Tutup
          </Button>
          {onAgree ? (
            <Button disabled={!checked} onClick={onAgree}>
              Setuju
            </Button>
          ) : null}
        </div>
      </div>
    </Modal>
  );
}
