document.addEventListener('DOMContentLoaded', () => {
    const titleTextarea = document.getElementById('title-textarea');
    const contentsTextarea = document.getElementById('contents-textarea');
    const uploadButton = document.querySelector('.upload-button');

    const profileImage = document.getElementById('profile-image');
    const dropdownMenu = document.getElementById('dropdown-menu');

    const loginUser = JSON.parse(localStorage.getItem('loggedInUser')) || {};
    if (loginUser.profileImage) {
        profileImage.style.backgroundImage = loginUser.profileImage;
        profileImage.style.backgroundSize = 'cover'; // 이미지를 30px x 30px로 자르고 크기에 맞게 조정
        profileImage.style.backgroundPosition = 'center'; // 이미지를 중앙에 위치시키기
        profileImage.style.width = '30px';
        profileImage.style.height = '30px';
        profileImage.style.borderRadius = '50%'; // 둥근 모서리
    }

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

        /*
        fetch("https://example.com/api/posts", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("accessToken")}`
            },
            body: JSON.stringify({
                title: title,
                content: content,
                writerId: loggedInUser.id,
                date: currentDate
            })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`게시글 작성 실패: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log("게시글 작성 성공:", data);
        })
        .catch(error => {
            console.error("게시글 작성 중 오류 발생:", error.message);
        });
        */

        titleTextarea.value = '';
        contentsTextarea.value = '';
    });
});
