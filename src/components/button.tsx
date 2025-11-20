import { cn } from "../utils/cn";

const Button = ({
  onClick,
  children,
  isDisabled,
  size = "lg",
}: {
  onClick: () => void;
  children: string;
  isDisabled?: boolean;
  size?: "sm" | "lg";
}) => {
  return (
    <button
      className={cn(
        "cursor-pointer w-fit px-6 md:px-10 rounded-full bg-slate-950 flex justify-center items-center custom-light-border relative hover:scale-105 active:scale-90 transition-transform duration-300 ease-out",
        isDisabled ? "opacity-50" : "opacity-100",
        size === "sm" && "text-md h-10",
        size === "lg" && "text-xl h-14",
      )}
      type="button"
      onClick={onClick}
      disabled={isDisabled}
    >
      <div className="absolute inset-0.75 bg-yellow-700 rounded-full">
        <div className="absolute inset-1 bg-slate-950 rounded-full"></div>
      </div>
      <span className="relative italic font-black font-mono">{children}</span>
    </button>
  );
};

export default Button;
