document.addEventListener('DOMContentLoaded', () => {
    const titleTextarea = document.getElementById('title-textarea');
    const contentsTextarea = document.getElementById('contents-textarea');
    const uploadButton = document.querySelector('.upload-button');
    const fileSelectButton = document.querySelector('.file-select-button');
    const fileSelectText = document.querySelector('.file-select-text');

    const profileImage = document.getElementById('profile-image');
    const dropdownMenu = document.getElementById('dropdown-menu');

    let selectedImageData = null; // 선택된 이미지 데이터 저장 변수

    // 로그인한 유저 정보 가져오기
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

    // 파일 선택 버튼 클릭 시 파일 업로드 창 띄우기
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
                    selectedImageData = e.target.result; // 선택된 이미지 데이터 저장
                    fileSelectText.textContent = file.name; // 선택된 파일 이름 표시
                };
                reader.readAsDataURL(file); // 파일을 Base64로 변환하여 저장
            }
        });
    });

    uploadButton.addEventListener('click', () => {
        const title = titleTextarea.value.trim();
        const content = contentsTextarea.value.trim();
        const currentDate = new Date().toISOString().slice(0, 19).replace('T', ' ');
        const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));

        if (!title || !content) {
            alert("제목과 내용을 입력해주세요.");
            return;
        }

        const posts = JSON.parse(localStorage.getItem('posts')) || [];
        const newPost = {
            id: posts.length + 1,
            title: title,
            content: content,
            image: selectedImageData, // 선택된 이미지 데이터 저장
            comments: [],
            likes: 0,
            views: 0,
            date: currentDate,
            writerId: loggedInUser.id
        };

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
            body: JSON.stringify(newPost)
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

        window.location.href = '../list/list.html';
        titleTextarea.value = '';
        contentsTextarea.value = '';
        fileSelectText.textContent = "파일을 선택해주세요."; // 파일 선택 초기화
        selectedImageData = null;
    });
});
