document.addEventListener('DOMContentLoaded', () => {
    const passwordInput = document.getElementById('password-input');
    const passwordInputCheck = document.getElementById('password-input-check');
    const changepasswordButton = document.querySelector('.changepassword-button');
    const passwordHelperText = document.querySelector('.changepassword-helper-text');
    const passwordCheckHelperText = document.querySelector('.changepassword-check-helper-text');
    const loginUser = JSON.parse(localStorage.getItem('loggedInUser')) || {};
    const profileImage = document.getElementById('profile-image');
    const dropdownMenu = document.getElementById('dropdown-menu');

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

    function validatePassword(password) {
        const re = /^(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/;
        return re.test(password);
    }

    passwordInput.addEventListener('blur', () => {
        const passwordValue = passwordInput.value.trim();
        if (passwordValue === "") {
            passwordHelperText.textContent = "*비밀번호를 입력해주세요.";
            passwordHelperText.style.visibility = "visible";
        } else if (!validatePassword(passwordValue)) {
            passwordHelperText.textContent = "*비밀번호는 8자 이상, 20자 이하이며, 소문자, 숫자, 특수문자를 각각 최소 1개 포함해야 합니다.";
            passwordHelperText.style.visibility = "visible";
        } else {
            passwordHelperText.style.visibility = "hidden";
        }
    });

    passwordInputCheck.addEventListener('blur', () => {
        const passwordValue = passwordInput.value.trim();
        const passwordCheckValue = passwordInputCheck.value.trim();
        if (passwordCheckValue === "") {
            passwordCheckHelperText.textContent = "*비밀번호 확인을 입력해주세요.";
            passwordCheckHelperText.style.visibility = "visible";
        } else if (passwordValue !== passwordCheckValue) {
            passwordCheckHelperText.textContent = "*비밀번호 확인을 한 번 더 입력해주세요.";
            passwordCheckHelperText.style.visibility = "visible";
        } else {
            passwordCheckHelperText.style.visibility = "hidden";
        }
    });

    changepasswordButton.addEventListener('click', () => {
        const passwordValue = passwordInput.value.trim();
        const passwordCheckValue = passwordInputCheck.value.trim();

        if (passwordValue === "") {
            passwordHelperText.textContent = "*비밀번호를 입력해주세요.";
            passwordHelperText.style.visibility = "visible";
        } else if (!validatePassword(passwordValue)) {
            passwordHelperText.textContent = "*비밀번호는 8자 이상, 20자 이하이며, 소문자, 숫자, 특수문자를 각각 최소 1개 포함해야 합니다.";
            passwordHelperText.style.visibility = "visible";
        } else if (passwordValue !== passwordCheckValue) {
            passwordCheckHelperText.textContent = "*비밀번호 확인을 한 번 더 입력해주세요.";
            passwordCheckHelperText.style.visibility = "visible";
        } else {

            const users = JSON.parse(localStorage.getItem('users')) || [];

            const userIndex = users.findIndex(u => u.email === loginUser.email);
            if (userIndex !== -1) {
                users[userIndex].password = passwordValue;

                localStorage.setItem('users', JSON.stringify(users));

                alert("비밀번호 수정이 완료되었습니다.");

                /* 비밀번호 변경 fetch
                fetch("https://example.com/api/users/{userId}/password", {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem("accessToken")}`
                    },
                    body: JSON.stringify({
                        email: loginUser.email,
                        newPassword: passwordValue
                    })
                })
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`비밀번호 변경 실패: ${response.status}`);
                    }
                    return response.json();
                })
                .then(data => {
                    console.log("비밀번호 변경 성공:", data);
                })
                .catch(error => {
                    console.error("비밀번호 변경 중 오류 발생:", error.message);
                });
                */

                window.location.href = "../../login/login.html";
            } else {
                console.error('해당 이메일의 사용자가 없습니다.');
            }
        }
    });

});
