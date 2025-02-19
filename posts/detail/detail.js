document.addEventListener('DOMContentLoaded', () => {
    const selectedPostId = localStorage.getItem('selectedPostId');
    const selectedPostWriterId = localStorage.getItem('selectedPostWriterId');

    const posts = JSON.parse(localStorage.getItem('posts')) || [];
    const users = JSON.parse(localStorage.getItem('users')) || [];

    const post = posts.find(post => post.id == selectedPostId);
    const writer = users.find(user => user.id == selectedPostWriterId);

    if (post && writer) {
        const detailContainer = document.querySelector('.detail-container');

        detailContainer.innerHTML = `
            <h2 class="post-title">${post.title}</h2>
            <div class="post-meta">
                <p class="post-author">${writer.nickname}</p>
                <p class="post-date">${post.date}</p>
                <div class="post-actions">
                    <button class="post-edit-button">수정</button>
                    <button class="post-delete-button">삭제</button>
                </div>
            </div>
            <p class="post-content">${post.content}</p>

            <!-- 좋아요, 조회수, 댓글 수 버튼 -->
            <div class="pop-actions">
                <button class="like-button">${post.likes}<span>좋아요</span></button>
                <button class="view-button">${post.views}<span>조회수</span></button>
                <button class="comment-button">${post.comments.length}<span>댓글수</span></button>
            </div>

            <!-- 댓글 작성 부분 -->
            <div class="comment-input-card">
                <textarea class="comment-input" placeholder="댓글을 남겨주세요!"></textarea>
                <button class="comment-input-button">댓글 등록</button>
            </div>

            <!-- 댓글 리스트 -->
            <div class="comments-list"></div>
        `;

        document.querySelector('.like-button').addEventListener('click', () => {
            post.likes += 1;
            localStorage.setItem('posts', JSON.stringify(posts));
            document.querySelector('.like-button').textContent = `좋아요 ${post.likes}`;
        });

        document.querySelector('.view-button').addEventListener('click', () => {
            post.views += 1;
            localStorage.setItem('posts', JSON.stringify(posts));
            document.querySelector('.view-button').textContent = `조회수 ${post.views}`;
        });

        document.querySelector('.comment-input-button').addEventListener('click', () => {
            const commentContent = document.querySelector('.comment-input').value.trim();
            if (commentContent) {
                const newComment = {
                    id: post.comments.length + 1,
                    content: commentContent,
                    date: new Date().toISOString(),
                    writerId: selectedPostWriterId,
                };
                post.comments.push(newComment);
                localStorage.setItem('posts', JSON.stringify(posts));
                updateCommentsList();
                document.querySelector('.comment-input').value = '';
            }
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
                        <span class="comment-author-name">${commentWriter ? commentWriter.nickname : '익명'}</span>
                        <span class="comment-date">${comment.date}</span>
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

                commentElement.querySelector('.comment-edit-button').addEventListener('click', () => {
                    const newContent = prompt("수정할 댓글을 입력하세요", comment.content);
                    if (newContent) {
                        comment.content = newContent;
                        localStorage.setItem('posts', JSON.stringify(posts));
                        updateCommentsList();
                    }
                });

                commentElement.querySelector('.comment-delete-button').addEventListener('click', () => {
                    const commentIndex = post.comments.findIndex(c => c.id === comment.id);
                    post.comments.splice(commentIndex, 1);
                    localStorage.setItem('posts', JSON.stringify(posts));
                    updateCommentsList();
                });
            });
        }

        updateCommentsList();

        document.querySelector('.post-edit-button').addEventListener('click', () => {
            localStorage.setItem('selectedPostId', selectedPostId);
            localStorage.setItem('selectedPostWriterId', selectedPostWriterId);

            window.location.href = '../edit/edit.html';
        });
    }
});
