import { ListUtils } from "../../utils/listUtils/ListUtils.js";
import { HeaderForm } from "../header/HeaderForm.js"

export function ListForm() {
    let currentPage = 1;
    const postsPerPage = 10;
    let allPosts = [];

    async function render() {
        const headerForm = new HeaderForm();
        headerForm.render();

        const accessToken = localStorage.getItem("accessToken");

        if (!accessToken) {
            alert("로그인이 필요합니다.");
            window.location.href = "../login";
            return;
        }

        allPosts = await ListUtils(accessToken);
        if (!allPosts) {
            console.error("게시글을 불러오지 못했습니다.");
            return;
        }

        ensureListContainer();
        displayPosts();
        window.addEventListener("scroll", handleScroll);
    }

    function ensureListContainer() {
        let listContainer = document.querySelector(".list-container");
        if (!listContainer) {
            console.warn("list-container가 없어 새로 생성합니다.");
            const wrap = document.querySelector(".wrap") || document.body;

            listContainer = document.createElement("div");
            listContainer.className = "list-container";

            listContainer.innerHTML = `
                <article>
                    <p class="welcome-list-text">
                        안녕하세요, </br>아무 말 대잔치 <strong>게시판</strong>입니다.
                    </p>
                </article>
                <article>
                    <div class="upload-button-location">
                        <button class="upload-button">게시글 작성</button>
                    </div>
                </article>
            `;
            wrap.appendChild(listContainer);

            document.querySelector(".upload-button").addEventListener("click", () => {
                window.location.href = "../pages/upload.html";
            });
        }
    }

    function displayPosts() {
        ensureListContainer();
        const listContainer = document.querySelector(".list-container");

        document.querySelectorAll(".post").forEach(post => post.remove());

        const startIndex = (currentPage - 1) * postsPerPage;
        const postsToShow = allPosts.slice(startIndex, startIndex + postsPerPage);

        postsToShow.forEach((post) => {
            listContainer.appendChild(PostCard(post));
        });
    }

    function formattedDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleString("ko-KR", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
        });
    }

    function PostCard(post) {
        const postElement = document.createElement("article");
        postElement.classList.add("post");
        const postCreateDate = formattedDate(post.createDate);

        postElement.innerHTML = `
            <div class="post-card-container">
                <h3 class="post-title">${post.title}</h3>
                <div class="post-wrapper">
                    <p class="post-info">
                        <span>좋아요 ${post.likes}</span>
                        <span>조회수 ${post.views}</span>  
                        <span>댓글 수 ${post.comments}</span> 
                    </p>
                    <p class="post-date">${postCreateDate}</p>
                </div>
                <hr class="post-card-line"/>
                <div class="author-info">
                    <div class="author-profile">
                        <div class="writer-profile-image"></div>
                    </div>
                    <p class="post-author">${post.nickname}</p>
                </div>
            </div>
        `;

        const writerProfileImage = postElement.querySelector(".writer-profile-image");
        if (post.profileImage) {
            writerProfileImage.style.backgroundImage = `url(http://localhost:8080${post.profileImage})`;
            writerProfileImage.style.backgroundSize = "cover";
            writerProfileImage.style.backgroundPosition = "center";
            writerProfileImage.style.width = "30px";
            writerProfileImage.style.height = "30px";
            writerProfileImage.style.borderRadius = "50%";
        } else {
            writerProfileImage.innerHTML = `<div class="default-profile"></div>`;
        }

        postElement.addEventListener("click", () => {
            localStorage.setItem("selectedPostId", post.pid);
            window.location.href = "../pages/detail.html";
        });

        return postElement;
    }

    function handleScroll() {
        const scrollable = document.documentElement.scrollHeight;
        const currentPosition = window.innerHeight + window.scrollY;

        if (currentPosition >= scrollable - 100 && currentPage * postsPerPage < allPosts.length) {
            currentPage++;
            displayPosts();
        }
    }

    document.addEventListener("DOMContentLoaded", () => {
        render();
    });

    return { render };
}
