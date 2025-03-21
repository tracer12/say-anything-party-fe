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

document.addEventListener("DOMContentLoaded", () => {
    const passwordInput = document.getElementById("password-input");
    const passwordInputCheck = document.getElementById("password-input-check");
    const changepasswordButton = document.querySelector(".changepassword-button");

    const helperTexts = {
        password: document.querySelector('.password-helper-text'),
        passwordCheck: document.querySelector('.password-check-helper-text'),
    };

    function setHelperText(element, message) {
        element.textContent = message;
        element.style.visibility = message ? "visible" : "hidden";
    }

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

    function validatePassword(password) {
        const re = /^(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/;
        return re.test(password);
    }


    changepasswordButton.addEventListener("click", async () => {
        const passwordValue = passwordInput.value.trim();
        const passwordCheckValue = passwordInputCheck.value.trim(); {
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
