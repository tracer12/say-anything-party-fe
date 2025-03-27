import { GetPostUtils, DeletePostUtils, LikeUtils, UploadCommentUtils, EditCommentUtils, DeleteCommentUtils } from "../../utils/detailUtils/DetailUtils.js";

export function DetailForm() {
    const state = {
        post: null,
        comments: [],
        selectedPostId: localStorage.getItem("selectedPostId"),
    };

    function formattedDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleString("ko-KR", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
        });
    }

    async function fetchPostData() {
        if (!state.selectedPostId) {
            alert("잘못된 접근입니다.");
            window.location.href = "/list";
            return;
        }

        try {
            const { post, comments } = await GetPostUtils(state.selectedPostId);
            state.post = post;
            state.comments = comments;
            render();
        } catch (error) {
            alert("게시글을 불러오는 중 오류가 발생했습니다.");
        }
    }

    function render() {
        const root = document.getElementById("root");
        if (!state.post) return;
        root.innerHTML = `
            <div class="detail-container">
                <h2 class="post-title">${state.post.title}</h2>
                <div class="post-meta">
                    <div class="author-info">
                        <div class="writer-profile-image" style="
                            background-image: url('${state.post.profileImage ? `http://localhost:8080${state.post.profileImage}` : '../../sample/sampleimage/samplegray.png'}');
                            background-size: cover;
                            background-position: center;
                            width: 30px;
                            height: 30px;
                            border-radius: 50%;
                        "></div>
                        <p class="post-author">${state.post.nickname}</p>
                    </div>
                    <p class="post-date">${formattedDate(state.post.createDate)}</p>
                    <div class="post-actions">
                        <button class="post-edit-button">수정</button>
                        <button class="post-delete-button">삭제</button>
                    </div>
                </div>

                <hr class="detail-horizen">
                <img src="${state.post.postImage ? `http://localhost:8080${state.post.postImage}` : '../../sample/sampleimage/samplegray.png'}" class="post-image" alt="Post Image" />
                <p class="post-content">${state.post.content}</p>

                <div class="pop-actions">
                    <button class="like-button"><div>${state.post.likes}</div><span>좋아요수</span></button>
                    <button class="view-button"><div>${state.post.views}</div><span>조회수</span></button>
                    <button class="comment-button">${state.comments.length}<span>댓글수</span></button>
                </div>

                <hr class="detail-horizen">
                <div class="comment-input-card">
                    <textarea class="comment-input" placeholder="댓글을 남겨주세요!"></textarea>
                    <hr class="detail-horizen">
                    <button class="comment-input-button">댓글 등록</button>
                </div>

                <div class="comments-list">${renderComments()}</div>
            </div>
        `;

        attachEventListeners();
    }

    function renderComments() {
        return state.comments
            .map(
                (comment) => `
            <div class="comment-item" data-cid="${comment.cid}">
                <div class="comment-header">
                    <div class="comment-author-info">
                        <img src="${comment.profileImage ? `http://localhost:8080${comment.profileImage}` : '../../sample/sampleimage/samplegray.png'}" class="comment-profile-image" alt="Comment Profile Image" />
                        <span class="comment-author-name">${comment.nickname}</span>
                        <span class="comment-date">${formattedDate(comment.createDate)}</span>
                    </div>
                    <div class="comment-actions">
                        <button class="comment-edit-button">수정</button>
                        <button class="comment-delete-button">삭제</button>
                    </div>
                </div>
                <div class="comment-body">
                    <p class="comment-content">${comment.commentContent}</p>
                </div>
            </div>
        `
            )
            .join("");
    }

    function attachEventListeners() {
        document.querySelector(".post-edit-button").addEventListener("click", () => {
            window.location.href = "../pages/edit.html";
        });

        document.querySelector(".post-delete-button").addEventListener("click", () => {
            showPostDeleteModal();
        });

        document.querySelector(".like-button").addEventListener("click", async () => {
            await LikeUtils(state.selectedPostId);
            fetchPostData();
        });

        document.querySelector(".comment-input-button").addEventListener("click", async () => {
            const commentInput = document.querySelector(".comment-input");
            const commentContent = commentInput.value.trim();
            if (!commentContent) {
                alert("댓글을 입력해주세요.");
                return;
            }

            try {
                await UploadCommentUtils(state.selectedPostId, commentContent);
                alert("댓글이 등록되었습니다.");
                fetchPostData();
            } catch (error) {
                alert("댓글 등록에 실패했습니다.");
            }
        });

        document.querySelector(".comments-list").addEventListener("click", async (event) => {
            const commentElement = event.target.closest(".comment-item");
            if (!commentElement) return;

            const selectedCommentId = commentElement.getAttribute("data-cid");

            if (event.target.classList.contains("comment-edit-button")) {
                const newContent = prompt("수정할 댓글을 입력하세요:");
                if (!newContent) return;

                try {
                    await EditCommentUtils(state.selectedPostId, selectedCommentId, newContent);
                    alert("댓글이 수정되었습니다.");
                    fetchPostData();
                } catch (error) {
                    alert("댓글 수정 권한이 없습니다.");
                }
            }

            if (event.target.classList.contains("comment-delete-button")) {
                showCommentDeleteModal(selectedCommentId);
            }
        });
    }

    function showPostDeleteModal() {
        const detailContainer = document.querySelector(".detail-container");
        const postModal = document.createElement("div");
        postModal.classList.add("modal-post");
        postModal.innerHTML = `
            <div class="modal">
                <div class="modal-content">
                    <p class="modal-delete-text">게시글을 삭제하시겠습니까?</p>
                    <p>삭제한 내용은 복구할 수 없습니다.</p>
                    <button class="modal-cancel-button">취소</button>
                    <button class="modal-post-button-confirm">확인</button>
                </div>
            </div>
        `;
        detailContainer.appendChild(postModal);

        postModal.querySelector(".modal-cancel-button").addEventListener("click", () => {
            postModal.remove();
        });

        postModal.querySelector(".modal-post-button-confirm").addEventListener("click", async () => {
            try {
                await DeletePostUtils(state.selectedPostId);
                alert("게시글이 삭제되었습니다.");
                window.location.href = "/list";
            } catch (error) {
                alert("해당 게시글을 삭제할 권한이 없습니다.");
            } finally {
                postModal.remove();
            }
        });
    }

    function showCommentDeleteModal(commentId) {
        const detailContainer = document.querySelector(".detail-container");
        const commentModal = document.createElement("div");
        commentModal.classList.add("modal-comment");
        commentModal.innerHTML = `
            <div class="modal">
                <div class="modal-content">
                    <p class="modal-comment-delete-text">댓글을 삭제하시겠습니까?</p>
                    <p>삭제한 내용은 복구할 수 없습니다.</p>
                    <button class="modal-cancel-button">취소</button>
                    <button class="modal-comment-button-confirm">확인</button>
                </div>
            </div>
        `;
        detailContainer.appendChild(commentModal);

        commentModal.querySelector(".modal-cancel-button").addEventListener("click", () => {
            commentModal.remove();
        });

        commentModal.querySelector(".modal-comment-button-confirm").addEventListener("click", async () => {
            await DeleteCommentUtils(state.selectedPostId, commentId);
            fetchPostData();
            commentModal.remove();
        });
    }

    return { fetchPostData, render };
}
