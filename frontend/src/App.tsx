import { Routes, Route } from "react-router-dom";
import NavBar from "./presentation/components/NavBar";
import HomePage from "./presentation/pages/HomePage";
import SubjectsPage from "./presentation/pages/SubjectsPage";

const App = () => {
  return (
    <>
      <NavBar />
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/subjects" element={<SubjectsPage />} />
        </Routes>
      </main>
    </>
  );
};

export default App;
