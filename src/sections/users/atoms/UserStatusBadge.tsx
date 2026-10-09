interface Props {
  suspended: boolean;
}

export default function UserStatusBadge({ suspended }: Props) {
  if (suspended) {
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-rose-100 text-rose-800  ">
        Nonaktif
      </span>
    );
  }

  return (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800  ">
      Aktif
    </span>
  );
}
