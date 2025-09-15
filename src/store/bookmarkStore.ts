import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Bookmark {
  gameId: number;
  gameName: string;
  gameImage: string;
  addedAt: Date;
}

interface BookmarkStore {
  bookmarks: Bookmark[];
  addBookmark: (game: { id: number; name: string; background_image: string }) => void;
  removeBookmark: (gameId: number) => void;
  isBookmarked: (gameId: number) => boolean;
  clearBookmarks: () => void;
}

export const useBookmarkStore = create<BookmarkStore>()(
  persist(
    (set, get) => ({
      bookmarks: [],
      
      addBookmark: (game) => {
        const { bookmarks } = get();
        const existingBookmark = bookmarks.find(bookmark => bookmark.gameId === game.id);
        
        if (!existingBookmark) {
          const newBookmark: Bookmark = {
            gameId: game.id,
            gameName: game.name,
            gameImage: game.background_image,
            addedAt: new Date()
          };
          
          set({ bookmarks: [...bookmarks, newBookmark] });
        }
      },
      
      removeBookmark: (gameId) => {
        const { bookmarks } = get();
        set({ bookmarks: bookmarks.filter(bookmark => bookmark.gameId !== gameId) });
      },
      
      isBookmarked: (gameId) => {
        const { bookmarks } = get();
        return bookmarks.some(bookmark => bookmark.gameId === gameId);
      },
      
      clearBookmarks: () => {
        set({ bookmarks: [] });
      }
    }),
    {
      name: 'bookmark-storage',
    }
  )
);
