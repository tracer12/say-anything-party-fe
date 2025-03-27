export async function UploadUtils(formData, accessToken) {
    try {
        const response = await fetch("http://localhost:8080/posts", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            body: formData,
        });

        if (!response.ok) {
            throw new Error(`게시글 작성 실패: ${response.status}`);
        }

        alert("게시글이 성공적으로 작성되었습니다!");
        window.location.href = "../pages/upload.html";


    } catch (error) {
        console.error("게시글 작성 중 오류 발생:", error.message);
        alert("게시글 작성에 실패했습니다. 다시 시도해주세요.");
    }
}
