document.addEventListener("DOMContentLoaded", () => {
    setTimeout(() => {
        const backButton = document.getElementById("back-space");
        if (backButton) {
            backButton.addEventListener("click", () => {
                if (window.history.length > 1) {
                    window.history.back();
                } else {
                    window.location.href = "../../list/list.html";
                }
            });
        }
    }, 100);
});
