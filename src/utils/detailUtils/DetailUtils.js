export async function GetPostUtils(selectedPostId) {
    const response = await fetch(`http://localhost:8080/posts/${selectedPostId}`);
    const data = await response.json();
    const post = data.post;
    const comments = data.comments;

    return { post, comments };
}

export async function DeletePostUtils(selectedPostId) {

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

}

export async function LikeUtils(selectedPostId) {
    try {
        const response = await fetch(`http://localhost:8080/posts/${selectedPostId}/like`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("accessToken")}`
            }
        });

        if (!response.ok) {
            if (response.status === 400) {
                alert("이미 좋아요를 눌렀습니다.");
            }
        } else {
            alert("좋아요를 눌렀습니다!");
        }
    } catch (error) {
        alert("좋아요 누르기에 실패했습니다");
    }
}

export async function UploadCommentUtils(selectedPostId, commentContent) {

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
    } catch (error) {
        alert("댓글 등록 중 오류가 발생했습니다.");
    }
}

export async function EditCommentUtils(selectedPostId, selectedCommentId, newContent) {
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
        alert("댓글이 수정되었습니다");
    } catch (error) {
        alert("댓글 수정 권한이 없습니다");
    }

    return editResponse;
}

export async function DeleteCommentUtils(selectedPostId, selectedCommentId) {
    const deleteResponse = await fetch(`http://localhost:8080/posts/${selectedPostId}/comments/${selectedCommentId}`, {
        method: "DELETE",
        headers: {
            "Authorization": `Bearer ${localStorage.getItem("accessToken")}`
        }
    });

    if (!deleteResponse.ok) {
        throw new Error("댓글 수정에 실패했습니다.");
    }

    return deleteResponse;
}
