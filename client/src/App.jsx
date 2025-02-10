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
    <div className="w-80 h-60 border border-gray-600 shadow-xl rounded-lg flex flex-col gap-2 justify-center items-center">
      <label htmlFor="league-selector" className="text-white">Choisissez le championnat :</label>
      <SelectorLeague />
    </div>
    </div>
    
    </>
  )
}

export default App
