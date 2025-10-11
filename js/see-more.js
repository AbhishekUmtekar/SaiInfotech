document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".service-subtitle.expandable").forEach(sub => {
        const fullText = sub.textContent.trim();
        const items = fullText.split(",").map(i => i.trim());
        const visibleItems = items.slice(0, 3).join(", ");
        const hiddenCount = items.length - 3;

        function renderCollapsed() {
            sub.classList.remove("expanded");
            sub.innerHTML = `${visibleItems}, <span class="view-more-inline">+${hiddenCount} others</span>`;
            attachEvents();
        }

        function renderExpanded() {
            sub.classList.add("expanded");
            sub.innerHTML = items.join(", ") + ` <span class="view-more-inline">Show less</span>`;
            attachEvents();
        }

        function attachEvents() {
            const toggle = sub.querySelector(".view-more-inline");
            if (!toggle) return;

            toggle.addEventListener("click", (e) => {
                // IMPORTANT: Stop the click from bubbling up to the card
                e.preventDefault();
                e.stopPropagation();

                if (sub.classList.contains("expanded")) {
                    renderCollapsed();
                } else {
                    renderExpanded();
                }
            });
        }

        if (items.length > 3) {
            renderCollapsed();
        }
    });
});
