function SearchBar() {
    return (
        <input
            type="text"
            placeholder="Search..."
            style={{
                width: "250px",
                padding: "10px 15px",
                borderRadius: "10px",
                border: "none",
                outline: "none",
                fontSize: "16px",
            }}
        />
    );
}

export default SearchBar;