import { MainPage } from "pages";
import { useInitialTheme } from "./hooks/useInitialTheme";
import styles from "./App.module.scss";

function App() {
  useInitialTheme();
  return (
    <div className={styles.wrapper}>
      <MainPage />
    </div>
  );
}

export default App;
