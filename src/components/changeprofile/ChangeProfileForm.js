import { GetUserInfoUtils, ChangeProfileUtils, DeleteUserUtils } from "../../utils/changeProfileUtils/ChangeProfileUtils.js";
import { HeaderForm } from "../header/HeaderForm.js";

export function ChangeProfileForm() {
    const state = {
        profileImageFile: null,
        nickname: "",
        email: "",
    };

    async function render() {
        const accessToken = localStorage.getItem("accessToken");
        if (!accessToken) {
            alert("로그인이 필요합니다.");
            window.location.href = "/login";
            return;
        }

        try {
            const userData = await GetUserInfoUtils(accessToken);
            state.nickname = userData.nickname;
            state.email = userData.email;
        } catch (error) {
            console.error("사용자 정보 요청 중 오류 발생:", error.message);
            return;
        }

                
        const header = new HeaderForm();
        header.render();

        const root = document.getElementById("root");
        root.innerHTML = `
            <section class="wrap">
                <div id="header-container"></div>

                <div class="changeprofile-container">
                    <article><p class="changeprofile-text">회원정보수정</p></article>

                    <article><p class="profile-text">프로필 사진*</p></article>

                    <article class="upload-profile">
                        <div class="profile-uploader" id="profile-uploader"></div>
                    </article>

                    <article>
                        <p class="email-text">이메일*</p>
                        <p id="email-text">${state.email}</p>
                    </article>

                    <article>
                        <p class="nickname-text">닉네임</p>
                        <input class="input" type="text" id="nickname-input" value="${state.nickname}" placeholder="닉네임을 입력하세요">
                    </article>

                    <article class="helper-text">
                        <p class="nickname-helper-text">* helper text</p>
                    </article>

                    <article class="changeprofile-button-location">
                        <button class="changeprofile-button">수정하기</button>
                    </article>

                    <article>
                        <div class="deleteprofile-button-location">
                            <button class="deleteprofile-button">회원 탈퇴</button>
                        </div>
                    </article>
                </div>
            </section>
        `;

        attachEventListeners();
        setProfileImage();
    }

    function attachEventListeners() {
        const nicknameInput = document.getElementById("nickname-input");
        const changeProfileButton = document.querySelector(".changeprofile-button");
        const profileUploader = document.getElementById("profile-uploader");
        const deleteProfileButton = document.querySelector(".deleteprofile-button");

        nicknameInput.addEventListener("blur", () => {
            const helperText = document.querySelector(".nickname-helper-text");
            const nickname = nicknameInput.value.trim();
            helperText.textContent =
                !nickname ? "*닉네임을 입력해주세요." :
                    nickname.length > 10 ? "*닉네임은 최대 10자까지 가능합니다." :
                        nickname.includes(" ") ? "*띄어쓰기를 없애주세요." : "";
            helperText.style.visibility = helperText.textContent ? "visible" : "hidden";
        });

        profileUploader.addEventListener("click", () => {
            const fileInput = document.createElement("input");
            fileInput.type = "file";
            fileInput.accept = "image/*";
            fileInput.click();

            fileInput.addEventListener("change", (e) => {
                const file = e.target.files[0];
                if (file) {
                    state.profileImageFile = file;
                    const reader = new FileReader();
                    reader.onload = function (e) {
                        profileUploader.style.backgroundImage = `url(${e.target.result})`;
                    };
                    reader.readAsDataURL(file);
                }
            });
        });

        changeProfileButton.addEventListener("click", async () => {
            const nicknameValue = nicknameInput.value.trim();
            const formData = new FormData();
            formData.append("nickname", nicknameValue);
            const accessToken = localStorage.getItem("accessToken");

            if (state.profileImageFile) {
                formData.append("profile_image", state.profileImageFile);
            }
            await ChangeProfileUtils(formData, accessToken);
        });

        deleteProfileButton.addEventListener("click", showDeleteUserModal);
    }

    function showDeleteUserModal() {
        const changeProfileContainer = document.querySelector(".changeprofile-container");
        const modal = document.createElement("div");
        modal.classList.add("modal");
        modal.innerHTML = `
            <div class="modal-content">
                <p class="modal-delete-text">회원 탈퇴 하시겠습니까?</p>
                <p>작성된 게시글과 댓글은 삭제됩니다.</p>
                <button class="modal-cancel-button">취소</button>
                <button class="modal-confirm-button">확인</button>
            </div>
        `;

        changeProfileContainer.appendChild(modal);

        modal.querySelector(".modal-cancel-button").addEventListener("click", () => {
            modal.remove();
        });

        modal.querySelector(".modal-confirm-button").addEventListener("click", async () => {
            try {
                const accessToken = localStorage.getItem("accessToken");
                await DeleteUserUtils(accessToken);
                alert("회원 탈퇴가 완료되었습니다.");
                localStorage.clear();
                window.location.href = "/";
            } catch (error) {
                alert("회원 탈퇴 중 오류가 발생했습니다.");
            } finally {
                modal.remove();
            }
        });

        modal.addEventListener("click", (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
    }

    function setProfileImage() {
        const profileUploader = document.getElementById("profile-uploader");
        const profileImageUrl = localStorage.getItem("profileImage") || "";

        profileUploader.style.backgroundImage = `url(http://localhost:8080${profileImageUrl})`;
        profileUploader.style.backgroundSize = "cover";
        profileUploader.style.backgroundPosition = "center";
        profileUploader.style.width = "160px";
        profileUploader.style.height = "160px";
        profileUploader.style.borderRadius = "50%";
    }

    return { render };
}
