document.addEventListener('DOMContentLoaded', () => {
    const emailInput = document.getElementById('email-input');
    const passwordInput = document.getElementById('password-input');
    const passwordInputCheck = document.getElementById('password-input-check');
    const nicknameInput = document.getElementById('nickname-input');
    const profileIcon = document.querySelector('.profile-icon');
    const signupButton = document.querySelector('.signup-button');
    let selectedImageFile = null; // 🔹 선택된 이미지 파일을 저장할 변수

    const helperTexts = {
        email: document.querySelector('.email-helper-text'),
        password: document.querySelector('.password-helper-text'),
        passwordCheck: document.querySelector('.password-check-helper-text'),
        nickname: document.querySelector('.nickname-helper-text'),
    };

    function setHelperText(element, message) {
        element.textContent = message;
        element.style.visibility = message ? "visible" : "hidden";
    }

    emailInput.addEventListener('blur', () => {
        const email = emailInput.value.trim();
        setHelperText(helperTexts.email,
            !email ? "*이메일을 입력해주세요" :
                !validateEmail(email) ? "*올바른 이메일 형식을 입력하세요." :
                    ""
        );
        helperTexts.email.style.height = "16px";
    });

    passwordInput.addEventListener('blur', () => {
        const password = passwordInput.value.trim();
        setHelperText(helperTexts.password,
            !password ? "*비밀번호를 입력해주세요." :
                !validatePassword(password) ? "*비밀번호는 8~20자, 대소문자, 숫자, 특수문자 포함해야 합니다." :
                    ""
        );
        helperTexts.password.style.height = "16px";
    });

    passwordInputCheck.addEventListener('blur', () => {
        setHelperText(helperTexts.passwordCheck,
            passwordInputCheck.value !== passwordInput.value ? "*비밀번호가 일치하지 않습니다." : ""
        );


        helperTexts.passwordCheck.style.height = "16px";
    });


    nicknameInput.addEventListener('blur', () => {
        const nickname = nicknameInput.value.trim();
        setHelperText(helperTexts.nickname,
            !nickname ? "*닉네임을 입력해주세요." :
                nickname.length > 10 ? "*닉네임은 최대 10자까지 가능합니다." :
                    nickname.includes(" ") ? "*띄어쓰기를 없애주세요." : ""
        );
        helperTexts.nickname.style.height = "16px";
    });

    profileIcon.addEventListener('click', () => {
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = 'image/*';
        fileInput.click();

        fileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];

            if (file) {
                selectedImageFile = file; // ✅ 선택한 파일을 전역 변수에 저장

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
                    };
                    img.src = e.target.result;
                };
                reader.readAsDataURL(file);
            } else {
                console.log("🚨 파일이 선택되지 않음");
            }
        });
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

    signupButton.addEventListener('click', async () => {

        const formData = new FormData();
        formData.append("email", emailInput.value);
        formData.append("password", passwordInput.value);
        formData.append("passwordCheck", passwordInputCheck.value);
        formData.append("nickname", nicknameInput.value);

        if (selectedImageFile) {
            formData.append("profile_image", selectedImageFile); // ✅ 선택한 파일 추가
        } else {
            console.log("🚨 선택한 프로필 이미지 없음");
        }

        try {
            const response = await fetch("http://localhost:8080/users", {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                throw new Error(`회원가입 실패: ${response.status}`);
            }

            const data = await response.json();
            alert("회원가입이 완료되었습니다!");
            window.location.href = '../login/login.html';
        } catch (error) {
            console.error("❌ 회원가입 중 오류 발생:", error.message);
            alert("회원가입 실패: " + error.message);
        }
    });
});

function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validatePassword(password) {
    return /^(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/.test(password);
}
