import { UploadUtils } from "../../utils/uploadUtils/UploadUtils.js";

export function UploadForm() {
    let selectedImageFile = null;

    function render() {
        const root = document.getElementById("root");
        if (!root) return;

        root.innerHTML = `
            <section class="wrap">
                <div id="header-container"></div>

                <div class="upload-container">
                    <article>
                        <p class="upload-page-text">게시글 작성</p>
                    </article>

                    <article>
                        <p class="title-text">제목*</p>
                        <textarea class="title-textarea" id="title-textarea" placeholder="제목을 입력해주세요(최대 26글자)"></textarea>
                    </article>

                    <article>
                        <p class="contents-text">내용*</p>
                        <textarea class="contents-textarea" id="contents-textarea" placeholder="내용을 입력해주세요"></textarea>
                    </article>

                    <article class="file-select-container">
                        <p class="image-text">이미지</p>
                        <div class="file-select-wrapper">
                            <button class="file-select-button">파일선택</button>
                            <p class="file-select-text">파일을 선택해주세요.</p>
                        </div>
                    </article>

                    <article class="upload-button-location">
                        <button class="upload-button">완료</button>
                    </article>
                </div>
            </section>
        `;

        //loadHeader();
        setupEventListeners();
    }


    function setupEventListeners() {
        const titleTextarea = document.getElementById("title-textarea");
        const contentsTextarea = document.getElementById("contents-textarea");
        const uploadButton = document.querySelector(".upload-button");
        const fileSelectButton = document.querySelector(".file-select-button");
        const fileSelectText = document.querySelector(".file-select-text");

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
                window.location.href = "/login/login.html";
                return;
            }

            const formData = new FormData();
            formData.append("title", title);
            formData.append("content", content);
            if (selectedImageFile) {
                formData.append("postImage", selectedImageFile);
            }
            UploadUtils(formData, accessToken);
            resetForm(titleTextarea, contentsTextarea, fileSelectText);
        });
    }

    function resetForm(titleTextarea, contentsTextarea, fileSelectText) {
        titleTextarea.value = "";
        contentsTextarea.value = "";
        fileSelectText.textContent = "파일을 선택해주세요.";
        selectedImageFile = null;
    }

    return { render };
}
