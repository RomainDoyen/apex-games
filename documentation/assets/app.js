/**
 * JS minimal pour la documentation (sans dépendances).
 * - Recherche dans la navigation (filtre)
 *
 * Objectif : rester simple et prévisible (design cognitif).
 */

(() => {

  /**
   * Recherche simple : filtre les liens de nav sur leur texte.
   * @param {string} q
   */
  function filterNav(q) {
    const query = q.trim().toLowerCase();
    const items = document.querySelectorAll("[data-nav-item]");
    let visibleCount = 0;
    items.forEach((el) => {
      const text = (el.textContent || "").toLowerCase();
      const visible = query.length === 0 || text.includes(query);
      el.style.display = visible ? "" : "none";
      if (visible) visibleCount += 1;
    });

    const live = document.querySelector("[data-nav-live]");
    if (live) {
      live.textContent =
        query.length === 0
          ? "Recherche effacée."
          : `${visibleCount} élément(s) correspondent à la recherche.`;
    }
  }

  function initSearch() {
    const input = document.querySelector("[data-action='nav-search']");
    if (!input) return;
    input.addEventListener("input", (e) => {
      const value = /** @type {HTMLInputElement} */ (e.target).value;
      filterNav(value);
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    initSearch();
  });
})();

