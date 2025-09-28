import '../../styles/components/Pagination.css';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    maxVisiblePages?: number;
}

export default function Pagination({ 
    currentPage, 
    totalPages, 
    onPageChange, 
    maxVisiblePages = 5 
}: PaginationProps) {
    
    // Fonctions de pagination
    const goToPreviousPage = () => {
        if (currentPage > 1) {
            onPageChange(currentPage - 1);
        }
    };

    const goToNextPage = () => {
        if (currentPage < totalPages) {
            onPageChange(currentPage + 1);
        }
    };

    // Générer les numéros de page à afficher
    const getPageNumbers = () => {
        const pages = [];
        
        if (totalPages <= maxVisiblePages) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            const start = Math.max(1, currentPage - 2);
            const end = Math.min(totalPages, start + maxVisiblePages - 1);
            
            for (let i = start; i <= end; i++) {
                pages.push(i);
            }
        }
        
        return pages;
    };

    // Ne pas afficher la pagination s'il n'y a qu'une page
    if (totalPages <= 1) {
        return null;
    }

    return (
        <div className="pagination-container">
            <div className="pagination">
                <button 
                    className="pagination-button" 
                    onClick={goToPreviousPage}
                    disabled={currentPage === 1}
                    aria-label="Page précédente"
                >
                    Précédent
                </button>
                
                {getPageNumbers().map((pageNum) => (
                    <button 
                        key={pageNum}
                        className={`pagination-button ${currentPage === pageNum ? 'active' : ''}`}
                        onClick={() => onPageChange(pageNum)}
                        aria-label={`Aller à la page ${pageNum}`}
                        aria-current={currentPage === pageNum ? 'page' : undefined}
                    >
                        {pageNum}
                    </button>
                ))}
                
                <button 
                    className="pagination-button" 
                    onClick={goToNextPage}
                    disabled={currentPage === totalPages}
                    aria-label="Page suivante"
                >
                    Suivant
                </button>
            </div>
        </div>
    );
}
