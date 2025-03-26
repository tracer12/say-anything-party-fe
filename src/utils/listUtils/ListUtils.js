export async function ListUtils(accessToken) {
    try {
        const response = await fetch("http://localhost:8080/posts", {
            method: "GET",
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${accessToken}`,
            },
        });

        if (!response.ok) {
            throw new Error(`게시글 가져오기 실패: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error("❌ 게시글 가져오기 실패:", error.message);
        return null; // 에러 발생 시 null 반환
    }
}
