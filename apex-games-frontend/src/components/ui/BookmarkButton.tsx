import { useBookmarkStore } from "../../store/bookmarkStore";
import type { Game, Bookmark} from "../../types/types";
import "../../styles/components/BookmarkButton.css";
import { addGameToBacklog } from "../../api/Services";


interface BookmarkButtonProps {
    game: Game;
    size?: 'small' | 'medium' | 'large';
}

export default function BookmarkButton({ game, size = 'medium' }: BookmarkButtonProps) {
    const { isBookmarked, addBookmark, removeBookmark } = useBookmarkStore();
    
    const bookmarked = isBookmarked(game.id);
    
    const handleToggleBookmark = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        
        if (!bookmarked) {
        console.log("Adding to backlog:", game);
        addGameToBacklog("/backlog", {
            gameId: game.id,
            status: "aFaire",       
            title: game.name,
            gameImage: game.background_image,
        });
        addBookmark(game);
    } else {
        removeBookmark(game.id);
    }
    };
    
    const sizeClasses = {
        small: 'bookmark-btn--small',
        medium: 'bookmark-btn--medium',
        large: 'bookmark-btn--large'
    };
    
    return (
        <button
            className={`bookmark-btn ${sizeClasses[size]} ${bookmarked ? 'bookmark-btn--active' : ''}`}
            onClick={handleToggleBookmark}
            aria-label={bookmarked ? 'Retirer des favoris' : 'Ajouter aux favoris'}
            title={bookmarked ? 'Retirer des favoris' : 'Ajouter aux favoris'}
        >
            <svg 
                width="24" 
                height="24" 
                viewBox="0 0 24 24" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
                className="bookmark-icon"
            >
                <path 
                    d="M5 6.2C5 5.07989 5 4.51984 5.21799 4.09202C5.40973 3.71569 5.71569 3.40973 6.09202 3.21799C6.51984 3 7.07989 3 8.2 3H15.8C16.9201 3 17.4802 3 17.908 3.21799C18.2843 3.40973 18.5903 3.71569 18.782 4.09202C19 4.51984 19 5.07989 19 6.2V21L12 16L5 21V6.2Z" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinejoin="round"
                    fill={bookmarked ? "currentColor" : "none"}
                />
            </svg>
        </button>
    );
}
