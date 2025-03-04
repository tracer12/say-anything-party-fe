document.addEventListener('DOMContentLoaded', () => {
    const selectedPostId = localStorage.getItem('selectedPostId');
    const selectedPostWriterId = localStorage.getItem('selectedPostWriterId');
    const dropdownMenu = document.getElementById('dropdown-menu');
    const posts = JSON.parse(localStorage.getItem('posts')) || [];
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const loginUser = JSON.parse(localStorage.getItem('loggedInUser')) || [];

    const post = posts.find(post => post.id == selectedPostId);
    const writer = users.find(user => user.id == selectedPostWriterId);
    let selectedItemForDeletion = null;

    if (post && writer) { // 댓글 입력창 까지 내용
        const detailContainer = document.querySelector('.detail-container');

        detailContainer.innerHTML = `
            <h2 class="post-title">${post.title}</h2>
            <div class="post-meta">
                <div class="author-info">
                    <div class="author-profile">
                        <div class="writer-profile-image" id="writer-profile-image"></div>
                    </div>
                    <p class="post-author">${writer.nickname}</p>
                </div>
                <p class="post-date">${post.date}</p>
                <div class="post-actions">
                    <button class="post-edit-button">수정</button>
                    <button class="post-delete-button">삭제</button>
                </div>
            </div>

            <hr class="detail-horizen">
            <img src="${post.image ? post.image : '../../sample/sampleimage/samplegray.png'}" class="post-image" alt="Post Image" />

            <p class="post-content">${post.content}</p>

            <div class="pop-actions">
                <button class="like-button"><div>${post.likes}</div><span>좋아요수</span></button>
                <button class="view-button"><div>${post.views}</div><span>조회수</span></button>
                <button class="comment-button">${post.comments.length}<span>댓글수</span></button>
            </div>

            <hr class="detail-horizen">
            <div class="comment-input-card">
                <textarea class="comment-input" placeholder="댓글을 남겨주세요!"></textarea>
                <hr class="detail-horizen">
                <button class="comment-input-button">댓글 등록</button>
            </div>

            <div class="comments-list"></div>
        `;

        const profileImage = document.getElementById('profile-image');
        if (loginUser.profileImage) {
            profileImage.style.backgroundImage = loginUser.profileImage;
            profileImage.style.backgroundSize = 'cover';
            profileImage.style.backgroundPosition = 'center';
            profileImage.style.width = '30px';
            profileImage.style.height = '30px';
            profileImage.style.borderRadius = '50%';
        } else {
            profileImage.innerHTML = `<div class="default-profile"></div>`;
        }

        const postModal = document.createElement('div'); // 게시글 삭제모달
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

        const commentModal = document.createElement('div'); // 댓글 삭제모달
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

        const writerProfileImage = document.getElementById('writer-profile-image'); // 게시글 쓴 사람의 프로필 이미지
        if (writer.profileImage) {
            writerProfileImage.style.backgroundImage = writer.profileImage;
            writerProfileImage.style.backgroundSize = 'cover';
            writerProfileImage.style.backgroundPosition = 'center';
            writerProfileImage.style.width = '30px';
            writerProfileImage.style.height = '30px';
            writerProfileImage.style.borderRadius = '50%';
        } else {
            writerProfileImage.innerHTML = `<div class="default-profile"></div>`;
        }

        const profileImageInDropdown = document.getElementById('profile-image');
        profileImageInDropdown.addEventListener('click', () => {
            dropdownMenu.style.display = dropdownMenu.style.display === 'block' ? 'none' : 'block';
        });
        document.addEventListener('click', (event) => {
            if (!event.target.closest('.profile-list')) {
                dropdownMenu.style.display = 'none';
            }
        });

        const postDeleteButton = detailContainer.querySelector('.post-delete-button');
        postDeleteButton.addEventListener('click', () => {
            selectedItemForDeletion = post;
            postModal.style.display = "flex";
        });

        document.querySelector('.like-button').addEventListener('click', () => {
            post.likes += 1;
            localStorage.setItem('posts', JSON.stringify(posts));
            document.querySelector('.like-button div').textContent = `${post.likes}`;
        });

        document.querySelector('.view-button').addEventListener('click', () => {
            post.views += 1;
            localStorage.setItem('posts', JSON.stringify(posts));
            document.querySelector('.view-button div').textContent = `${post.views}`;
        });

        document.querySelector('.comment-input-button').addEventListener('click', () => {
            const commentContent = document.querySelector('.comment-input').value.trim();
            if (commentContent) {
                const newComment = {
                    id: post.comments.length + 1,
                    content: commentContent,
                    date: new Date().toISOString(),
                    writerId: loginUser.id,
                };
                post.comments.push(newComment);
                localStorage.setItem('posts', JSON.stringify(posts));
                updateCommentsList();
                document.querySelector('.comment-input').value = '';
            }

            /* 댓글 입력 fetch
               fetch(`https://example.com/api/posts/${selectedPostId}/comments`, {
                   method: "POST",
                   headers: {
                       "Content-Type": "application/json",
                       Authorization: `Bearer ${localStorage.getItem("accessToken")}`
                   },
                   body: JSON.stringify({
                       content: commentContent,
                       writerId: loginUser.id
                   })
               })
               .then(response => response.json())
               .then(data => console.log("댓글 등록 성공:", data))
               .catch(error => console.error("댓글 등록 중 오류 발생:", error.message));
               */
        });

        function updateCommentsList() {
            const commentsList = document.querySelector('.comments-list');
            commentsList.innerHTML = '';

            post.comments.forEach(comment => {
                const commentElement = document.createElement('div');
                commentElement.classList.add('comment-item');
                const commentWriter = users.find(user => user.id == comment.writerId);
                commentElement.innerHTML = `
                    <div class="comment-header">
                    <div class="comment-author-info">
                        <div class="comment-profile-image" id="comment-profile-image"></div>
                        <span class="comment-author-name">${commentWriter ? commentWriter.nickname : '익명'}</span>
                        <span class="comment-date">${comment.date}</span>
                    </div>
                        <div class="comment-actions">
                            <button class="comment-edit-button">수정</button>
                            <button class="comment-delete-button">삭제</button>
                        </div>
                    </div>
                    <div class="comment-body">
                        <p class="comment-content">${comment.content}</p>
                    </div>
                `;
                commentsList.appendChild(commentElement);

                const commentProfileImage = commentElement.querySelector('#comment-profile-image');
                if (commentWriter.profileImage) {
                    commentProfileImage.style.backgroundImage = commentWriter.profileImage;
                    commentProfileImage.style.backgroundSize = 'cover';
                    commentProfileImage.style.backgroundPosition = 'center';
                    commentProfileImage.style.width = '30px';
                    commentProfileImage.style.height = '30px';
                    commentProfileImage.style.borderRadius = '50%';
                } else {
                    commentProfileImage.innerHTML = `<div class="default-profile"></div>`;
                }

                commentElement.querySelector('.comment-edit-button').addEventListener('click', () => {
                    const newContent = prompt("수정할 댓글을 입력하세요", comment.content);
                    if (newContent) {
                        comment.content = newContent;
                        localStorage.setItem('posts', JSON.stringify(posts));
                        updateCommentsList();
                    }
                    /* 댓글 수정 api
                      fetch(`https://example.com/api/posts/{postId}/comments/{commentId}`, {
                          method: "PUT",
                          headers: {
                              "Content-Type": "application/json",
                              Authorization: `Bearer ${localStorage.getItem("accessToken")}`
                          },
                          body: JSON.stringify({ content: newContent })
                      })
                      .then(response => response.json())
                      .then(data => console.log("댓글 수정 성공:", data))
                      .catch(error => console.error("댓글 수정 중 오류 발생:", error.message));
                      */
                });

                commentElement.querySelector('.comment-delete-button').addEventListener('click', () => {
                    selectedItemForDeletion = comment;
                    commentModal.style.display = "flex";


                    // fetch(`https://example.com/api/posts/{postId}/comments/{commentId}`, {
                    //     method: "DELETE",
                    //     headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` }
                    // })
                    //     .then(() => console.log("댓글 삭제 성공"))
                    //     .catch(error => console.error("댓글 삭제 중 오류 발생:", error.message));

                });
            });
        }

        updateCommentsList();

        document.querySelector('.post-edit-button').addEventListener('click', () => {
            localStorage.setItem('selectedPostId', selectedPostId);
            localStorage.setItem('selectedPostWriterId', selectedPostWriterId);
            window.location.href = '../edit/edit.html';
        });

        const modalCancelButton = document.querySelectorAll('.modal-cancel-button');
        modalCancelButton.forEach(button => {
            button.addEventListener('click', () => {
                postModal.style.display = "none";
                commentModal.style.display = "none";
            });
        });

        const modalConfirmButton = document.querySelector('.modal-post-button-confirm');
        modalConfirmButton.addEventListener('click', () => {
            if (selectedItemForDeletion === post) {
                const postIndex = posts.findIndex(p => p.id == selectedPostId);
                if (postIndex !== -1) {
                    posts.splice(postIndex, 1);
                    localStorage.setItem('posts', JSON.stringify(posts));
                    alert("게시글이 삭제되었습니다.");
                }
            }

            // fetch(`https://example.com/api//posts/{postId}`, {
            //     method: "DELETE",
            //     headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` }
            // })
            //     .then(() => console.log("게시글 삭제 성공"))
            //     .catch(error => console.error("게시글 삭제 중 오류 발생:", error.message));

            window.location.href = "../list/list.html";

            postModal.style.display = "none";
        });

        const commentModalConfirmButton = document.querySelector('.modal-comment-button-confirm');
        commentModalConfirmButton.addEventListener('click', () => {
            if (selectedItemForDeletion) {
                const commentIndex = post.comments.findIndex(c => c.id === selectedItemForDeletion.id);
                if (commentIndex !== -1) {
                    post.comments.splice(commentIndex, 1);
                    localStorage.setItem('posts', JSON.stringify(posts));
                    updateCommentsList();
                    alert("댓글이 삭제되었습니다.");
                }
            }
            commentModal.style.display = "none";
        });

        window.addEventListener('click', (e) => {
            if (e.target === postModal || e.target === commentModal) {
                postModal.style.display = "none";
                commentModal.style.display = "none";
            }
        });
    }
});
