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
    const profileImage = document.getElementById("profile-image");
    const dropdownMenu = document.getElementById("dropdown-menu");

    if (!profileImage || !dropdownMenu) return;

    profileImage.addEventListener("click", () => {
        dropdownMenu.style.display = dropdownMenu.style.display === "block" ? "none" : "block";
    });

    document.addEventListener("click", (event) => {
        if (!event.target.closest(".profile-list")) {
            dropdownMenu.style.display = "none";
        }
    });

    const profileIcon = localStorage.getItem('profileImage') || "";
    if (profileIcon) {
        profileImage.style.backgroundImage = `url(http://localhost:8080${profileIcon})`; // 🔹 서버 URL 포함
        profileImage.style.backgroundSize = 'cover';
        profileImage.style.backgroundPosition = 'center';
        profileImage.style.width = '30px';
        profileImage.style.height = '30px';
        profileImage.style.borderRadius = '50%';
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const passwordInput = document.getElementById("password-input");
    const passwordInputCheck = document.getElementById("password-input-check");
    const changepasswordButton = document.querySelector(".changepassword-button");
    const passwordHelperText = document.querySelector(".changepassword-helper-text");
    const passwordCheckHelperText = document.querySelector(".changepassword-check-helper-text");

    function validatePassword(password) {
        const re = /^(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/;
        return re.test(password);
    }

    passwordInput.addEventListener("blur", () => {
        const passwordValue = passwordInput.value.trim();
        if (passwordValue === "") {
            passwordHelperText.textContent = "*비밀번호를 입력해주세요.";
            passwordHelperText.style.visibility = "visible";
        } else if (!validatePassword(passwordValue)) {
            passwordHelperText.textContent = "*비밀번호는 8자 이상, 20자 이하이며, 소문자, 숫자, 특수문자를 각각 최소 1개 포함해야 합니다.";
            passwordHelperText.style.visibility = "visible";
        } else {
            passwordHelperText.style.visibility = "hidden";
        }
    });

    passwordInputCheck.addEventListener("blur", () => {
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

    changepasswordButton.addEventListener("click", async () => {
        const passwordValue = passwordInput.value.trim();
        const passwordCheckValue = passwordInputCheck.value.trim();

        if (passwordValue === "") {
            passwordHelperText.textContent = "*비밀번호를 입력해주세요.";
            passwordHelperText.style.visibility = "visible";
        } else if (!validatePassword(passwordValue)) {
            passwordHelperText.textContent = "*비밀번호는 8자 이상, 20자 이하이며, 소문자, 숫자, 특수문자를 각각 최소 1개 포함해야 합니다.";
            passwordHelperText.style.visibility = "visible";
        } else if (passwordValue !== passwordCheckValue) {
            passwordCheckHelperText.textContent = "*비밀번호 확인을 한 번 더 입력해주세요.";
            passwordCheckHelperText.style.visibility = "visible";
        } else {
            try {
                const response = await fetch("http://localhost:8080/users/password", {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${localStorage.getItem("accessToken")}`
                    },
                    body: JSON.stringify({
                        password: passwordValue,
                        passwordCheck: passwordCheckValue
                    })
                });

                if (!response.ok) {
                    throw new Error("비밀번호 변경 실패");
                }

                // ✅ 성공 메시지 표시 (토스트 메시지)
                const toastMessage = document.createElement("div");
                toastMessage.textContent = "비밀번호가 변경되었습니다.";
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
                    window.location.href = "../../login/login.html";
                }, 3000);

            } catch (error) {
                alert("비밀번호 변경 중 오류가 발생했습니다.");
                console.error("비밀번호 변경 오류:", error);
            }
        }
    });


});
