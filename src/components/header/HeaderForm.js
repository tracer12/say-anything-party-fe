import { navigateTo } from "../../../index.js";

export function HeaderForm() {
    function render() {
        // 기존 헤더가 있으면 제거
        const existingHeader = document.getElementById("header-container");
        if (existingHeader) {
            existingHeader.remove();
        }

        // 기존 content-wrapper가 있으면 내부 요소만 body로 복원 후 제거
        const existingWrapper = document.querySelector(".content-wrapper");
        if (existingWrapper) {
            while (existingWrapper.firstChild) {
                document.body.appendChild(existingWrapper.firstChild);
            }
            existingWrapper.remove();
        }

        // 헤더 생성
        const headerContainer = document.createElement("header");
        headerContainer.id = "header-container";

        headerContainer.innerHTML = `
            <article class="header">
                <div class="header-left">
                    <button class="back-space" id="back-space">&lt;</button>
                </div>
                <div class="header-center">
                    <h1 class="title">아무 말 대잔치</h1>
                </div>
                <div class="header-right">
                    <div class="profile-list">
                        <div class="profile-icon" id="profile-icon"></div>
                        <div id="dropdown-menu" class="dropdown-menu">
                            <button id="changeprofile-button" class="dropdown-item">회원정보수정</button>
                            <button id="changepassword-button" class="dropdown-item">비밀번호수정</button>
                            <button id="logout-button" class="dropdown-item">로그아웃</button>
                        </div>
                    </div>
                </div>
            </article>
            <hr class="horizon-line" />
        `;

        document.body.prepend(headerContainer);

        // content-wrapper 생성 후 나머지 요소 옮기기
        let contentWrapper = document.querySelector(".content-wrapper");
        if (!contentWrapper) {
            contentWrapper = document.createElement("div");
            contentWrapper.className = "content-wrapper";
            while (document.body.children.length > 1) {
                contentWrapper.appendChild(document.body.children[1]);
            }
            document.body.appendChild(contentWrapper);
        }

        loadStyles();
        setupEventListeners();
        setupProfileDropdown();
        handleScroll();
    }

    function loadStyles() {
        if (!document.querySelector("link[href*='header.css']")) {
            const link = document.createElement("link");
            link.rel = "stylesheet";
            link.href = "/src/components/header/HeaderForm.css";
            document.head.appendChild(link);
        }

        const style = document.createElement("style");
        style.innerHTML = `
            #header-container {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                background-color: #f3f3f3;
                z-index: 1000;
                transition: transform 0.3s ease-in-out;
            }
            .content-wrapper {
                margin-top: 60px;
                padding: 20px;
            }
            .dropdown-item {
                background: none;
                border: none;
                width: 100%;
                text-align: left;
                padding: 10px;
                cursor: pointer;
                font-size: 16px;
            }
            .dropdown-item:hover {
                background-color: #f0f0f0;
            }
        `;
        document.head.appendChild(style);
    }

    function setupEventListeners() {
        setTimeout(() => {
            const backButton = document.getElementById("back-space");
            if (backButton) {
                backButton.addEventListener("click", () => {
                    if (window.history.length > 1) {
                        window.history.back();
                    } else {
                        navigateTo("/list");
                    }
                });
            }

            const logoutButton = document.getElementById("logout-button");
            if (logoutButton) {
                logoutButton.addEventListener("click", () => {
                    localStorage.removeItem("accessToken");
                    localStorage.removeItem("refreshToken");
                    localStorage.removeItem("profileImage");
                    localStorage.removeItem("selectedPostId");
                    alert("로그아웃 되었습니다.");
                    window.location.href = "../login";
                });
            }

            const changeProfileButton = document.getElementById("changeprofile-button");
            const changePasswordButton = document.getElementById("changepassword-button");

            if (changeProfileButton) {
                changeProfileButton.addEventListener("click", () => {
                    navigateTo("/changeprofile");
                });
            }

            if (changePasswordButton) {
                changePasswordButton.addEventListener("click", () => {
                    navigateTo("/changepassword");
                });
            }

            const accessToken = localStorage.getItem("accessToken");
            if (accessToken) {
                const titleElement = document.querySelector(".title");
                if (titleElement) {
                    titleElement.style.cursor = "pointer";
                    titleElement.addEventListener("click", () => {
                        navigateTo("/list");
                    });
                }
            }
        }, 100);
    }

    function setupProfileDropdown() {
        const profileIcon = document.getElementById("profile-icon");
        const dropdownMenu = document.getElementById("dropdown-menu");

        if (!profileIcon || !dropdownMenu) return;

        const profileImageUrl = localStorage.getItem("profileImage") || "";
        if (profileImageUrl) {
            profileIcon.style.backgroundImage = `url(http://localhost:8080${profileImageUrl})`;
            profileIcon.style.backgroundSize = "cover";
            profileIcon.style.backgroundPosition = "center";
            profileIcon.style.width = "30px";
            profileIcon.style.height = "30px";
            profileIcon.style.borderRadius = "50%";
        } else {
            profileIcon.innerHTML = `<div class="default-profile"></div>`;
        }

        profileIcon.addEventListener("click", () => {
            dropdownMenu.style.display = dropdownMenu.style.display === "block" ? "none" : "block";
        });

        document.addEventListener("click", (event) => {
            if (!event.target.closest(".profile-list")) {
                dropdownMenu.style.display = "none";
            }
        });
    }

    function handleScroll() {
        let lastScrollTop = 0;
        window.addEventListener("scroll", () => {
            const header = document.getElementById("header-container");
            let scrollTop = window.scrollY || document.documentElement.scrollTop;

            if (scrollTop > lastScrollTop) {
                header.style.transform = "translateY(-100%)";
            } else {
                header.style.transform = "translateY(0)";
            }
            lastScrollTop = scrollTop;
        });
    }

    return { render };
}
