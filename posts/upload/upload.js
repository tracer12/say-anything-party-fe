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

    const titleTextarea = document.getElementById("title-textarea");
    const contentsTextarea = document.getElementById("contents-textarea");
    const uploadButton = document.querySelector(".upload-button");
    const fileSelectButton = document.querySelector(".file-select-button");
    const fileSelectText = document.querySelector(".file-select-text");

    let selectedImageFile = null; // ✅ 선택한 파일 저장

    // 파일 선택 버튼 클릭 시 파일 업로드 창 띄우기
    fileSelectButton.addEventListener("click", () => {
        const fileInput = document.createElement("input");
        fileInput.type = "file";
        fileInput.accept = "image/*";
        fileInput.click();

        fileInput.addEventListener("change", (event) => {
            const file = event.target.files[0];
            if (file) {
                selectedImageFile = file; // ✅ 선택한 파일 저장
                fileSelectText.textContent = file.name;
            }
        });
    });

    uploadButton.addEventListener("click", async () => {
        const title = titleTextarea.value.trim();
        const content = contentsTextarea.value.trim();
        const accessToken = localStorage.getItem("accessToken");
        if (!title || !content) {
            alert("제목과 내용을 입력해주세요.");
            return;
        }

        if (!accessToken) {
            alert("로그인이 필요합니다.");
            window.location.href = "../login/login.html";
            return;
        }

        const formData = new FormData();
        formData.append("title", title);
        formData.append("content", content);
        if (selectedImageFile) {
            formData.append("postImage", selectedImageFile); // ✅ 선택한 파일 추가
        }

        try {
            const response = await fetch("http://localhost:8080/posts", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${accessToken}`, // ✅ 토큰 추가
                },
                body: formData, // ✅ JSON이 아닌 form-data로 전송
            });

            if (!response.ok) {
                throw new Error(`게시글 작성 실패: ${response.status}`);
            }

            const data = await response.json();
            console.log("게시글 작성 성공:", data);
            alert("게시글이 성공적으로 작성되었습니다!");
            window.location.href = "../list/list.html"; // ✅ 업로드 후 목록 페이지로 이동
        } catch (error) {
            console.error("게시글 작성 중 오류 발생:", error.message);
            alert("게시글 작성에 실패했습니다. 다시 시도해주세요.");
        }

        titleTextarea.value = "";
        contentsTextarea.value = "";
        fileSelectText.textContent = "파일을 선택해주세요.";
        selectedImageFile = null;
    });

});
