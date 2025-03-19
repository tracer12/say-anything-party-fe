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

        // 이메일 검사
        if (emailValue === "" || emailValue.length < 5 || !validateEmail(emailValue)) {
            emailHelper.textContent = "*올바른 이메일 주소 형식을 입력해주세요";
            emailHelper.style.display = 'block'; // helper text 표시
        } else {
            emailHelper.style.display = 'none'; // helper text 숨기기
        }

        // 비밀번호 검사
        if (passwordValue === "") {
            passwordHelper.textContent = "*비밀번호를 입력해주세요";
            passwordHelper.style.display = 'block'; // helper text 표시
        } else if (!validatePassword(passwordValue)) {
            passwordHelper.textContent = "*비밀번호는 8자 이상, 20자 이하이며, 소문자, 숫자, 특수문자를 각각 최소 1개 포함해야 합니다";
            passwordHelper.style.display = 'block'; // helper text 표시
        } else {
            passwordHelper.style.display = 'none'; // helper text 숨기기
        }

        // 유효성 검사가 실패하면 종료
        if (emailHelper.style.display === 'block' || passwordHelper.style.display === 'block') {
            return;
        }

        // ✅ 로그인 요청 API (fetch 활성화)
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
                passwordHelper.textContent = "*아이디 또는 비밀번호를 확인해주세요";
                passwordHelper.style.display = 'block'; // helper text 표시
            });
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
