import { cn } from "../utils/cn";

const Button = ({
  onClick,
  children,
  isDisabled,
  size = "lg",
  className,
}: {
  className?: string;
  onClick: () => void;
  children: string;
  isDisabled?: boolean;
  size?: "sm" | "lg";
}) => {
  return (
    <button
      className={cn(
        "cursor-pointer px-6 md:px-10 rounded-full bg-slate-950 flex justify-center items-center custom-light-border relative hover:scale-105 active:scale-90 transition-transform duration-300 ease-out",
        isDisabled ? "opacity-50" : "opacity-100",
        size === "sm" && "text-md h-10",
        size === "lg" && "text-xl h-14",
        className,
      )}
      type="button"
      onClick={onClick}
      disabled={isDisabled}
    >
      <div className="absolute inset-0.75 bg-linear-to-t from-yellow-700 to-yellow-600 rounded-full">
        <div className="absolute inset-1 bg-slate-950 rounded-full"></div>
      </div>
      <span className="relative italic font-black uppercase">{children}</span>
    </button>
  );
};

export default Button;
