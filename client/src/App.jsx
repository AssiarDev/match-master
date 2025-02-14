import { SearchBar } from "./components/forms/searchbar";
import { useState } from "react";
import { SelectorLeague } from "./components/leagueSelector";
import { Navbar } from "./components/forms/Navbar";

function App() {

  const [search, setSearch] = useState('');

  return (
    <>
    <div className="h-20 w-full border-none shadow-md flex items-center justify-between">
    <h1 className="font-sans text-4xl font-bold text-white">Match Master</h1>
    <Navbar />
    <SearchBar 
        search={search} 
        onSearchChange={setSearch}
      />
    </div>
    <div className="w-full min-h-screen flex flex-col justify-center items-center">
    <div className="w-80 h-60 border border-gray-600 shadow-xl rounded-lg flex flex-col justify-center items-center">
    <div className="w-full h-10 flex justify-center items-center text-white text-lg font-medium">
        <h2>Choissisez votre équipe favorite</h2>
    </div>
    <div className="flex flex-col w-full h-30 justify-center items-center gap-2">
      <label htmlFor="league-selector" className="text-white">Choisissez le championnat :</label>
      <SelectorLeague />
    </div>
    <div className="w-full h-15 flex justify-center items-center">
      <button className="border border-gray-600 hover:bg-gray-500 w-40 h-10 rounded-md text-white cursor-pointer">Entrer</button>
    </div>
    </div>
    </div>
    
    </>
  )
}

export default App
