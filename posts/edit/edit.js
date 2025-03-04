document.addEventListener("DOMContentLoaded", () => {
    fetch("../../header/header.html")
        .then(response => response.text())
        .then(data => {
            document.getElementById("header-container").innerHTML = data;
            setupProfileDropdown();
        })
        .catch(error => console.error("헤더 로드 실패:", error));

    if (!document.querySelector("link[href*='header.css']")) {
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = "../../header/header.css";
        document.head.appendChild(link);
    }

    const selectedPostId = localStorage.getItem("selectedPostId");
    const posts = JSON.parse(localStorage.getItem("posts")) || [];
    const fileSelectButton = document.querySelector(".file-select-button");
    const fileSelectText = document.querySelector(".file-select-text");
    const editButton = document.querySelector(".edit-button"); // 수정 버튼
    const post = posts.find(post => post.id == selectedPostId);
    const loginUser = JSON.parse(localStorage.getItem("loggedInUser")) || {};
    let selectedImageData = null;

    if (post) { // 기존 제목과 내용 가져오기
        document.getElementById("title-textarea").value = post.title;
        document.getElementById("contents-textarea").value = post.content;
    }


    fileSelectButton.addEventListener("click", () => {
        const fileInput = document.createElement("input");
        fileInput.type = "file";
        fileInput.accept = "image/*";
        fileInput.click();

        fileInput.addEventListener("change", (event) => {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function (e) {
                    selectedImageData = e.target.result;
                    fileSelectText.textContent = file.name;
                };
                reader.readAsDataURL(file);
            }
        });
    });

    editButton.addEventListener("click", () => {
        const updatedTitle = document.getElementById("title-textarea").value.trim();
        const updatedContent = document.getElementById("contents-textarea").value.trim();

        if (updatedTitle === "" || updatedContent === "") {
            alert("제목과 내용을 모두 입력해주세요.");
            return;
        }

        if (post) {
            post.title = updatedTitle;
            post.content = updatedContent;
            post.image = selectedImageData || post.image;

            localStorage.setItem("posts", JSON.stringify(posts));

            alert("게시글 수정이 완료되었습니다.");

            // 게시글 수정 API 요청 (fetch)
            /*
            fetch(`https://example.com/api/posts/${selectedPostId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("accessToken")}`
                },
                body: JSON.stringify({
                    title: updatedTitle,
                    content: updatedContent,
                    image: selectedImageData || post.image
                })
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`게시글 수정 실패: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                console.log("게시글 수정 성공:", data);
            })
            .catch(error => {
                console.error("게시글 수정 중 오류 발생:", error.message);
            });
            */

            window.location.href = "../detail/detail.html";
        }
    });
});
