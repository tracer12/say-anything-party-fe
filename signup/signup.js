document.addEventListener('DOMContentLoaded', () => {
    const emailInput = document.getElementById('email-input');
    const passwordInput = document.getElementById('password-input');
    const passwordInputCheck = document.getElementById('password-input-check');
    const nicknameInput = document.getElementById('nickname-input');
    const profileIcon = document.querySelector('.profile-icon');
    const signupButton = document.querySelector('.signup-button');

    const helperTexts = {
        email: document.querySelector('.email-helper-text'),
        password: document.querySelector('.password-helper-text'),
        passwordCheck: document.querySelector('.password-check-helper-text'),
        nickname: document.querySelector('.nickname-helper-text'),
    };

    let profileImageUploaded = false;

    function setHelperText(element, message) {
        element.textContent = message;
        element.style.visibility = message ? "visible" : "hidden";
    }

    emailInput.addEventListener('input', () => {
        const email = emailInput.value.trim();
        if (!email) return setHelperText(helperTexts.email, "*이메일을 입력해주세요.");
        if (!validateEmail(email)) return setHelperText(helperTexts.email, "*올바른 이메일 형식을 입력하세요.");

        const users = JSON.parse(localStorage.getItem('users')) || [];
        setHelperText(helperTexts.email, users.some(user => user.email === email) ? "*중복된 이메일입니다." : "");
    });

    passwordInput.addEventListener('blur', () => {
        const password = passwordInput.value.trim();
        setHelperText(helperTexts.password,
            !password ? "*비밀번호를 입력해주세요." :
                !validatePassword(password) ? "*비밀번호는 8~20자, 대소문자, 숫자, 특수문자 포함해야 합니다." :
                    ""
        );
    });

    passwordInputCheck.addEventListener('blur', () => {
        setHelperText(helperTexts.passwordCheck,
            passwordInputCheck.value !== passwordInput.value ? "*비밀번호가 일치하지 않습니다." : ""
        );
    });

    nicknameInput.addEventListener('blur', () => {
        const nickname = nicknameInput.value.trim();
        setHelperText(helperTexts.nickname,
            !nickname ? "*닉네임을 입력해주세요." :
                nickname.length > 10 ? "*닉네임은 최대 10자까지 가능합니다." :
                    nickname.includes(" ") ? "*띄어쓰기를 없애주세요." : ""
        );
    });

    profileIcon.addEventListener('click', () => {
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = 'image/*';
        fileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = () => {
                profileIcon.style.backgroundImage = `url(${reader.result})`;
                profileImageUploaded = true;
            };
            reader.readAsDataURL(file);
        });
        fileInput.click();
    });

    function toggleSignupButton() {
        signupButton.disabled = !(
            validateEmail(emailInput.value) &&
            validatePassword(passwordInput.value) &&
            passwordInput.value === passwordInputCheck.value &&
            nicknameInput.value.trim().length > 0
        );
    }

    [emailInput, passwordInput, passwordInputCheck, nicknameInput].forEach(input =>
        input.addEventListener('input', toggleSignupButton)
    );

    signupButton.addEventListener('click', () => {
        const users = JSON.parse(localStorage.getItem('users')) || [];
        users.push({
            id: users.length + 1,
            nickname: nicknameInput.value,
            email: emailInput.value,
            password: passwordInput.value,
            profileImage: profileImageUploaded ? profileIcon.style.backgroundImage : ''
        });
        localStorage.setItem('users', JSON.stringify(users));
        alert('회원가입 완료!');

        // 회원가입 API 요청 (fetch)
        /*
        fetch("https://example.com/api/users", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email: emailInput.value,
                password: passwordInput.value,
                passwordCheck: passwordInputCheck.value,
                nickname: nicknameInput.value,
                profileImage: profileImageUploaded ? profileIcon.style.backgroundImage : null
            })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`회원가입 실패: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log("회원가입 성공:", data);
        })
        .catch(error => {
            console.error("회원가입 중 오류 발생:", error.message);
        });
        */

        window.location.href = '../login/login.html';
    });
});

function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validatePassword(password) {
    return /^(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/.test(password);
}
