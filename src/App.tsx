// import { useEffect } from "react";
import type { ReactNode } from "react";
import UiElements from "./components/uiElements";
import ThreeManager from "./three/threeScene";
// import { GameControls } from "./classes/Controls";

const App = (): ReactNode => {
  return (
    <>
      <ThreeManager />
      <UiElements />
    </>
  );
};

export default App;
