document.addEventListener('DOMContentLoaded', () => {
    const nicknameInput = document.getElementById('nickname-input');
    const changeProfileButton = document.querySelector('.changeprofile-button');
    const nicknameHelperText = document.querySelector('.nickname-helper-text');
    const emailText = document.getElementById('email-text');
    const profileIcon = document.querySelector('.profile-icon');
    const deleteProfileButton = document.querySelector('.deleteprofile-button');
    const modal = document.querySelector('.modal');
    const cancelButton = document.querySelector('.modal-button');
    const confirmButton = document.querySelector('.modal-button-confirm');
    const profileImage = document.getElementById('profile-image');
    const dropdownMenu = document.getElementById('dropdown-menu');
    let profileImageUploaded = false;

    profileImage.addEventListener('click', () => {
        dropdownMenu.style.display = dropdownMenu.style.display === 'block' ? 'none' : 'block';
    });

    document.addEventListener('click', (event) => {
        if (!event.target.closest('.profile-list')) {
            dropdownMenu.style.display = 'none';
        }
    });


    const user = JSON.parse(localStorage.getItem('loggedInUser')) || {};
    emailText.textContent = user.email || "이메일 없음";


    profileIcon.addEventListener('click', () => {
        if (!profileImageUploaded) {
            const fileInput = document.createElement('input');
            fileInput.type = 'file';
            fileInput.accept = 'image/*';
            fileInput.click();

            fileInput.addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = function (e) {
                        profileIcon.style.backgroundImage = `url(${e.target.result})`;
                        profileImageUploaded = true;
                    };
                    reader.readAsDataURL(file);
                }
            });
        } else {
            profileIcon.style.backgroundImage = '';
            profileImageUploaded = false;
        }
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

            const userIndex = users.findIndex(user => user.email === user.email);
            if (userIndex !== -1) {
                users[userIndex].nickname = nicknameValue;

                if (profileImageUploaded) {
                    users[userIndex].profileImage = profileIcon.style.backgroundImage;
                }

                localStorage.setItem('users', JSON.stringify(users));

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

    deleteProfileButton.addEventListener('click', () => {
        modal.style.display = "flex";
    });

    cancelButton.addEventListener('click', () => {
        modal.style.display = "none";
    });

    confirmButton.addEventListener('click', () => {
        let users = JSON.parse(localStorage.getItem('users')) || [];
        users = users.filter(u => u.email !== user.email);
        localStorage.setItem('users', JSON.stringify(users));
        localStorage.removeItem('loggedInUser');
        alert("회원 탈퇴가 완료되었습니다.");
        window.location.href = "../../../login/login.html";
    });
});
