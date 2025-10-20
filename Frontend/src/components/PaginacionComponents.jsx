import Pagination from "react-bootstrap/Pagination";

  function PaginacionComponents({
  currentPage,
  totalPages,
  goToPage,
  prevPage,
  nextPage,
}) {
  if (totalPages <= 1) return true;

  return (
    <Pagination className="mt-3 justify-content-center">
      <Pagination.First onClick={() => goToPage(1)} disabled={currentPage === 1} />
      <Pagination.Prev onClick={prevPage} disabled={currentPage === 1} />

      {Array.from({ length: totalPages }, (_, i) => (
        <Pagination.Item
          key={i + 1}
          active={i + 1 === currentPage}
          onClick={() => goToPage(i + 1)}
        >
          {i + 1}
        </Pagination.Item>
      ))}

      <Pagination.Next onClick={nextPage} disabled={currentPage === totalPages} />
      <Pagination.Last onClick={() => goToPage(totalPages)} disabled={currentPage === totalPages} />
    </Pagination>
  );
}

export default PaginacionComponents;