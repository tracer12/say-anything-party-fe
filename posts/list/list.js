let currentPage = 1;
const postsPerPage = 10;

function displayPosts() {
    const listContainer = document.querySelector('.list-container');

    let posts = JSON.parse(localStorage.getItem('posts')) || [];

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

document.addEventListener('DOMContentLoaded', () => {
    const profileImage = document.getElementById('profile-image');
    const dropdownMenu = document.getElementById('dropdown-menu');

    profileImage.addEventListener('click', () => {
        const isVisible = dropdownMenu.style.display === 'block';
        dropdownMenu.style.display = isVisible ? 'none' : 'block';
    });

    document.addEventListener('click', (event) => {
        if (!event.target.closest('.profile-list')) {
            dropdownMenu.style.display = 'none';
        }
    });
});
