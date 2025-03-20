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


document.addEventListener("DOMContentLoaded", async () => {
    const selectedPostId = localStorage.getItem("selectedPostId");
    const fileSelectButton = document.querySelector(".file-select-button");
    const fileSelectText = document.querySelector(".file-select-text");
    const editButton = document.querySelector(".edit-button");
    let selectedImageFile = null;

    if (!selectedPostId) {
        alert("잘못된 접근입니다.");
        window.location.href = "../list/list.html";
        return;
    }

    try {
        const response = await fetch(`http://localhost:8080/posts/${selectedPostId}`, {
            method: "GET",
            mode: "cors",
            credentials: "include",
        });

        if (!response.ok) {
            throw new Error("게시글 정보를 불러올 수 없습니다.");
        }

        const data = await response.json();
        document.getElementById("title-textarea").value = data.post.title;
        document.getElementById("contents-textarea").value = data.post.content;
    } catch (error) {
        console.error("게시글 불러오기 실패:", error);
        alert("게시글 정보를 불러오는 중 오류가 발생했습니다.");
        window.location.href = "../list/list.html";
    }

    // 파일 선택 버튼 클릭 시 파일 업로드 창 띄우기
    fileSelectButton.addEventListener("click", () => {
        const fileInput = document.createElement("input");
        fileInput.type = "file";
        fileInput.accept = "image/*";
        fileInput.click();

        fileInput.addEventListener("change", (event) => {
            const file = event.target.files[0];
            if (file) {
                selectedImageFile = file;
                fileSelectText.textContent = file.name;
            }
        });
    });

    editButton.addEventListener("click", async () => {
        const updatedTitle = document.getElementById("title-textarea").value.trim();
        const updatedContent = document.getElementById("contents-textarea").value.trim();

        if (updatedTitle === "" || updatedContent === "") {
            alert("제목과 내용을 모두 입력해주세요.");
            return;
        }

        const formData = new FormData();
        formData.append("title", updatedTitle);
        formData.append("content", updatedContent);
        if (selectedImageFile) {
            formData.append("postImage", selectedImageFile);
        }

        try {
            const response = await fetch(`http://localhost:8080/posts/${selectedPostId}`, {
                method: "PATCH",
                credentials: "include",
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                },
                body: formData,
            });

            if (!response.ok) {
                throw new Error(`게시글 수정 실패: ${response.status}`);
            }

            alert("게시글 수정이 완료되었습니다.");
            window.location.href = "../detail/detail.html";
        } catch (error) {
            alert("해당 게시글을 수정할 수 있는 권한이 없습니다.");
            window.location.href = "../detail/detail.html";
        }
    });


});
