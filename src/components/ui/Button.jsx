import { Link } from "react-router-dom";

export default function Button({
  children,
  variant = "primary",
  className = "",
  to, // <-- NEW
  ...props
}) {
  const base =
    "px-4 py-2 rounded-md font-medium transition-colors cursor-pointer focus-ring";

  const variants = {
    primary: "bg-purple-500 text-white hover:bg-purple-700",
    accent: "bg-mint-500 text-white hover:bg-mint-700",
    outline: "border border-purple-500 text-purple-500 hover:bg-purple-100",
    danger: "bg-danger-500 text-white hover:bg-red-700",
    ghost: "bg-transparent text-purple-500 hover:bg-purple-50",
    secondary: "bg-gray-200 text-gray-800 hover:bg-gray-300",
  };

  const classes = `${base} ${variants[variant]} ${className}`;

  // If "to" is provided → render a <Link>
  if (to) {
    return (
      <Link to={to} className={classes} {...props}>
        {children}
      </Link>
    );
  }

  // Otherwise → render a normal button
  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
}
