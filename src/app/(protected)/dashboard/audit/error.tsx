"use client";
import Button from "@/shared-ui/component/Button";
export default function ErrorPage({
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <section role="alert" className="mx-auto max-w-3xl space-y-4 p-8">
      <h1 className="text-xl font-semibold">Log audit tidak dapat dimuat</h1>
      <p>Terjadi kendala saat mengambil data. Silakan coba lagi.</p>
      <Button onClick={reset}>Coba lagi</Button>
    </section>
  );
}
