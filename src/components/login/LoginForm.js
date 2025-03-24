export function LoginForm() {
    const state = {
        email: "",
        password: "",
        emailHelper: "",
        passwordHelper: "",
    };

    function setState(newState) {
        Object.assign(state, newState);
        render();
    }

    function validateEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    function validatePassword(password) {
        return /^(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/.test(password);
    }

    function setHelperText(element, message) {
        element.textContent = message;
        element.style.visibility = message ? "visible" : "hidden";
    }

    function InputField(label, type, id, placeholder, helperText) {
        return `
            <div class="input-container">
                <p class="input-label">${label}</p>
                <input class="input" type="${type}" id="${id}-input" placeholder="${placeholder}" />
                <p class="helper-text ${id}-helper-text" id="${id}-helper">${helperText}</p>
            </div>
        `;
    }

    function render() {
        const root = document.getElementById("root");
        root.innerHTML = `
            <div class="login-container">
                <p class="login-text">로그인</p>
                ${InputField("이메일", "text", "email", "이메일을 입력하세요", state.emailHelper)}
                ${InputField("비밀번호", "password", "password", "비밀번호를 입력하세요", state.passwordHelper)}
                <button class="login-button" id="login-button">로그인</button>
                <a href="../signup/signup.html">
                    <p class="signup-text">회원가입</p>
                </a>
            </div>
        `;
        attachEventListeners();
    }

    function attachEventListeners() {
        const emailInput = document.getElementById("email-input");
        const passwordInput = document.getElementById("password-input");
        const loginButton = document.getElementById("login-button");

        const helperTexts = {
            email: document.querySelector('.email-helper-text'),
            password: document.querySelector('.password-helper-text'),
        };

        emailInput.addEventListener("blur", () => {
            const email = emailInput.value.trim();
            const message = !email
                ? "*이메일을 입력해주세요"
                : !validateEmail(email)
                    ? "*올바른 이메일 형식을 입력하세요."
                    : "";
            setHelperText(helperTexts.email, message);
        });

        passwordInput.addEventListener("blur", () => {
            const password = passwordInput.value.trim();
            const message = !password
                ? "*비밀번호를 입력해주세요."
                : !validatePassword(password)
                    ? "*비밀번호는 8~20자, 대소문자, 숫자, 특수문자 포함해야 합니다."
                    : "";
            setHelperText(helperTexts.password, message);
        });

        loginButton.addEventListener("click", (event) => {
            event.preventDefault();
            fetch("http://localhost:8080/users/auth", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: emailInput.value,
                    password: passwordInput.value,
                }),
            })
                .then((response) => {
                    if (!response.ok) {
                        throw new Error(`로그인 실패: ${response.status}`);
                    }
                    return response.json();
                })
                .then((data) => {
                    localStorage.setItem("profileImage", data.profileImage);
                    localStorage.setItem("accessToken", data.accessToken);
                    localStorage.setItem("refreshToken", data.refreshToken);

                    alert("로그인 성공!");
                    window.location.href = "../posts/list/list.html";
                })
                .catch((error) => {
                    console.error("로그인 요청 중 오류 발생:", error.message);
                });
        });
    }

    return { render };
}
