document.addEventListener("DOMContentLoaded", function () {

    const emailInput = document.getElementById('email-input');
    const passwordInput = document.getElementById('password-input');
    const emailHelper = document.getElementById('email-helper');
    const passwordHelper = document.getElementById('password-helper');
    const loginButton = document.getElementById('login-button');

    loginButton.addEventListener("click", function (event) {
        event.preventDefault();

        const emailValue = emailInput.value.trim();
        const passwordValue = passwordInput.value.trim();

        if (emailValue === "" || emailValue.length < 5 || !validateEmail(emailValue)) {
            emailHelper.textContent = "*올바른 이메일 주소 형식을 입력해주세요";
            emailHelper.classList.add('visible');
        } else {
            emailHelper.classList.remove('visible');
        }

        if (passwordValue === "") {
            passwordHelper.textContent = "*비밀번호를 입력해주세요";
            passwordHelper.classList.add('visible');
        } else if (!validatePassword(passwordValue)) {
            passwordHelper.textContent = "*비밀번호는 8자 이상, 20자 이하이며, 소문자, 숫자, 특수문자를 각각 최소 1개 포함해야 합니다";
            passwordHelper.classList.add('visible');
        } else {
            passwordHelper.classList.remove('visible');
        }

        if (emailHelper.classList.contains('visible') || passwordHelper.classList.contains('visible')) {
            return;
        }

        const users = JSON.parse(localStorage.getItem('users'));
        if (users) {
            const user = users.find(user => user.email === emailValue && user.password === passwordValue);
            if (user) {
                localStorage.setItem('loggedInUser', JSON.stringify(user));

                const originalColor = loginButton.style.backgroundColor;
                loginButton.style.backgroundColor = "#7F6AEE";
                setTimeout(() => {
                    loginButton.style.backgroundColor = originalColor;
                    setTimeout(() => {
                        window.location.href = "../posts/list/list.html";
                    }, 500);
                }, 500);
            } else {
                passwordHelper.textContent = "*아이디 또는 비밀번호를 확인해주세요";
                passwordHelper.classList.add('visible');
            }
        } else {
            passwordHelper.textContent = "*사용자 데이터를 로드할 수 없습니다. 다시 시도해주세요.";
            passwordHelper.classList.add('visible');
        }
    });

    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    function validatePassword(password) {
        const re = /^(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/;
        return re.test(password);
    }
});
