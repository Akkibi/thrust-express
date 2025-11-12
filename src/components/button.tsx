import { cn } from "../utils/cn";

const Button = ({
  onClick,
  children,
  isDisabled,
}: {
  onClick: () => void;
  children: string;
  isDisabled: boolean;
}) => {
  return (
    <button
      className={cn(
        "w-fit px-10 rounded-full bg-stone-950 h-10 flex justify-center items-center custom-light-border relative hover:scale-105 active:scale-90 transition-transform duration-300 ease-out",
        isDisabled ? "opacity-50" : "opacity-100",
      )}
      type="button"
      onClick={onClick}
      disabled={isDisabled}
    >
      <div className="absolute inset-0.75 bg-yellow-700 rounded-full">
        <div className="absolute inset-1 bg-stone-950 rounded-full"></div>
      </div>
      <span className="relative font-black">{children}</span>
    </button>
  );
};

export default Button;
