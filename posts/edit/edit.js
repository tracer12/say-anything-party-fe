document.addEventListener('DOMContentLoaded', () => {
    const selectedPostId = localStorage.getItem('selectedPostId');
    const profileImage = document.getElementById('profile-image');
    const posts = JSON.parse(localStorage.getItem('posts')) || [];
    const fileSelectButton = document.querySelector('.file-select-button');
    const fileSelectText = document.querySelector('.file-select-text');
    const post = posts.find(post => post.id == selectedPostId);
    const loginUser = JSON.parse(localStorage.getItem('loggedInUser')) || {};

    let selectedImageData = null;

    if (loginUser.profileImage) {
        profileImage.style.backgroundImage = loginUser.profileImage;
        profileImage.style.backgroundSize = 'cover'; // 이미지를 30px x 30px로 자르고 크기에 맞게 조정
        profileImage.style.backgroundPosition = 'center'; // 이미지를 중앙에 위치시키기
        profileImage.style.width = '30px';
        profileImage.style.height = '30px';
        profileImage.style.borderRadius = '50%'; // 둥근 모서리
    }

    if (post) { // 기존 제목과 내용 가져오기
        document.getElementById('title-textarea').value = post.title;
        document.getElementById('contents-textarea').value = post.content;
    }

    fileSelectButton.addEventListener('click', () => {
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = 'image/*';
        fileInput.click();

        fileInput.addEventListener('change', (event) => {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function (e) {
                    selectedImageData = e.target.result;
                    fileSelectText.textContent = file.name;
                };
                reader.readAsDataURL(file);
            }
        });
    });


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
            post.image = selectedImageData;

            localStorage.setItem('posts', JSON.stringify(posts));

            alert("게시글 수정이 완료되었습니다.");

            // 게시글 수정 API 요청 (fetch)
            /*
            fetch(`https://example.com/api/posts/{postsId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("accessToken")}`
                },
                body: JSON.stringify({
                    title: updatedTitle,
                    content: updatedContent
                })
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`게시글 수정 실패: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                console.log("게시글 수정 성공:", data);
            })
            .catch(error => {
                console.error("게시글 수정 중 오류 발생:", error.message);
            });
            */

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
