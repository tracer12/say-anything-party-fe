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
    const profileImage = document.getElementById('profile-image');
    const dropdownMenu = document.getElementById('dropdown-menu');

    if (!profileImage || !dropdownMenu) {
        console.error("프로필 이미지 또는 드롭다운 메뉴를 찾을 수 없습니다.");
        return;
    }

    const profileIcon = localStorage.getItem('profileImage') || "";
    if (profileIcon) {
        profileImage.style.backgroundImage = `url(http://localhost:8080${profileIcon})`; // 🔹 서버 URL 포함
        profileImage.style.backgroundSize = 'cover';
        profileImage.style.backgroundPosition = 'center';
        profileImage.style.width = '30px';
        profileImage.style.height = '30px';
        profileImage.style.borderRadius = '50%';
    }
    else {
        profileImage.innerHTML = `<div class="default-profile"></div>`;
    }


    profileImage.addEventListener('click', () => {
        dropdownMenu.style.display = dropdownMenu.style.display === 'block' ? 'none' : 'block';
    });

    document.addEventListener('click', (event) => {
        if (!event.target.closest('.profile-list')) {
            dropdownMenu.style.display = 'none';
        }
    });
}

document.addEventListener('DOMContentLoaded', async () => {
    const selectedPostId = localStorage.getItem('selectedPostId');
    let selectedItemForDeletion = null;

    if (!selectedPostId) {
        alert("잘못된 접근입니다.");
        window.location.href = "../list/list.html";
        return;
    }

    function formattedDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleString('ko-KR', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
        });
    }

    try {
        const response = await fetch(`http://localhost:8080/posts/${selectedPostId}`);
        if (!response.ok) {
            throw new Error("게시글을 불러오는 데 실패했습니다.");
        }
        const data = await response.json();
        const post = data.post;
        const comments = data.comments;

        if (post) {
            const detailContainer = document.querySelector('.detail-container');

            const postCreateDate = formattedDate(post.createDate);

            detailContainer.innerHTML = `
                <h2 class="post-title">${post.title}</h2>
                <div class="post-meta">
                    <div class="author-info">
                        <div class="author-profile">
                            <div class="writer-profile-image" id="writer-profile-image"></div>
                        </div>
                        <p class="post-author">${post.nickname}</p>
                    </div>
                    <p class="post-date">${postCreateDate}</p>
                    <div class="post-actions">
                        <button class="post-edit-button">수정</button>
                        <button class="post-delete-button">삭제</button>
                    </div>
                </div>

                <hr class="detail-horizen">
                <img src="${post.postImage ? `http://localhost:8080${post.postImage}` : '../../sample/sampleimage/samplegray.png'}" class="post-image" alt="Post Image" />
                <p class="post-content">${post.content}</p>

                <div class="pop-actions">
                    <button class="like-button"><div>${post.likes}</div><span>좋아요수</span></button>
                    <button class="view-button"><div>${post.views}</div><span>조회수</span></button>
                    <button class="comment-button">${comments.length}<span>댓글수</span></button>
                </div>

                <hr class="detail-horizen">
                <div class="comment-input-card">
                    <textarea class="comment-input" placeholder="댓글을 남겨주세요!"></textarea>
                    <hr class="detail-horizen">
                    <button class="comment-input-button">댓글 등록</button>
                </div>

                <div class="comments-list"></div>
            `;


            // 작성자 프로필 이미지
            const writerProfileImage = document.getElementById('writer-profile-image');
            if (post.profileImage) {
                writerProfileImage.style.backgroundImage = `url(http://localhost:8080${post.profileImage})`;
                writerProfileImage.style.backgroundSize = 'cover';
                writerProfileImage.style.backgroundPosition = 'center';
                writerProfileImage.style.width = '30px';
                writerProfileImage.style.height = '30px';
                writerProfileImage.style.borderRadius = '50%';
            } else {
                writerProfileImage.innerHTML = `<div class="default-profile"></div>`;
            }


            document.querySelector('.post-edit-button').addEventListener('click', () => {
                window.location.href = '../edit/edit.html';
            });

            const postModal = document.createElement('div');
            postModal.classList.add('modal-post');
            postModal.style.display = 'none';
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

            document.querySelector('.post-delete-button').addEventListener('click', () => {
                selectedItemForDeletion = post;
                postModal.style.display = "flex";
            });

            document.querySelector('.modal-post-button-confirm').addEventListener('click', async () => {
                try {
                    const deleteResponse = await fetch(`http://localhost:8080/posts/${selectedPostId}`, {
                        method: 'DELETE',
                        headers: {
                            "Authorization": `Bearer ${localStorage.getItem("accessToken")}`
                        }
                    });

                    if (!deleteResponse.ok) {
                        throw new Error("게시글 삭제에 실패했습니다.");
                    }

                    alert("게시글이 삭제되었습니다.");
                    window.location.href = "../list/list.html";
                } catch (error) {
                    alert("해당 게시글을 삭제 할 권한이 없습니다.");
                    postModal.style.display = "none";
                }
            });

            document.querySelector('.like-button').addEventListener('click', async () => {

                try {
                    const response = await fetch(`http://localhost:8080/posts/${selectedPostId}/like`, {
                        method: "POST",
                        headers: {
                            "Authorization": `Bearer ${localStorage.getItem("accessToken")}`
                        }
                    });

                    if (!response.ok) {
                        if (response.status === 409) {
                            alert("이미 좋아요를 눌렀습니다.");
                        } else {
                            throw new Error("좋아요 처리에 실패했습니다.");
                        }
                    } else {
                        alert("좋아요를 눌렀습니다!");
                        location.reload();
                    }
                } catch (error) {
                    alert("좋아요 중 오류가 발생했습니다.");
                    console.error("좋아요 오류:", error);
                }
            });


            document.querySelector('.comment-input-button').addEventListener('click', async () => {
                const commentInput = document.querySelector('.comment-input');
                const commentContent = commentInput.value.trim();

                if (!commentContent) {
                    alert("댓글을 입력해주세요.");
                    return;
                }

                try {
                    const response = await fetch(`http://localhost:8080/posts/${selectedPostId}/comments`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${localStorage.getItem("accessToken")}`
                        },
                        body: JSON.stringify({ commentContent })
                    });

                    if (!response.ok) {
                        throw new Error("댓글 등록에 실패했습니다.");
                    }

                    alert("댓글이 등록되었습니다.");
                    commentInput.value = ''; // 입력창 초기화
                    location.reload(); // 페이지 새로고침 (댓글 목록 갱신)
                } catch (error) {
                    alert("댓글 등록 중 오류가 발생했습니다.");
                    console.error("댓글 등록 오류:", error);
                }
            });

            let selectedCommentId = null; // 댓글 수정 및 삭제 시 사용되는 공통 변수

            function updateCommentsList() {
                const commentsList = document.querySelector('.comments-list');
                commentsList.innerHTML = '';

                comments.forEach(comment => {
                    const commentElement = document.createElement('div');
                    commentElement.classList.add('comment-item');
                    commentElement.setAttribute('data-cid', comment.cid);
                    const commentCreateDate = formattedDate(comment.createDate);
                    commentElement.innerHTML = `
                        <div class="comment-header">
                            <div class="comment-author-info">
                            <img src="${comment.profileImage ? `http://localhost:8080${comment.profileImage}` : '../../sample/sampleimage/samplegray.png'}" class="comment-profile-image" alt="Comment Profile Image" />
                                <span class="comment-author-name">${comment.nickname}</span>
                                <span class="comment-date">${commentCreateDate}</span>
                            </div>
                            <div class="comment-actions">
                                <button class="comment-edit-button">수정</button>
                                <button class="comment-delete-button">삭제</button>
                            </div>
                        </div>
                        <div class="comment-body">
                            <p class="comment-content">${comment.commentContent}</p>
                        </div>
                    `;

                    commentsList.appendChild(commentElement);
                });
            }

            document.querySelector('.comments-list').addEventListener('click', async (event) => {
                const commentElement = event.target.closest('.comment-item');
                if (!commentElement) return;

                selectedCommentId = commentElement.getAttribute('data-cid');
                if (!selectedCommentId) {
                    alert("댓글 ID를 찾을 수 없습니다.");
                    return;
                }

                if (event.target.classList.contains('comment-edit-button')) {
                    const newContent = prompt("수정할 댓글을 입력하세요:");
                    if (!newContent) return;

                    try {
                        const editResponse = await fetch(`http://localhost:8080/posts/${selectedPostId}/comments/${selectedCommentId}`, {
                            method: "PATCH",
                            headers: {
                                "Content-Type": "application/json",
                                "Authorization": `Bearer ${localStorage.getItem("accessToken")}`
                            },
                            body: JSON.stringify({ commentContent: newContent })
                        });

                        if (!editResponse.ok) {
                            throw new Error("댓글 수정에 실패했습니다.");
                        }

                        alert("댓글이 수정되었습니다.");
                        location.reload(); // 페이지 새로고침 (댓글 목록 갱신)
                    } catch (error) {
                        alert("댓글 수정 권한이 없습니다");
                    }
                }

                if (event.target.classList.contains('comment-delete-button')) {
                    commentModal.style.display = "flex";
                }
            });

            const commentModal = document.createElement('div');
            commentModal.classList.add('modal-comment');
            commentModal.style.display = 'none';
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

            document.querySelector('.modal-comment-button-confirm').addEventListener('click', async () => {
                if (!selectedCommentId) {
                    alert("삭제할 댓글을 선택하세요.");
                    return;
                }

                try {
                    const deleteResponse = await fetch(`http://localhost:8080/posts/${selectedPostId}/comments/${selectedCommentId}`, {
                        method: "DELETE",
                        headers: {
                            "Authorization": `Bearer ${localStorage.getItem("accessToken")}`
                        }
                    });

                    if (!deleteResponse.ok) {
                        throw new Error("댓글 삭제에 실패했습니다.");
                    }

                    alert("댓글이 삭제되었습니다.");
                    commentModal.style.display = "none";
                    location.reload();
                } catch (error) {
                    alert("댓글 삭제 권한이 없습니다.");
                    commentModal.style.display = "none";
                }
            });

            document.querySelector('.modal-cancel-button').addEventListener('click', () => {
                commentModal.style.display = "none";
            });

            updateCommentsList();
            document.querySelectorAll('.modal-cancel-button').forEach(button => {
                button.addEventListener('click', () => {
                    postModal.style.display = "none";
                    commentModal.style.display = "none";
                });
            });

        }
    } catch (error) {
        alert("게시글을 불러오는 중 오류가 발생했습니다.");
        window.location.href = "../list/list.html";
    }
});
