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

    const loginUser = JSON.parse(localStorage.getItem('loggedInUser')) || {};
    emailText.textContent = loginUser.email || "이메일 없음";

    if (loginUser.profileImage) {
        profileImage.style.backgroundImage = loginUser.profileImage;
        profileImage.style.backgroundSize = 'cover';
        profileImage.style.backgroundPosition = 'center';
        profileImage.style.width = '30px';
        profileImage.style.height = '30px';
        profileImage.style.borderRadius = '50%';
    }

    if (loginUser.profileImage) {
        profileIcon.style.backgroundImage = loginUser.profileImage;
    }

    profileImage.addEventListener('click', () => {
        dropdownMenu.style.display = dropdownMenu.style.display === 'block' ? 'none' : 'block';
    });

    document.addEventListener('click', (event) => {
        if (!event.target.closest('.profile-list')) {
            dropdownMenu.style.display = 'none';
        }
    });

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
                        const canvas = document.createElement('canvas');
                        const ctx = canvas.getContext('2d');
                        const size = 160;
                        canvas.width = size;
                        canvas.height = size;
                        ctx.drawImage(img, 0, 0, size, size);
                        profileIcon.style.backgroundImage = `url(${canvas.toDataURL()})`;
                        profileImageUploaded = true;

                        profileImage.style.backgroundImage = `url(${canvas.toDataURL()})`;
                        profileImage.style.backgroundSize = 'cover';
                        profileImage.style.backgroundPosition = 'center';
                        profileImage.style.width = '30px';
                        profileImage.style.height = '30px';
                        profileImage.style.borderRadius = '50%';
                    };
                    img.src = e.target.result;
                };
                reader.readAsDataURL(file);
            }
        });
    });

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

            const userIndex = users.findIndex(user => user.email === loginUser.email);
            if (userIndex !== -1) {
                users[userIndex].nickname = nicknameValue;

                if (profileImageUploaded) {
                    users[userIndex].profileImage = profileIcon.style.backgroundImage;
                }

                localStorage.setItem('users', JSON.stringify(users));

                const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
                loggedInUser.nickname = nicknameValue;

                if (profileImageUploaded) {
                    loggedInUser.profileImage = profileIcon.style.backgroundImage;
                }

                localStorage.setItem('loggedInUser', JSON.stringify(loggedInUser));

                // 프로필 업데이트 API 요청 (fetch)
                /*
                fetch("https://example.com/api/users/{userId}/profile", {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem("accessToken")}`
                    },
                    body: JSON.stringify({
                        email: loginUser.email,
                        nickname: nicknameValue,
                        profileImage: profileImageUploaded ? profileIcon.style.backgroundImage : null
                    })
                })
                .then(response => response.json())
                .then(data => console.log("프로필 업데이트 성공:", data))
                .catch(error => console.error("프로필 업데이트 중 오류 발생:", error.message));
                */

                const toastMessage = document.createElement('div');
                toastMessage.textContent = "수정 완료";
                toastMessage.style.position = "fixed";
                toastMessage.style.top = "83%";
                toastMessage.style.left = "50%";
                toastMessage.style.transform = "translateX(-50%)";
                toastMessage.style.backgroundColor = "#ACA0EB";
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

    deleteProfileButton.addEventListener('click', () => {
        modal.style.display = "flex";
    });

    cancelButton.addEventListener('click', () => {
        modal.style.display = "none";
    });

    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = "none";
        }
    });

    confirmButton.addEventListener('click', () => {
        let users = JSON.parse(localStorage.getItem('users')) || [];
        users = users.filter(u => u.email !== loginUser.email);
        localStorage.setItem('users', JSON.stringify(users));
        localStorage.removeItem('loggedInUser');

        // 회원 탈퇴 API 요청 (fetch)
        /*
        fetch(`https://example.com/api/users/{userId}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${localStorage.getItem("accessToken")}`
            }
        })
        .then(() => console.log("회원 탈퇴 성공"))
        .catch(error => console.error("회원 탈퇴 중 오류 발생:", error.message));
        */

        alert("회원 탈퇴가 완료되었습니다.");
        window.location.href = "../../../login/login.html";
    });
});
