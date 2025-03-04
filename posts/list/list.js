let currentPage = 1;
const postsPerPage = 10;

// 로그인 후 모든 게시글 정보를 불러오는 fetch useEffect 없이도 이게 맞나?
// document.addEventListener("DOMContentLoaded", async function () {
//     const accessToken = localStorage.getItem("accessToken");

//     if (!accessToken) {
//         alert("로그인이 필요합니다.");
//         window.location.href = "login.html";
//         return;
//     }

//     try {
//         const response = await fetch("https://example.com/api/posts", {
//             method: "GET",
//             headers: {
//                 Accept: "application/json",
//             },
//         });

//         const posts = await response.json();
//         displayPosts(posts); // 게시글 displayPosts로 넘김김
//     } catch (error) {
//         console.error("게시글 가져오기 실패:", error.message);
//     }
// });

document.addEventListener("DOMContentLoaded", () => {
    fetch("../../header/header.html")
        .then(response => response.text())
        .then(data => {
            document.getElementById("header-container").innerHTML = data;
            setupProfileDropdown();
        })
        .catch(error => console.error("헤더 로드 실패:", error));
});

if (!document.querySelector("link[href*='header.css']")) {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "../../header/header.css";
    document.head.appendChild(link);
}

function setupProfileDropdown() {
    const profileImage = document.getElementById('profile-image');
    const dropdownMenu = document.getElementById('dropdown-menu');

    if (!profileImage || !dropdownMenu) {
        console.error("프로필 이미지 또는 드롭다운 메뉴를 찾을 수 없습니다.");
        return;
    }

    const loginUser = JSON.parse(localStorage.getItem('loggedInUser')) || {};
    if (loginUser.profileImage) {
        profileImage.style.backgroundImage = loginUser.profileImage;
        profileImage.style.backgroundSize = 'cover';
        profileImage.style.backgroundPosition = 'center';
        profileImage.style.width = '30px';
        profileImage.style.height = '30px';
        profileImage.style.borderRadius = '50%';
    }

    profileImage.addEventListener('click', () => {
        dropdownMenu.style.display = dropdownMenu.style.display === 'block' ? 'none' : 'block';
    });

    document.addEventListener('click', (event) => {
        if (!event.target.closest('.profile-list')) {
            dropdownMenu.style.display = 'none';
        }
    });
}

function displayPosts() {
    const listContainer = document.querySelector('.list-container');
    const posts = JSON.parse(localStorage.getItem('posts')) || [];

    const postsToShow = posts.slice((currentPage - 1) * postsPerPage, currentPage * postsPerPage);

    postsToShow.forEach(post => {
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const user = users.find(user => user.id === post.writerId);

        const postElement = document.createElement('article');
        postElement.classList.add('post');

        postElement.innerHTML = `
            <div class="post-card-container">
                <h3 class="post-title">${post.title}</h3>
                <div class="post-wrapper">
                    <p class="post-info">
                        <span>좋아요 ${post.likes}</span>
                        <span>조회수 ${post.views}</span>  
                        <span>댓글 수 ${post.comments.length}</span> 
                    </p>
                    <p class="post-date">${post.date}</p>
                </div>
                <hr class="post-card-line"/>
                <p class="post-author">${user ? user.nickname : '작성자 없음'}</p>
            </div>
        `;

        listContainer.appendChild(postElement);
        postElement.addEventListener('click', () => {
            localStorage.setItem('selectedPostId', post.id);
            localStorage.setItem('selectedPostWriterId', post.writerId);
            window.location.href = '../../posts/detail/detail.html';
        });
    });
}

function handleScroll() {
    const scrollable = document.documentElement.scrollHeight;
    const currentPosition = window.innerHeight + window.scrollY;

    if (currentPosition >= scrollable - 100) {
        const posts = JSON.parse(localStorage.getItem('posts')) || [];

        if (currentPage * postsPerPage >= posts.length) {
            return;
        }

        currentPage++;
        displayPosts();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    displayPosts();
    window.addEventListener('scroll', handleScroll);
});
