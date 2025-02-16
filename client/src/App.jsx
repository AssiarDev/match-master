import { Route, Routes } from "react-router-dom";
import { Home } from "./components/home";
import { Favoris } from "./components/favoris";
import { Competitions } from "./components/competitions";
import { Connexion } from "./components/connexion";
import { NoMatch } from "./components/noMatch";

function App() {

  return (
      <>
        <Routes>
          <Route path="/" element={<Home />}/>
          <Route path="/favoris" element={<Favoris />} />
          <Route path="/competitions" element={<Competitions />} />
          <Route path="/connexion" element={<Connexion />} />
          <Route path="*" element={<NoMatch />}/>
        </Routes>
      </>
  )
}

export default App
