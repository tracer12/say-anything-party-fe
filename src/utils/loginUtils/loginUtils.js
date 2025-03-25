export function LoginUtils(emailInput, passwordInput) {
    fetch("http://localhost:8080/users/auth", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            email: emailInput.value,
            password: passwordInput.value,
        }),
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error(`로그인 실패: ${response.status}`);
            }
            return response.json();
        })
        .then((data) => {
            localStorage.setItem("profileImage", data.profileImage);
            localStorage.setItem("accessToken", data.accessToken);
            localStorage.setItem("refreshToken", data.refreshToken);

            alert("로그인 성공!");
            window.location.href = "../posts/list/list.html";
        })
        .catch((error) => {
            console.error("로그인 요청 중 오류 발생:", error.message);
        });
}