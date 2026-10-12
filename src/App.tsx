import { RouterProvider } from "react-router-dom";
import router from "./app/router";
import { PushNotificationListener } from "./utils/pushNotificationListener";

function App() {
  return (
    <>
      <PushNotificationListener />
      <RouterProvider router={router} />
    </>
  );
}

export default App;
