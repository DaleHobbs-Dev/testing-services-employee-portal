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
    primary: "bg-primary text-white hover:bg-primary-dark",
    accent: "bg-accent text-white hover:bg-accent-dark",
    outline: "border border-primary text-primary hover:bg-primary-lighter",
    danger: "bg-danger-500 text-white hover:bg-red-700",
    ghost: "bg-transparent text-primary hover:bg-primary-lighter",
    secondary: "bg-gray-200 text-gray-800 hover:bg-gray-300",

    /* -------- Navbar Variants -------- */
    nav: "bg-transparent text-white hover-glow hover:text-accent hover:bg-primary-darker/40 hover:shadow-md focus:outline-none focus:ring-0 border-none",
    navGhost:
      "bg-transparent text-white/90 hover:bg-white/10 hover:text-white hover:shadow-md focus:outline-none focus:ring-0 border-none",
    profile:
      "bg-accent/75 backdrop-blur hover-glow text-white px-2 py-1 hover:bg-primary-darker/40 hover:shadow-md focus:outline-none focus:ring-0 border-none",
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
