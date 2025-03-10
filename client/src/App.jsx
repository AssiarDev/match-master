import { Route, Routes, Link } from "react-router-dom";
//import { Home } from "./components/home";
//import { Favoris } from "./components/favoris";
import { MatchsDetails } from "./components/matchs";
import { Connexion } from "./components/connexion";
import { NoMatch } from "./components/noMatch";
import { Navbar } from "./components/forms/navbar";
import { SearchBar } from "./components/forms/searchbar";

function App() {

  return (
      <>  
        <header className="h-20 w-full sticky top-0 z-50 left-0 border-none shadow-lg shadow-amber-900/50 flex items-center items-center justify-between">
          <Link to="/"  className="font-sans text-4xl font-bold text-white mx-2">Match Master</Link>
          <Navbar />
          <SearchBar />
        </header>
        <div className="mt-20">
          <Routes>
              {/* <Route path="/" element={<MatchsDetails />} /> */}
              <Route path="/competitions/:teamId/matches" element={<MatchsDetails />} />
              <Route path="/connexion" element={<Connexion />} />
              <Route path="*" element={<NoMatch />}/>
              {/* <Route path="/" element={<Home />}/> */}
              {/* <Route path="/favoris" element={<Favoris />} /> */}
              {/* <Route path="/competitions" element={<TeamDetails/>} /> */}
              {/* <Route path="/v4/teams/:teamId" element={<TeamDetails />} /> */}
          </Routes>
        </div>   
      </>
  )
}

export default App
