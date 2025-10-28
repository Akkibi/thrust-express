// import { useEffect } from "react";
import ThreeManager from "./three/threeScene";
import UiElements from "./components/uiElements";
// import { GameControls } from "./classes/Controls";

function App() {
  // useEffect(() => {
  //   const controls = GameControls.getInstance();
  //   controls.keyHandlerSetup();
  // }, [])

  return (
    <>
      <ThreeManager />
      <UiElements />
    </>
  );
}

export default App;
