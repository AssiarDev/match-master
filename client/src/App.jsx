import { SearchBar } from "./components/forms/searchbar";
import { useState } from "react";
import logo from './assets/menu-white.svg';
import { SelectorLeague } from "./components/leagueSelector";

function App() {

  const [search, setSearch] = useState('');

  return (
    <>
    <div className="h-20 w-full border-none shadow-md flex items-center justify-between items-center">
      <div className="flex items-center justify-start w-1/3">
      <SearchBar search={search} onSearchChange={setSearch}/>
      </div>
      <div className="flex w-1/3 items-center justify-center">
        <h1 className="font-sans text-4xl font-bold text-white">Match Master</h1>
      </div>
      <div className="flex items-center justify-end w-1/3">
        <img src={logo} alt="Menu hamberger" className=" w-15 h-15"/>
      </div>
    </div>
    <div className="w-full min-h-screen flex flex-col justify-center items-center">
    <div className="w-80 h-60 border border-gray-600 shadow-xl rounded-lg flex flex-col justify-center items-center">
    <div className="w-full h-10 flex justify-center items-center text-white text-lg font-medium">
        <h2>Choissisez votre équipe favorite</h2>
      </div>
      <div className="flex flex-col w-full h-40 justify-center items-center gap-2">
      <label htmlFor="league-selector" className="text-white">Choisissez le championnat :</label>
      <SelectorLeague />
      <button className="border border-gray-600 hover:bg-gray-500 w-30 rounded-md text-white cursor-pointer">Entrer</button>
      </div>
      
    </div>
    </div>
    
    </>
  )
}

export default App
