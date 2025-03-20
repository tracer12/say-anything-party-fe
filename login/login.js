document.addEventListener("DOMContentLoaded", function () {

    const emailInput = document.getElementById('email-input');
    const passwordInput = document.getElementById('password-input');
    const loginButton = document.getElementById('login-button');

    const helperTexts = {
        email: document.querySelector('.email-helper-text'),
        password: document.querySelector('.password-helper-text'),
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

    function validateEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    function validatePassword(password) {
        return /^(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/.test(password);
    }

    loginButton.addEventListener("click", function (event) {
        event.preventDefault();

        const emailValue = emailInput.value.trim();
        const passwordValue = passwordInput.value.trim();


        fetch("http://localhost:8080/users/auth", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email: emailValue,
                password: passwordValue
            })
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`로그인 실패: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                localStorage.setItem('profileImage', data.profileImage);
                localStorage.setItem('accessToken', data.accessToken);
                localStorage.setItem('refreshToken', data.refreshToken);

                alert("로그인 성공!");
                window.location.href = "../posts/list/list.html";
            })
            .catch(error => {
                console.error("로그인 요청 중 오류 발생:", error.message);
            });
    });

});


