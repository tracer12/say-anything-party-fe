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

            const userIndex = users.findIndex(user => user.email === user.email);
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

                const profileImageUrl = loggedInUser.profileImage;
                const headerProfileImage = document.getElementById('profile-image');
                if (profileImageUrl) {
                    headerProfileImage.style.backgroundImage = profileImageUrl;
                    headerProfileImage.style.backgroundSize = 'cover';
                    headerProfileImage.style.backgroundPosition = 'center';
                    headerProfileImage.style.width = '30px';
                    headerProfileImage.style.height = '30px';
                    headerProfileImage.style.borderRadius = '50%';
                }

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
        alert("회원 탈퇴가 완료되었습니다.");
        window.location.href = "../../../login/login.html";
    });
});
