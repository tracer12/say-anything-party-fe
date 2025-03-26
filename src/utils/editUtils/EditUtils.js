export async function GetPostData(postId) {
    const response = await fetch(`http://localhost:8080/posts/${postId}`, {
        method: "GET",
        mode: "cors",
        credentials: "include",
    });

    if (!response.ok) {
        throw new Error("게시글 정보를 불러올 수 없습니다.");
    }

    return await response.json();
}

export async function EditPost(postId, title, content, imageFile) {
    console.log(postId, title, content, imageFile)
    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    if (imageFile) {
        formData.append("postImage", imageFile);
    }

    const response = await fetch(`http://localhost:8080/posts/${postId}`, {
        method: "PATCH",
        credentials: "include",
        headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        body: formData,
    });

    if (!response.ok) {
        throw new Error("게시글 수정 실패");
    }
}
