import React from "react";

const Pagination = ({ totalPages, currentPage, onPageChange }) => {
    if (totalPages <= 1) return null;

    const getPageNumbers = () => {
        const pages = new Set();

        // Always include first and last pages
        pages.add(1);
        pages.add(totalPages);

        // Include current, prev and next
        if (currentPage > 1) pages.add(currentPage - 1);
        pages.add(currentPage);
        if (currentPage < totalPages) pages.add(currentPage + 1);

        // Sort and insert ellipses
        const sorted = Array.from(pages).sort((a, b) => a - b);
        const result = [];

        for (let i = 0; i < sorted.length; i++) {
            if (i > 0 && sorted[i] - sorted[i - 1] > 1) {
                result.push("...");
            }
            result.push(sorted[i]);
        }

        return result;
    };

    const pageNumbers = getPageNumbers();

    return (
        <div className="flex justify-center mt-4 space-x-1 items-center text-sm">
            {/* First */}
            <button
                onClick={() => onPageChange(1)}
                disabled={currentPage == 1}
                className="px-3 py-1 rounded-full border border-orange-300 bg-white text-orange-500 font-semibold shadow-sm hover:bg-orange-50 hover:text-orange-600 disabled:opacity-50 disabled:bg-orange-100 disabled:text-orange-300 transition cursor-pointer"
            >
                First
            </button>

            {/* << */}
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage == 1}
                className="px-3 py-1 rounded-full border border-orange-300 bg-white text-orange-500 font-semibold shadow-sm hover:bg-orange-50 hover:text-orange-600 disabled:opacity-50 disabled:bg-orange-100 disabled:text-orange-300 transition cursor-pointer"
            >
                &laquo;
            </button>

            {/* Page numbers */}
            {pageNumbers.map((page, index) => (
                page === "..." ? (
                    <span
                        key={index}
                        className="px-3 py-1 rounded-full text-orange-300 border-transparent bg-transparent cursor-default mx-0.5 select-none"
                    >
                        ...
                    </span>
                ) : (
                    <button
                        key={index}
                        onClick={() => onPageChange(page)}
                        className={`px-3 py-1 rounded-full border font-semibold shadow-sm mx-0.5 transition cursor-pointer
                            ${page === currentPage
                                ? "bg-gradient-to-r from-orange-400 to-yellow-400 text-white border-orange-400"
                                : "bg-white text-orange-500 border-orange-300 hover:bg-orange-50 hover:text-orange-600"
                            }`}
                    >
                        {page}
                    </button>
                )
            ))}

            {/* >> */}
            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage == totalPages}
                className="px-3 py-1 rounded-full border border-orange-300 bg-white text-orange-500 font-semibold shadow-sm hover:bg-orange-50 hover:text-orange-600 disabled:opacity-50 disabled:bg-orange-100 disabled:text-orange-300 transition cursor-pointer"
            >
                &raquo;
            </button>

            {/* Last */}
            <button
                onClick={() => onPageChange(totalPages)}
                disabled={currentPage == totalPages}
                className="px-3 py-1 rounded-full border border-orange-300 bg-white text-orange-500 font-semibold shadow-sm hover:bg-orange-50 hover:text-orange-600 disabled:opacity-50 disabled:bg-orange-100 disabled:text-orange-300 transition cursor-pointer"
            >
                Last
            </button>
        </div>
    );
};

export default Pagination;