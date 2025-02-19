document.addEventListener('DOMContentLoaded', () => {
    const selectedPostId = localStorage.getItem('selectedPostId');

    const posts = JSON.parse(localStorage.getItem('posts')) || [];

    const post = posts.find(post => post.id == selectedPostId);

    if (post) {
        document.getElementById('title-textarea').value = post.title;
        document.getElementById('contents-textarea').value = post.content;
    }

    document.querySelector('.edit-button').addEventListener('click', () => {
        const updatedTitle = document.getElementById('title-textarea').value.trim();
        const updatedContent = document.getElementById('contents-textarea').value.trim();

        if (updatedTitle === "" || updatedContent === "") {
            alert("제목과 내용을 모두 입력해주세요.");
            return;
        }

        if (post) {
            post.title = updatedTitle;
            post.content = updatedContent;

            localStorage.setItem('posts', JSON.stringify(posts));

            alert("게시글 수정이 완료되었습니다.");
            window.location.href = '../detail/detail.html';
        }
    });
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
