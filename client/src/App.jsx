import { SearchBar } from "./components/forms/searchbar";
import { useState } from "react";
import logo from './assets/menu.svg';
import { SelectorLeague } from "./components/leagueSelector";

function App() {

  const [search, setSearch] = useState('');

  return (
    <>
    <div className="h-20 w-full border-none shadow-md flex justify-between items-center">
      <SearchBar search={search} onSearchChange={setSearch}/>
      <div className=" w-full flex justify-center">
        <h1 className="font-sans text-4xl font-bold text-white">Match Master</h1>
      </div>
      <div>
        <img src={logo} alt="Menu hamberger" className="svg-color-white"/>
      </div>
    </div>
    <div className="w-80 h-60 border border-white">
      <SelectorLeague />
    </div>
    </>
  )
}

export default App
