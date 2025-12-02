// components/survey/SurveyPagination.tsx
interface SurveyPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

function SurveyPagination({
  currentPage,
  totalPages,
  onPageChange,
}: SurveyPaginationProps) {
  // 페이지 번호 배열 생성
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i);
        pages.push("...");
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push("...");
        for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push("...");
        for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
        pages.push("...");
        pages.push(totalPages);
      }
    }

    return pages;
  };

  // totalPages가 0이면 렌더링 안 함
  if (totalPages === 0) {
    return null;
  }

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: "8px",
        marginTop: "40px",
        paddingBottom: "20px",
      }}
    >
      {/* 이전 버튼 */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        style={{
          padding: "10px 16px",
          border: "1px solid rgba(184, 147, 105, 0.3)",
          backgroundColor: currentPage === 1 ? "#F3F1E5" : "#fff",
          borderRadius: "8px",
          cursor: currentPage === 1 ? "not-allowed" : "pointer",
          fontSize: "14px",
          fontWeight: 500,
          color: currentPage === 1 ? "#ccc" : "#B89369",
          transition: "all 0.2s",
        }}
        onMouseEnter={(e) => {
          if (currentPage !== 1) {
            e.currentTarget.style.backgroundColor = "#F3F1E5";
          }
        }}
        onMouseLeave={(e) => {
          if (currentPage !== 1) {
            e.currentTarget.style.backgroundColor = "#fff";
          }
        }}
      >
        이전
      </button>

      {/* 페이지 번호 */}
      {getPageNumbers().map((page, index) =>
        typeof page === "number" ? (
          <button
            key={index}
            onClick={() => onPageChange(page)}
            style={{
              padding: "10px 14px",
              minWidth: "44px",
              border:
                currentPage === page
                  ? "2px solid #B89369"
                  : "1px solid rgba(184, 147, 105, 0.3)",
              backgroundColor: currentPage === page ? "#B89369" : "#fff",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "14px",
              fontWeight: currentPage === page ? 600 : 400,
              color: currentPage === page ? "#fff" : "#B89369",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              if (currentPage !== page) {
                e.currentTarget.style.backgroundColor = "#F3F1E5";
              }
            }}
            onMouseLeave={(e) => {
              if (currentPage !== page) {
                e.currentTarget.style.backgroundColor = "#fff";
              }
            }}
          >
            {page}
          </button>
        ) : (
          <span
            key={index}
            style={{ padding: "10px 6px", color: "#B89369", opacity: 0.5 }}
          >
            {page}
          </span>
        )
      )}

      {/* 다음 버튼 */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        style={{
          padding: "10px 16px",
          border: "1px solid rgba(184, 147, 105, 0.3)",
          backgroundColor: currentPage === totalPages ? "#F3F1E5" : "#fff",
          borderRadius: "8px",
          cursor: currentPage === totalPages ? "not-allowed" : "pointer",
          fontSize: "14px",
          fontWeight: 500,
          color: currentPage === totalPages ? "#ccc" : "#B89369",
          transition: "all 0.2s",
        }}
        onMouseEnter={(e) => {
          if (currentPage !== totalPages) {
            e.currentTarget.style.backgroundColor = "#F3F1E5";
          }
        }}
        onMouseLeave={(e) => {
          if (currentPage !== totalPages) {
            e.currentTarget.style.backgroundColor = "#fff";
          }
        }}
      >
        다음
      </button>
    </div>
  );
}

export default SurveyPagination;
