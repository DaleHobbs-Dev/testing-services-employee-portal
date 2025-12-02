export default function Button({
  children,
  variant = "primary",
  className = "",
  ...props
}) {
  const base =
    "px-4 py-2 rounded-md font-medium transition-colors cursor-pointer";

  const variants = {
    primary: "bg-purple-500 text-white hover:bg-purple-700",
    accent: "bg-mint-500 text-white hover:bg-mint-700",
    outline: "border border-purple-500 text-purple-500 hover:bg-purple-100",
    danger: "bg-danger-500 text-white hover:bg-red-700",
    ghost: "bg-transparent text-purple-500 hover:bg-purple-50",
    secondary: "bg-gray-200 text-gray-800 hover:bg-gray-300",
  };

  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
}
