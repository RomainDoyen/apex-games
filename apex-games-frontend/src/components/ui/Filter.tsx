import "../../styles/components/Filter.css";

interface FilterProps {
    placeholder: string;
    options: string[];
    onSearchChange: (search: string) => void;
    onCategoryChange: (category: string) => void;
    searchValue?: string;
    categoryValue?: string;
}

export default function Filter({ 
    placeholder, 
    options, 
    onSearchChange, 
    onCategoryChange, 
    searchValue = "", 
    categoryValue = "all" 
}: FilterProps) {

    const handleSearchChange = (value: string) => {
        onSearchChange(value);
    };

    const handleCategoryChange = (value: string) => {
        onCategoryChange(value);
    };
    
    return (
        <div className="filter">
            <input 
                type="text" 
                placeholder={placeholder} 
                value={searchValue} 
                onChange={(e) => handleSearchChange(e.target.value)}
            />
            <select 
                name="filter" 
                id="filter" 
                value={categoryValue} 
                onChange={(e) => handleCategoryChange(e.target.value)}
            >
                <option value="all">Tous</option>
                {options.map((option) => (
                    <option key={option} value={option}>{option}</option>
                ))}
            </select>
        </div>
    )
}