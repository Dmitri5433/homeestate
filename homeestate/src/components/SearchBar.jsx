export default function SearchBar({ value, onChange }) {
  return (
    <div className="search-wrap">
      <span className="search-icon">🔍</span>
      <input
        className="search-input"
        placeholder="Поиск по названию или городу..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      {value && (
        <button className="search-clear" onClick={() => onChange("")}>✕</button>
      )}
    </div>
  );
}
