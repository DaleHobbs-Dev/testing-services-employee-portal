import { Link } from "react-router-dom";

export default function Button({
  children,
  variant = "primary",
  className = "",
  to, // <-- NEW
  ...props
}) {
  const base =
    "px-3 py-2 rounded-md font-medium transition-all cursor-pointer focus:outline-none focus:ring-0 border-none";

  const variants = {
    primary: "bg-purple-500 text-white hover:bg-purple-700",
    accent: "bg-mint-500 text-white hover:bg-mint-700",
    outline: "border border-purple-500 text-purple-500 hover:bg-purple-100",
    danger: "bg-danger-500 text-white hover:bg-red-700",
    ghost: "bg-transparent text-purple-500 hover:bg-purple-50",
    secondary: "bg-gray-200 text-gray-800 hover:bg-gray-300",

    /* -------- Navbar Variants -------- */
    nav: "bg-transparent text-white hover-glow hover:text-mint-500 hover:bg-purple-900/40 hover:shadow-md focus:outline-none focus:ring-0 border-none",
    navGhost:
      "bg-transparent text-white/90 hover:bg-white/10 hover:text-white hover:shadow-md focus:outline-none focus:ring-0 border-none",
    profile:
      "bg-mint-500/75 backdrop-blur hover-glow text-white px-2 py-1 hover:bg-purple-900/40 hover:shadow-md focus:outline-none focus:ring-0 border-none",
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
