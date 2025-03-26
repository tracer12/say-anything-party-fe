import { GetPostData, EditPost } from "../../utils/editUtils/EditUtils.js";

export function EditForm() {
    const state = {
        selectedPostId: localStorage.getItem("selectedPostId"),
        title: "",
        content: "",
        selectedImageFile: null,
    };

    function render() {
        if (!state.selectedPostId) {
            alert("잘못된 접근입니다.");
            window.location.href = "../pages/List.html";
            return;
        }

        const root = document.getElementById("root");
        root.innerHTML = `
            <section class="wrap">
                <div class="upload-container">
                    <article>
                        <p class="upload-page-text">게시글 수정</p>
                    </article>

                    <article>
                        <p class="title-text">제목*</p>
                        <textarea class="title-textarea" id="title-textarea"
                            placeholder="제목을 입력해주세요(최대 26글자)">${state.title}</textarea>
                    </article>

                    <article>
                        <p class="contents-text">내용*</p>
                        <textarea class="contents-textarea" id="contents-textarea"
                            placeholder="내용을 입력해주세요">${state.content}</textarea>
                    </article>

                    <article class="file-select-container">
                        <p class="image-text">이미지</p>
                        <div class="file-select-wrapper">
                            <button class="file-select-button">파일선택</button>
                            <p class="file-select-text">${state.selectedImageFile ? state.selectedImageFile.name : "파일을 선택해주세요."}</p>
                        </div>
                    </article>

                    <article class="edit-button-location">
                        <button class="edit-button">수정하기</button>
                    </article>
                </div>
            </section>
        `;

        attachEventListeners();
    }

    function attachEventListeners() {
        document.querySelector(".file-select-button").addEventListener("click", () => {
            const fileInput = document.createElement("input");
            fileInput.type = "file";
            fileInput.accept = "image/*";
            fileInput.click();

            fileInput.addEventListener("change", (event) => {
                const file = event.target.files[0];
                if (file) {
                    state.selectedImageFile = file;
                    document.querySelector(".file-select-text").textContent = file.name;
                }
            });
        });

        document.querySelector(".edit-button").addEventListener("click", async () => {
            const updatedTitle = document.getElementById("title-textarea").value.trim();
            const updatedContent = document.getElementById("contents-textarea").value.trim();

            if (!updatedTitle || !updatedContent) {
                alert("제목과 내용을 모두 입력해주세요.");
                return;
            }

            try {
                await EditPost(state.selectedPostId, updatedTitle, updatedContent, state.selectedImageFile);
                alert("게시글 수정이 완료되었습니다.");
                window.location.href = "/pages/detail.html";
            } catch (error) {
                alert("게시글 수정에 실패했습니다.");
            }
        });
    }

    async function fetchDataAndRender() {
        try {
            const data = await GetPostData(state.selectedPostId);
            state.title = data.post.title;
            state.content = data.post.content;
            render();
        } catch (error) {
            alert("게시글 정보를 불러오는 중 오류가 발생했습니다.");
            window.location.href = "../pages/list.html";
        }
    }

    fetchDataAndRender();

    return { render };
}
