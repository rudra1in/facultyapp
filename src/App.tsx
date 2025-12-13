import { ThemeProvider } from "./components/ui/ThemeContext";
import AppRouter from "./router/AppRouter";

export default function App() {
  return (
    <ThemeProvider>
      <AppRouter />
    </ThemeProvider>
  );
}
