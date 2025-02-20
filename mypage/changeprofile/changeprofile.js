document.addEventListener('DOMContentLoaded', () => {
    const nicknameInput = document.getElementById('nickname-input');
    const changeProfileButton = document.querySelector('.changeprofile-button');
    const nicknameHelperText = document.querySelector('.nickname-helper-text');
    const emailText = document.getElementById('email-text');
    const profileIcon = document.querySelector('.profile-icon');
    const deleteProfileButton = document.querySelector('.deleteprofile-button');
    const modal = document.querySelector('.modal');
    const cancelButton = document.querySelector('#cancelButton');
    const confirmButton = document.querySelector('#confirmButton');
    const profileImage = document.getElementById('profile-image');
    const dropdownMenu = document.getElementById('dropdown-menu');
    let profileImageUploaded = false;

    // 로그인된 사용자 정보 가져오기
    const user = JSON.parse(localStorage.getItem('loggedInUser')) || {};
    emailText.textContent = user.email || "이메일 없음";
    if (user.profileImage) {
        profileImage.style.backgroundImage = user.profileImage;
        profileImage.style.backgroundSize = 'cover'; // 이미지를 30px x 30px로 자르고 크기에 맞게 조정
        profileImage.style.backgroundPosition = 'center'; // 이미지를 중앙에 위치시키기
        profileImage.style.width = '30px';
        profileImage.style.height = '30px';
        profileImage.style.borderRadius = '50%'; // 둥근 모서리
    }

    if (user.profileImage) {
        profileIcon.style.backgroundImage = user.profileImage;
    }

    // 프로필 이미지 클릭 시 드롭다운 토글
    profileImage.addEventListener('click', () => {
        dropdownMenu.style.display = dropdownMenu.style.display === 'block' ? 'none' : 'block';
    });

    // 드롭다운 메뉴 닫기
    document.addEventListener('click', (event) => {
        if (!event.target.closest('.profile-list')) {
            dropdownMenu.style.display = 'none';
        }
    });

    // 프로필 이미지 클릭 시 파일 선택
    profileIcon.addEventListener('click', () => {
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = 'image/*';
        fileInput.click();

        fileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function (e) {
                    const img = new Image();
                    img.onload = function () {
                        // 이미지 크기를 160px * 160px으로 조정
                        const canvas = document.createElement('canvas');
                        const ctx = canvas.getContext('2d');
                        const size = 160;
                        canvas.width = size;
                        canvas.height = size;
                        ctx.drawImage(img, 0, 0, size, size);

                        // 프로필 이미지 업데이트
                        profileIcon.style.backgroundImage = `url(${canvas.toDataURL()})`;
                        profileImageUploaded = true;

                        // 프로필 이미지 30px로 설정
                        profileImage.style.backgroundImage = `url(${canvas.toDataURL()})`; // <div>에 이미지를 설정
                        profileImage.style.backgroundSize = 'cover'; // 이미지를 30px x 30px로 자르고 크기에 맞게 조정
                        profileImage.style.backgroundPosition = 'center'; // 이미지를 중앙에 위치시키기
                        profileImage.style.width = '30px';  // 30px 크기로 설정
                        profileImage.style.height = '30px'; // 30px 크기로 설정
                        profileImage.style.borderRadius = '50%'; // 둥근 모서리
                    };
                    img.src = e.target.result;
                };
                reader.readAsDataURL(file);
            }
        });
    });

    // 닉네임 유효성 체크
    nicknameInput.addEventListener('blur', () => {
        const nicknameValue = nicknameInput.value.trim();
        if (nicknameValue === "") {
            nicknameHelperText.textContent = "*닉네임을 입력해주세요.";
            nicknameHelperText.style.visibility = "visible";
        } else if (nicknameValue.length > 10) {
            nicknameHelperText.textContent = "*닉네임은 최대 10자까지 작성 가능합니다.";
            nicknameHelperText.style.visibility = "visible";
        } else if (nicknameValue.includes(" ")) {
            nicknameHelperText.textContent = "*띄어쓰기를 없애주세요.";
            nicknameHelperText.style.visibility = "visible";
        } else {
            nicknameHelperText.style.visibility = "hidden";
        }
    });

    // 수정 완료 버튼 클릭 시
    changeProfileButton.addEventListener('click', () => {
        const nicknameValue = nicknameInput.value.trim();

        if (nicknameValue === "") {
            nicknameHelperText.textContent = "*닉네임을 입력해주세요.";
            nicknameHelperText.style.visibility = "visible";
        } else if (nicknameValue.length > 10) {
            nicknameHelperText.textContent = "*닉네임은 최대 10자까지 작성 가능합니다.";
            nicknameHelperText.style.visibility = "visible";
        } else if (nicknameValue.includes(" ")) {
            nicknameHelperText.textContent = "*띄어쓰기를 없애주세요.";
            nicknameHelperText.style.visibility = "visible";
        } else {
            const users = JSON.parse(localStorage.getItem('users')) || [];

            const userIndex = users.findIndex(user => user.email === user.email);
            if (userIndex !== -1) {
                // 유저 정보 수정
                users[userIndex].nickname = nicknameValue;

                // 프로필 이미지가 변경되었으면 저장
                if (profileImageUploaded) {
                    users[userIndex].profileImage = profileIcon.style.backgroundImage;
                }

                // 로컬 스토리지에 반영
                localStorage.setItem('users', JSON.stringify(users));

                // loggedInUser에도 반영
                const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
                loggedInUser.nickname = nicknameValue;

                if (profileImageUploaded) {
                    loggedInUser.profileImage = profileIcon.style.backgroundImage;
                }

                localStorage.setItem('loggedInUser', JSON.stringify(loggedInUser));

                // 수정된 이미지와 닉네임을 헤더에 반영
                const profileImageUrl = loggedInUser.profileImage;
                const headerProfileImage = document.getElementById('profile-image');
                if (profileImageUrl) {
                    headerProfileImage.style.backgroundImage = profileImageUrl;  // 이미지 URL을 <div>에 반영
                    headerProfileImage.style.backgroundSize = 'cover'; // 이미지를 30px x 30px로 자르고 크기에 맞게 조정
                    headerProfileImage.style.backgroundPosition = 'center'; // 이미지를 중앙에 위치시키기
                    headerProfileImage.style.width = '30px'; // 30px 크기로 설정
                    headerProfileImage.style.height = '30px'; // 30px 크기로 설정
                    headerProfileImage.style.borderRadius = '50%'; // 둥근 모서리
                }

                // 수정 완료 메시지
                const toastMessage = document.createElement('div');
                toastMessage.textContent = "수정 완료";
                toastMessage.style.position = "fixed";
                toastMessage.style.top = "20px";
                toastMessage.style.left = "50%";
                toastMessage.style.transform = "translateX(-50%)";
                toastMessage.style.backgroundColor = "#7F6AEE";
                toastMessage.style.color = "white";
                toastMessage.style.padding = "10px 20px";
                toastMessage.style.borderRadius = "5px";
                document.body.appendChild(toastMessage);

                setTimeout(() => {
                    document.body.removeChild(toastMessage);
                }, 3000);
            } else {
                console.error('해당 이메일의 사용자가 없습니다.');
            }
        }
    });

    // 프로필 삭제 버튼 클릭 시 모달 띄우기
    deleteProfileButton.addEventListener('click', () => {
        modal.style.display = "flex";
    });

    // 모달 취소 버튼 클릭 시
    cancelButton.addEventListener('click', () => {
        modal.style.display = "none";
    });

    // 모달 배경 클릭 시
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = "none";
        }
    });

    // 회원 탈퇴 확인 버튼 클릭 시
    confirmButton.addEventListener('click', () => {
        let users = JSON.parse(localStorage.getItem('users')) || [];
        users = users.filter(u => u.email !== user.email);
        localStorage.setItem('users', JSON.stringify(users));
        localStorage.removeItem('loggedInUser');
        alert("회원 탈퇴가 완료되었습니다.");
        window.location.href = "../../../login/login.html";
    });
});
