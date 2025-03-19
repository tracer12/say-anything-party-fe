(function () {
    let currentPage = 1;
    const postsPerPage = 10;

    document.addEventListener("DOMContentLoaded", async function () {
        const accessToken = localStorage.getItem("accessToken");

        if (!accessToken) {
            alert("로그인이 필요합니다.");
            window.location.href = "login.html";
            return;
        }

        try {
            // Fetch로 게시글 데이터 가져오기
            const response = await fetch("http://localhost:8080/posts", {
                method: "GET",
                headers: {
                    Accept: "application/json",
                    Authorization: `Bearer ${accessToken}`, // 서버에 토큰을 넘겨서 인증을 받도록 함
                },
            });

            if (!response.ok) {
                throw new Error('게시글을 가져오는 데 실패했습니다.');
            }

            const posts = await response.json();
            console.log(posts);
            displayPosts(posts); // 게시글 displayPosts로 넘김
        } catch (error) {
            console.error("게시글 가져오기 실패:", error.message);
        }
    });

    function formattedDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleString('ko-KR', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
        });
    }

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

        const profileIcon = localStorage.getItem('profileImage') || "";
        if (profileIcon) {
            profileImage.style.backgroundImage = `url(http://localhost:8080${profileIcon})`; // 🔹 서버 URL 포함
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

    // 게시글을 화면에 표시하는 함수
    function displayPosts(posts) {
        const listContainer = document.querySelector('.list-container');

        const postsToShow = posts.slice((currentPage - 1) * postsPerPage, currentPage * postsPerPage);

        postsToShow.forEach(post => {
            const postElement = document.createElement('article');
            postElement.classList.add('post');
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
                            <div class="writer-profile-image" id="writer-profile-image"></div>
                        </div>
                        <p class="post-author">${post.nickname}</p>
                    </div>
                </div>
            `;

            console.log(post.profileImage);

            // ✅ id가 아니라 class로 선택 (postElement 내부에서만 찾도록)
            const writerProfileImage = postElement.querySelector('.writer-profile-image');

            if (post.profileImage) {
                writerProfileImage.style.backgroundImage = `url(http://localhost:8080${post.profileImage})`;
                writerProfileImage.style.backgroundSize = 'cover';
                writerProfileImage.style.backgroundPosition = 'center';
                writerProfileImage.style.width = '30px';
                writerProfileImage.style.height = '30px';
                writerProfileImage.style.borderRadius = '50%';
            } else {
                writerProfileImage.innerHTML = `<div class="default-profile"></div>`;
            }

            listContainer.appendChild(postElement);

            postElement.addEventListener('click', () => {
                localStorage.setItem('selectedPostId', post.pid);
                window.location.href = '../../posts/detail/detail.html';
            });
        });
    }

    // 스크롤 시 게시글을 더 로드하는 함수
    function handleScroll() {
        const scrollable = document.documentElement.scrollHeight;
        const currentPosition = window.innerHeight + window.scrollY;

        if (currentPosition >= scrollable - 100) {
            const posts = JSON.parse(localStorage.getItem('posts')) || [];

            if (currentPage * postsPerPage >= posts.length) {
                return;
            }

            currentPage++;
            displayPosts(posts); // 서버에서 받아온 게시글로 갱신
        }
    }

    document.addEventListener('DOMContentLoaded', () => {
        window.addEventListener('scroll', handleScroll);
    });

})();
