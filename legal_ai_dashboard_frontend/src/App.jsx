import AppRoutes from "./routes/AppRoutes";
import { AnalysisProvider } from "./context/AnalysisContext";

export default function App() {
  return (
    <AnalysisProvider>
      <AppRoutes />
    </AnalysisProvider>
  );
}