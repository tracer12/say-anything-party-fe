document.addEventListener('DOMContentLoaded', () => {
    const titleTextarea = document.getElementById('title-textarea');
    const contentsTextarea = document.getElementById('contents-textarea');
    const uploadButton = document.querySelector('.upload-button');

    const profileImage = document.getElementById('profile-image');
    const dropdownMenu = document.getElementById('dropdown-menu');

    profileImage.addEventListener('click', () => {
        dropdownMenu.style.display = dropdownMenu.style.display === 'block' ? 'none' : 'block';
    });

    document.addEventListener('click', (event) => {
        if (!event.target.closest('.profile-list')) {
            dropdownMenu.style.display = 'none';
        }
    });

    uploadButton.addEventListener('click', () => {
        const title = titleTextarea.value.trim();
        const content = contentsTextarea.value.trim();
        const currentDate = new Date().toISOString().slice(0, 19).replace('T', ' ');

        const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));

        if (!loggedInUser) {
            alert('로그인 후 작성해주세요.');
            return;
        }

        const newPost = {
            id: JSON.parse(localStorage.getItem('posts')).length + 1,
            title: title,
            content: content,
            comments: [],
            likes: 0,
            views: 0,
            date: currentDate,
            writerId: loggedInUser.id
        };

        const posts = JSON.parse(localStorage.getItem('posts')) || [];

        posts.push(newPost);

        localStorage.setItem('posts', JSON.stringify(posts));

        alert('게시글이 작성되었습니다!');

        titleTextarea.value = '';
        contentsTextarea.value = '';
    });
});
