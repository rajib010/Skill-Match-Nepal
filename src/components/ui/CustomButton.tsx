import Link from "next/link";
import { cn } from "@/lib/utils";
interface CustomButtonProps {
  content: React.ReactNode;
  href?: string; 
  variant?: "primary" | "outline";  
  size?: "sm" | "md" | "lg";        
  className?: string;               
}

export default function CustomButton({
  content,
  href,
  variant = "primary",
  size = "md",
  className,
}: CustomButtonProps) {

  const variantClasses = {
    primary: "bg-primary text-white hover:bg-[#C1E1F6] hover:text-primary flex items-center",
    outline: "border border-primary text-primary",
  };

  const sizeClasses = {
    sm: "px-3 py-1 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg",
  };

  const button = (
    <button className={cn(variantClasses[variant], sizeClasses[size], "rounded-full font-medium cursor-pointer font-poppins", className)}>
      {content}
    </button>
  );

  // Wrap in Link if href provided
  return href ? <Link href={href}>{button}</Link> : button;
}

