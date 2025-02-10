import { Input } from "./input";

export const SearchBar = ({search, onSearchChange}) => {
    return <div>
        <Input 
          value={search}
          onChange={onSearchChange} 
          placeholder="Rechercher..."/>
    </div>
  }
  