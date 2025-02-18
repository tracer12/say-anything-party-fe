document.addEventListener('DOMContentLoaded', () => {
    const emailInput = document.getElementById('email-input');
    const passwordInput = document.getElementById('password-input');
    const passwordInputCheck = document.getElementById('password-input-check');
    const nicknameInput = document.getElementById('nickname-input');
    const profileIcon = document.querySelector('.profile-icon');
    const signupButton = document.querySelector('.signup-button');
    const emailHelperText = document.querySelector('.email-helper-text');
    const passwordHelperText = document.querySelector('.password-helper-text');
    const passwordCheckHelperText = document.querySelector('.password-check-helper-text');
    const nicknameHelperText = document.querySelector('.nickname-helper-text');
    const profileImage = document.querySelector('.profile-icon');
    let profileImageUploaded = false;

    emailInput.addEventListener('input', () => {
        const emailValue = emailInput.value.trim();

        if (emailValue === "") {
            emailHelperText.textContent = "*이메일을 입력해주세요.";
            emailHelperText.style.visibility = "visible";
        } else if (!validateEmail(emailValue)) {
            emailHelperText.textContent = "*올바른 이메일 주소 형식을 입력해주세요. (예: example@example.com)";
            emailHelperText.style.visibility = "visible";
        } else {
            const users = JSON.parse(localStorage.getItem('users')) || [];
            const emailExists = users.some(user => user.email === emailValue);

            if (emailExists) {
                emailHelperText.textContent = "*중복된 이메일입니다.";
                emailHelperText.style.visibility = "visible";
            } else {
                emailHelperText.style.visibility = "hidden";
            }
        }
    });
    passwordInput.addEventListener('blur', () => {
        const passwordValue = passwordInput.value.trim();
        if (passwordValue === "") {
            passwordHelperText.textContent = "*비밀번호를 입력해주세요.";
            passwordHelperText.style.visibility = "visible";
        } else if (!validatePassword(passwordValue)) {
            passwordHelperText.textContent = "*비밀번호는 8자 이상, 20자 이하이며, 대문자, 소문자, 숫자, 특수문자가 각각 최소 1개 포함해야 합니다.";
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
                        profileImage.style.backgroundImage = `url(${e.target.result})`;
                        profileImageUploaded = true;
                    };
                    reader.readAsDataURL(file);
                }
            });
        } else {
            profileImage.style.backgroundImage = '';
            profileImageUploaded = false;
        }
    });


    function toggleSignupButton() {
        const emailValid = emailInput.value && validateEmail(emailInput.value);
        const passwordValid = passwordInput.value && validatePassword(passwordInput.value);
        const passwordCheckValid = passwordInputCheck.value && passwordInput.value === passwordInputCheck.value;
        const nicknameValid = nicknameInput.value && nicknameInput.value.length <= 10 && !nicknameInput.value.includes(" ");
        const allValid = emailValid && passwordValid && passwordCheckValid && nicknameValid;

        signupButton.disabled = !allValid;
        signupButton.style.backgroundColor = allValid ? '#7F6AEE' : '#ACA0EB';
    }


    emailInput.addEventListener('input', toggleSignupButton);
    passwordInput.addEventListener('input', toggleSignupButton);
    passwordInputCheck.addEventListener('input', toggleSignupButton);
    nicknameInput.addEventListener('input', toggleSignupButton);
    signupButton.addEventListener('click', () => {
        const users = JSON.parse(localStorage.getItem('users')) || [];

        const newUser = {
            id: users.length + 1,
            nickname: nicknameInput.value,
            email: emailInput.value,
            password: passwordInput.value,
            profileImage: profileImageUploaded ? profileImage.style.backgroundImage : ''
        };

        users.push(newUser);

        localStorage.setItem('users', JSON.stringify(users));

        alert('회원가입 완료!');
        window.location.href = '../login/login.html';
    });
    toggleSignupButton();
});

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validatePassword(password) {
    const re = /^(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/;
    return re.test(password);
}
