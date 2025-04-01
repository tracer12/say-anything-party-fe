import { PasswordValidator } from "../../utils/validatorUtils/passwordValidatorUtils/PasswordValidatorUtils.js";
import { EmailValidator } from "../../utils/validatorUtils/emailValidatorUtils/EmailValidatorUtils.js";
import { SignupUtils } from "../../utils/signupUtils/SignupUtils.js";
import { navigateTo } from "../../../index.js";

export function SignupForm() {
    const state = {
        email: "",
        password: "",
        passwordCheck: "",
        nickname: "",
        emailHelper: "",
        passwordHelper: "",
        passwordCheckHelper: "",
        nicknameHelper: "",
        selectedImageFile: null,
    };


    function InputField(label, type, id, placeholder, helperText) {
        return `
            <div class="input-container">
                <p class="input-label">${label}</p>
                <input class="input" type="${type}" id="${id}-input" placeholder="${placeholder}" />
                <p class="helper-text ${id}-helper-text">${helperText}</p>
            </div>
        `;
    }

    function render() {
        const root = document.getElementById("root");
        root.innerHTML = `
            <div class="signup-container">
            <p class="signup-page-signup-text">회원가입</p>
            <div class = "upload-profile">
                <div class="profile-icon"></div>
            </div>
            ${InputField("이메일", "text", "email", "이메일을 입력하세요", state.emailHelper)}
            ${InputField("비밀번호", "password", "password", "비밀번호를 입력하세요", state.passwordHelper)}
            ${InputField("비밀번호 확인", "password", "passwordCheck", "비밀번호를 다시 입력하세요", state.passwordCheckHelper)}
            ${InputField("닉네임", "text", "nickname", "닉네임을 입력하세요", state.nicknameHelper)}
            <button class="signup-button" id="signup-button" disabled>회원가입</button>
            <a href="../login/login.html">
                <p class="signup-page-login-text">로그인</p>
            </a>
        </div>
        `;
        attachEventListeners();
    }

    function attachEventListeners() {
        const emailInput = document.getElementById("email-input");
        const passwordInput = document.getElementById("password-input");
        const passwordInputCheck = document.getElementById("passwordCheck-input");
        const nicknameInput = document.getElementById("nickname-input");
        const profileIcon = document.querySelector(".profile-icon");
        const signupButton = document.getElementById("signup-button");
        let selectedImageFile = null;

        const helperTexts = {
            email: document.querySelector(".email-helper-text"),
            password: document.querySelector(".password-helper-text"),
            passwordCheck: document.querySelector(".passwordCheck-helper-text"),
            nickname: document.querySelector(".nickname-helper-text"),
        };

        function setHelperText(element, message) {
            element.textContent = message;
            element.style.visibility = message ? "visible" : "hidden";
        }

        emailInput.addEventListener("blur", () => {
            const email = emailInput.value.trim();
            const message = !email
                ? "*이메일을 입력해주세요"
                : !EmailValidator(email)
                    ? "*올바른 이메일 형식을 입력하세요."
                    : "";
            setHelperText(helperTexts.email, message);
        });

        passwordInput.addEventListener("blur", () => {
            const password = passwordInput.value.trim();
            const message = !password
                ? "*비밀번호를 입력해주세요."
                : !PasswordValidator(password)
                    ? "*비밀번호는 8~20자, 대소문자, 숫자, 특수문자 포함해야 합니다."
                    : "";
            setHelperText(helperTexts.password, message);
        });

        passwordInputCheck.addEventListener("blur", () => {
            const message = passwordInputCheck.value !== passwordInput.value ? "*비밀번호가 일치하지 않습니다." : "";
            setHelperText(helperTexts.passwordCheck, message);
        });

        nicknameInput.addEventListener("blur", () => {
            const nickname = nicknameInput.value.trim();
            const message = !nickname
                ? "*닉네임을 입력해주세요."
                : nickname.length > 10
                    ? "*닉네임은 최대 10자까지 가능합니다."
                    : nickname.includes(" ")
                        ? "*띄어쓰기를 없애주세요."
                        : "";
            setHelperText(helperTexts.nickname, message);
        });

        profileIcon.addEventListener('click', () => {
            const fileInput = document.createElement('input');
            fileInput.type = 'file';
            fileInput.accept = 'image/*';
            fileInput.click();

            fileInput.addEventListener('change', (e) => {

                const file = e.target.files[0];
                if (file) {
                    selectedImageFile = file;

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
                EmailValidator(emailInput.value) &&
                PasswordValidator(passwordInput.value) &&
                passwordInput.value === passwordInputCheck.value &&
                nicknameInput.value.trim().length > 0
            );
        }

        [emailInput, passwordInput, passwordInputCheck, nicknameInput].forEach((input) =>
            input.addEventListener("input", toggleSignupButton)
        );

        signupButton.addEventListener("click", async () => {
            const formData = new FormData();
            formData.append("email", emailInput.value);
            formData.append("password", passwordInput.value);
            formData.append("passwordCheck", passwordInputCheck.value);
            formData.append("nickname", nicknameInput.value);

            if (selectedImageFile) {
                formData.append("profile_image", selectedImageFile);
            } else {
                console.log("🚨 선택한 프로필 이미지 없음");
            }
            SignupUtils(formData);
        });
    }

    return { render };
}
