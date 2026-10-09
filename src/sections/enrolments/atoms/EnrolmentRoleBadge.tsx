interface Props {
  roleName: string;
}

export default function EnrolmentRoleBadge({ roleName }: Props) {
  const isTeacher =
    roleName.toLowerCase().includes("teacher") ||
    roleName.toLowerCase().includes("guru") ||
    roleName.toLowerCase().includes("pengajar");

  if (isTeacher) {
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800  ">
        {roleName}
      </span>
    );
  }

  return (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800  ">
      {roleName}
    </span>
  );
}
