document.addEventListener("DOMContentLoaded", () => {
    fetch("../../header/header.html")
        .then(response => response.text())
        .then(data => {
            document.getElementById("header-container").innerHTML = data;
            setupProfileDropdown();
        })
        .catch(error => console.error("헤더 로드 실패:", error));
});

if (!document.querySelector("link[href*='header.css']")) {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "../../header/header.css";
    document.head.appendChild(link);
}

function setupProfileDropdown() {
    const profileIcon = document.getElementById("profile-icon");
    const dropdownMenu = document.getElementById("dropdown-menu");

    if (!profileIcon || !dropdownMenu) return;


    const profileImageUrl = localStorage.getItem('profileImage') || "";
    if (profileImageUrl) {
        profileIcon.style.backgroundImage = `url(http://localhost:8080${profileImageUrl})`;
        profileIcon.style.backgroundSize = 'cover';
        profileIcon.style.backgroundPosition = 'center';
        profileIcon.style.width = '30px';
        profileIcon.style.height = '30px';
        profileIcon.style.borderRadius = '50%';
    }
    else {
        profileIcon.innerHTML = `<div class="default-profile"></div>`;
    }


    profileIcon.addEventListener("click", () => {
        dropdownMenu.style.display = dropdownMenu.style.display === "block" ? "none" : "block";
    });

    document.addEventListener("click", (event) => {
        if (!event.target.closest(".profile-list")) {
            dropdownMenu.style.display = "none";
        }
    });
}

document.addEventListener("DOMContentLoaded", async function () {
    const nicknameInput = document.getElementById("nickname-input");
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
        alert("로그인이 필요합니다.");
        window.location.href = "/login/login.html";
        return;
    }
    try {
        const response = await fetch("http://localhost:8080/users", {
            method: "GET",
            headers: {
                "Accept": "application/json",
                "Authorization": `Bearer ${accessToken}`
            }
        });

        if (!response.ok) {
            throw new Error("사용자 정보를 가져오는 데 실패했습니다.");
        }
        const userData = await response.json();

        document.getElementById("nickname-input").value = userData.nickname;

        displayEmail(userData.email);

    } catch (error) {
        console.error("사용자 정보 요청 중 오류 발생:", error.message);
    }

    function displayEmail(email) {
        const emailText = document.getElementById("email-text");
        if (emailText) {
            emailText.textContent = email;
        } else {
            console.error("❌ 'email-text' 요소를 찾을 수 없습니다.");
        }
    }

});

document.addEventListener("DOMContentLoaded", () => {

    const nicknameInput = document.getElementById("nickname-input");
    const changeProfileButton = document.querySelector(".changeprofile-button");
    const profileUploader = document.querySelector(".profile-uploader");
    const deleteProfileButton = document.querySelector(".deleteprofile-button");
    const modal = document.querySelector(".modal");
    const cancelButton = document.querySelector("#cancelButton");
    const confirmButton = document.querySelector("#confirmButton");
    let profileImageFile = null;

    const helperTexts = {
        nickname: document.querySelector('.nickname-helper-text'),
    };

    function setHelperText(element, message) {
        element.textContent = message;
        element.style.visibility = message ? "visible" : "hidden";
    }

    nicknameInput.addEventListener('blur', () => {
        const nickname = nicknameInput.value.trim();
        setHelperText(helperTexts.nickname,
            !nickname ? "*닉네임을 입력해주세요." :
                nickname.length > 10 ? "*닉네임은 최대 10자까지 가능합니다." :
                    nickname.includes(" ") ? "*띄어쓰기를 없애주세요." : ""
        );
        helperTexts.nickname.style.height = "16px";
    });

    const profileImageUrl = localStorage.getItem('profileImage') || "";

    profileUploader.style.backgroundImage = `url(http://localhost:8080${profileImageUrl})`;
    profileUploader.style.backgroundSize = '160px 160px';  // 🔹 크기 160px로 조정
    profileUploader.style.backgroundPosition = 'center';
    profileUploader.style.backgroundRepeat = 'no-repeat';
    profileUploader.style.width = '160px';  // 🔹 너비 160px로 설정
    profileUploader.style.height = '160px'; // 🔹 높이 160px로 설정
    profileUploader.style.borderRadius = '50%';  // 🔹 원형으로 설정   


    profileUploader.addEventListener("click", () => {

        const fileInput = document.createElement("input");
        fileInput.type = "file";
        fileInput.accept = "image/*";
        fileInput.click();

        fileInput.addEventListener("change", (e) => {
            const file = e.target.files[0];
            if (file) {
                profileImageFile = file; // ✅ 파일 저장
                const reader = new FileReader();
                reader.onload = function (e) {
                    const img = new Image();
                    img.onload = function () {
                        const canvas = document.createElement("canvas");
                        const ctx = canvas.getContext("2d");
                        const size = 160;
                        canvas.width = size;
                        canvas.height = size;
                        ctx.drawImage(img, 0, 0, size, size);
                        profileUploader.style.backgroundImage = `url(${canvas.toDataURL()})`;
                    };
                    img.src = e.target.result;
                };
                reader.readAsDataURL(file);
            }
        });
    }); 4




    changeProfileButton.addEventListener("click", async () => {
        const nicknameValue = nicknameInput.value.trim();
        const formData = new FormData();
        formData.append("nickname", nicknameValue);

        if (profileImageFile) {
            formData.append("profile_image", profileImageFile);
        }

        try {
            const response = await fetch(`http://localhost:8080/users/profile`, {
                method: "PATCH",
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("accessToken")}`
                },
                body: formData
            });

            const data = await response.json();
            localStorage.setItem('profileImage', data.profileImage);

            if (!response.ok) {
                throw new Error("프로필 변경에 실패했습니다.");
            }


            alert("프로필이 성공적으로 변경되었습니다.");
            window.location.href = "../../posts/list/list.html";
        } catch (error) {
            alert("프로필 변경 중 오류가 발생했습니다.");
            console.error("프로필 변경 오류:", error);
        }
    });

    deleteProfileButton.addEventListener("click", () => {
        modal.style.display = "flex";
    });

    cancelButton.addEventListener("click", () => {
        modal.style.display = "none";
    });

    window.addEventListener("click", (e) => {
        if (e.target === modal) {
            modal.style.display = "none";
        }
    });

    confirmButton.addEventListener("click", async () => {
        try {
            const response = await fetch(`http://localhost:8080/users`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("accessToken")}`
                }
            });

            if (!response.ok) {
                throw new Error("회원 탈퇴에 실패했습니다.");
            }

            alert("회원 탈퇴가 완료되었습니다.");
            window.location.href = "../../../login/login.html";
        } catch (error) {
            alert("회원 탈퇴 중 오류가 발생했습니다.");
            console.error("회원 탈퇴 오류:", error);
        }
    });

});
