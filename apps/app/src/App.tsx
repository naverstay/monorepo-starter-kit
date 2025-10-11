import { Providers } from "../src/modules/shared/providers/Providers.tsx";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <>
      <Providers />
      <Toaster />
    </>
  );
}

export default App;
