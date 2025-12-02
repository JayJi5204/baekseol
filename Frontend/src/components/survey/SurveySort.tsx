// components/survey/SurveySort.tsx
import type { SortOption } from "../../types/SurveyData";

interface SurveySortProps {
  sortOptions: SortOption[];
  selectedSort: SortOption;
  onSortChange: (option: SortOption) => void;
}

function SurveySort({
  sortOptions,
  selectedSort,
  onSortChange,
}: SurveySortProps) {
  return (
    <aside
      style={{
        width: "220px",
        flexShrink: 0,
        padding: "24px",
        backgroundColor: "#fff",
        border: "1px solid rgba(184, 147, 105, 0.2)",
        borderRadius: "12px",
        height: "fit-content",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
      }}
    >
      <h3
        style={{
          marginTop: 0,
          marginBottom: "20px",
          fontSize: "18px",
          fontWeight: 600,
          color: "#B89369",
        }}
      >
        정렬 기준
      </h3>
      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {sortOptions.map((option) => (
          <label
            key={option}
            style={{
              display: "flex",
              alignItems: "center",
              cursor: "pointer",
              fontSize: "15px",
              padding: "10px 12px",
              borderRadius: "8px",
              backgroundColor:
                selectedSort === option
                  ? "rgba(184, 147, 105, 0.1)"
                  : "transparent",
              transition: "all 0.2s ease",
              color: selectedSort === option ? "#B89369" : "#666",
              fontWeight: selectedSort === option ? 500 : 400,
            }}
            onMouseEnter={(e) => {
              if (selectedSort !== option) {
                e.currentTarget.style.backgroundColor = "#F3F1E5";
              }
            }}
            onMouseLeave={(e) => {
              if (selectedSort !== option) {
                e.currentTarget.style.backgroundColor = "transparent";
              }
            }}
          >
            <input
              type="radio"
              name="sort"
              value={option}
              checked={selectedSort === option}
              onChange={() => onSortChange(option)}
              style={{
                marginRight: "10px",
                cursor: "pointer",
                accentColor: "#B89369",
                width: "16px",
                height: "16px",
              }}
            />
            {option}
          </label>
        ))}
      </div>
    </aside>
  );
}

export default SurveySort;
