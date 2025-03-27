export async function ChangePasswordUtils(password, passwordCheck, accessToken) {
    const response = await fetch("http://localhost:8080/users/password", {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${accessToken}`
        },
        body: JSON.stringify({
            password: password,
            passwordCheck: passwordCheck
        })
    });

    if (!response.ok) {
        throw new Error("비밀번호 변경 실패");
    }
}