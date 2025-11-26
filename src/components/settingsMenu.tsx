import type { ReactNode } from "react";
import Button from "./button";

interface ISettingsType {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const SettingsMenu = ({ isOpen, setIsOpen }: ISettingsType): ReactNode => {
  console.log(isOpen);

  if (!isOpen) return <></>;

  return (
    <div className="absolute inset-0 z-40 bg-black/40">
      SETTINGS
      <Button
        onClick={() => {
          setIsOpen(false);
        }}
      >
        close
      </Button>
    </div>
  );
};

export default SettingsMenu;
