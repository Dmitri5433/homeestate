const CATEGORIES = ["Все", "Студия", "1-комнатная", "2-комнатная", "3-комнатная"];

export default function FilterButtons({ active, onChange }) {
  return (
    <div className="filters">
      {CATEGORIES.map((cat) => (
        <button
          key={cat}
          className={active === cat ? "filter-btn active" : "filter-btn"}
          onClick={() => onChange(cat)}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}
