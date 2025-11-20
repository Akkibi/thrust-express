import type { ReactNode } from "react";
import UiElements from "./components/uiElements";
import ThreeManager from "./three/threeScene";

const App = (): ReactNode => {
  return (
    <>
      <ThreeManager />
      <UiElements />
    </>
  );
};

export default App;
