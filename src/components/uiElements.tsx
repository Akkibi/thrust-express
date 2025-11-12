import { useStore } from "../store/store";
import EndTitle from "./endTitle";
import GameMenu from "./gameMenu";

const UiElements = () => {
  const isEndTitle = useStore((state) => state.isEndTitle);
  const setEndTitle = useStore((state) => state.setIsEndTitle);
  const isMenuOpen = useStore((state) => state.isMenuOpen);
  const setMenuOpen = useStore((state) => state.setIsMenuOpen);
  const playerHealth = useStore((state) => state.health);

  return (
    <>
      <div className="absolute top-5 left-5 h-10 w-30 md:h-20 md:w-60 bg-[url(/logo.png)] bg-cover bg-center bg-no-repeat"></div>
      <div className="h-[50vh] rounded-l-lg w-5 bg-stone-900 right-0 absolute top-1/2 -translate-y-1/2">
        <div className="absolute inset-1 bg-red-200 rounded-full overflow-clip">
          <div
            className="absolute inset-0 bg-red-600 origin-bottom"
            style={{
              transform: `scaleY(${playerHealth / 100})`,
            }}
          ></div>
        </div>
      </div>
      <GameMenu isOpen={isMenuOpen} setIsOpen={setMenuOpen} />
      <EndTitle
        isOpen={isEndTitle}
        setIsOpen={setEndTitle}
        setMenuOpen={setMenuOpen}
      />
    </>
  );
};

export default UiElements;
