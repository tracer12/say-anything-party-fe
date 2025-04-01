import { ChangePasswordUtils } from "../../utils/changePasswordUtils/ChangePasswordUtils.js";
import { HeaderForm } from "../header/HeaderForm.js";

export function ChangePasswordForm() {
    const state = {
        password: "",
        passwordCheck: ""
    };

    function render() {
            
        const header = new HeaderForm();
        header.render();

        const root = document.getElementById("root");
        root.innerHTML = `
            <section class="wrap">
                <div id="header-container"></div>

                <div class="changepassword-container">
                    <article>
                        <p class="changepassword-text">비밀번호수정</p>
                    </article>

                    <article>
                        <p class="password-text">비밀번호</p>
                        <input class="input" type="password" id="password-input" placeholder="비밀번호를 입력하세요">
                    </article>

                    <article class="helper-text">
                        <p class="password-helper-text">* helper text</p>
                    </article>

                    <article>
                        <p class="password-text">비밀번호 확인</p>
                        <input class="input" type="password" id="password-input-check" placeholder="비밀번호를 한번 더 입력하세요">
                    </article>

                    <article class="helper-text">
                        <p class="password-check-helper-text">* helper text</p>
                    </article>

                    <article class="changepassword-button-location">
                        <button class="changepassword-button">수정하기</button>
                    </article>
                </div>
            </section>
        `;

        attachEventListeners();
    }

    function attachEventListeners() {
        const passwordInput = document.getElementById("password-input");
        const passwordInputCheck = document.getElementById("password-input-check");
        const changepasswordButton = document.querySelector(".changepassword-button");

        const helperTexts = {
            password: document.querySelector('.password-helper-text'),
            passwordCheck: document.querySelector('.password-check-helper-text')
        };

        function setHelperText(element, message) {
            element.textContent = message;
            element.style.visibility = message ? "visible" : "hidden";
        }

        passwordInput.addEventListener('blur', () => {
            const password = passwordInput.value.trim();
            state.password = password;
            setHelperText(helperTexts.password,
                !password ? "*비밀번호를 입력해주세요." :
                    !validatePassword(password) ? "*비밀번호는 8~20자, 대소문자, 숫자, 특수문자 포함해야 합니다." :
                        ""
            );
        });

        passwordInputCheck.addEventListener('blur', () => {
            const passwordCheck = passwordInputCheck.value.trim();
            state.passwordCheck = passwordCheck;
            setHelperText(helperTexts.passwordCheck,
                passwordCheck !== state.password ? "*비밀번호가 일치하지 않습니다." : ""
            );
        });

        changepasswordButton.addEventListener("click", async () => {
            const accessToken = localStorage.getItem("accessToken");
            if (!state.password || !state.passwordCheck) {
                alert("비밀번호를 입력해주세요.");
                return;
            }

            try {
                await ChangePasswordUtils(state.password, state.passwordCheck, accessToken);
                showToastMessage("비밀번호가 변경되었습니다.", () => {
                    window.location.href = "../pages/login.html";
                });
            } catch (error) {
                alert("비밀번호 변경 중 오류가 발생했습니다.");
                console.error("비밀번호 변경 오류:", error);
            }
        });
    }

    function validatePassword(password) {
        const re = /^(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/;
        return re.test(password);
    }

    function showToastMessage(message, callback) {
        const toastMessage = document.createElement("div");
        toastMessage.textContent = message;
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
            if (callback) callback();
        }, 3000);
    }

    return { render };
}
