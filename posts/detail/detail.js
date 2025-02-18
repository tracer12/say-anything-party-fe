document.addEventListener('DOMContentLoaded', () => {

    // 로컬 스토리지에서 게시글과 사용자 데이터를 가져옵니다.
    const posts = JSON.parse(localStorage.getItem('posts')) || [];
    const users = JSON.parse(localStorage.getItem('users')) || [];

    // 게시글의 ID를 URL에서 가져옵니다.
    const urlParams = new URLSearchParams(window.location.search);
    const postId = urlParams.get('id');

    // 게시글을 찾아서 표시합니다.
    const post = posts.find(post => post.id === parseInt(postId));

    if (post) {
        const postElement = document.querySelector('.detail-container');

        const user = users.find(user => user.id === post.writerId);

        // 게시글 제목, 작성자, 날짜, 내용 등을 표시합니다.
        const postTitle = document.createElement('h2');
        postTitle.classList.add('post-title');
        postTitle.textContent = post.title;

        const postMeta = document.createElement('div');
        postMeta.classList.add('post-meta');
        postMeta.innerHTML = `
            <span class="post-author">${user ? user.nickname : '알 수 없음'}</span>
            <span class="post-date">${post.date}</span>
        `;

        const postContent = document.createElement('div');
        postContent.classList.add('post-content');
        postContent.textContent = post.content;

        // 게시글 내용과 메타 정보 추가
        postElement.append(postTitle, postMeta, postContent);

        // 댓글 입력 버튼 생성
        const commentInputCard = document.createElement('div');
        commentInputCard.classList.add('comment-input-card');
        commentInputCard.innerHTML = `
            <textarea placeholder="댓글을 남겨주세요!"></textarea>
            <button class="comment-input-button">댓글 등록</button>
        `;

        const commentInputButton = commentInputCard.querySelector('.comment-input-button');
        const commentInput = commentInputCard.querySelector('textarea');

        commentInputButton.addEventListener('click', () => {
            const newComment = {
                writerId: user.id,
                content: commentInput.value,
                date: new Date().toISOString()
            };

            post.comments.push(newComment);
            localStorage.setItem('posts', JSON.stringify(posts));

            commentInput.value = '';
            renderComments(post.comments);
        });

        postElement.appendChild(commentInputCard);

        // 댓글 목록 렌더링
        const commentList = document.createElement('div');
        commentList.id = 'comment-list';
        postElement.appendChild(commentList);

        renderComments(post.comments);

        function renderComments(comments) {
            commentList.innerHTML = '';
            comments.forEach(comment => {
                const commenter = users.find(u => u.id === comment.writerId);

                const commentItem = document.createElement('div');
                commentItem.classList.add('comment-item');
                commentItem.innerHTML = `
                    <div class="comment-header">
                        <span class="comment-author-name">${commenter ? commenter.nickname : '알 수 없음'}</span>
                        <span class="comment-date">${comment.date}</span>
                    </div>
                    <div class="comment-body">
                        <p class="comment-content">${comment.content}</p>
                    </div>
                    <button class="comment-delete-button">삭제</button>
                `;

                const deleteButton = commentItem.querySelector('.comment-delete-button');
                deleteButton.addEventListener('click', () => {
                    const index = comments.indexOf(comment);
                    comments.splice(index, 1);
                    localStorage.setItem('posts', JSON.stringify(posts));
                    renderComments(comments);
                });

                commentList.appendChild(commentItem);
            });
        }
    } else {
        // 해당 게시글이 존재하지 않으면 오류 메시지 표시
        const postElement = document.querySelector('.detail-container');
        postElement.innerHTML = '<p>해당 게시글을 찾을 수 없습니다.</p>';
    }
});
