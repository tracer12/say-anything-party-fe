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

        const logoutButton = document.querySelector('a[href="../../login/login.html"]');
        if (logoutButton) {
            logoutButton.addEventListener('click', () => {
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
                localStorage.removeItem('profileImage');
                localStorage.removeItem('selectedPostId');
                alert("로그아웃 되었습니다.");
            });
        }

        const accessToken = localStorage.getItem("accessToken");
        if (accessToken) {
            const titleElement = document.querySelector(".title");
            if (titleElement) {
                titleElement.style.cursor = "pointer";
                titleElement.addEventListener("click", () => {
                    window.location.href = "/posts/list/list.html";
                });
            }
        }
    }, 100);
});
