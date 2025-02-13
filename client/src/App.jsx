import AppRoutes from "./routes/AppRoutes"
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const App = () => {
  return (
<>
<ToastContainer pauseOnFocusLoss={false} newestOnTop autoClose={2000} />
<AppRoutes />
</>
  )
}

export default App
