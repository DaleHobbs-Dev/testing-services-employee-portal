export function Badge({
  children,
  variant = "default",
  size = "md",
  className = "",
}) {
  const variants = {
    default: "bg-gray-200 text-gray-800",
    primary: "bg-purple-100 text-purple-700",
    accent: "bg-mint-100 text-mint-700",
    success: "bg-green-100 text-green-700",
    warning: "bg-yellow-100 text-yellow-700",
    danger: "bg-red-100 text-red-700",

    // role-based colors
    admin: "bg-purple-100 text-purple-700",
    proctor: "bg-blue-100 text-blue-700",
    technician: "bg-orange-100 text-orange-700",
    checkin: "bg-indigo-100 text-indigo-700",
    scheduler: "bg-emerald-100 text-emerald-700",
    clerk: "bg-gray-300 text-gray-800",
    restricted: "bg-yellow-100 text-yellow-800",
    inactive: "bg-gray-200 text-gray-500",
  };

  const sizes = {
    sm: "text-xs px-2 py-0.5",
    md: "text-xs px-2.5 py-0.5",
    lg: "text-sm px-3 py-1",
    xl: "text-base px-4 py-1.5",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full font-medium ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {children}
    </span>
  );
}
