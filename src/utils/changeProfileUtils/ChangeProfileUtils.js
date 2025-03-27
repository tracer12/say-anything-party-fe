export async function GetUserInfoUtils(accessToken) {
    const response = await fetch("http://localhost:8080/users", {
        method: "GET",
        headers: {
            "Accept": "application/json",
            "Authorization": `Bearer ${accessToken}`
        }
    });
    const userData = await response.json();

    if (!response.ok) throw new Error("사용자 정보 받기 실패");

    return userData;
}

export async function ChangeProfileUtils(formData, accessToken) {

    try {
        const response = await fetch(`http://localhost:8080/users/profile`, {
            method: "PATCH",
            headers: {
                "Authorization": `Bearer ${accessToken}`
            },
            body: formData
        });

        if (!response.ok) throw new Error("프로필 변경에 실패했습니다.");

        const data = await response.json();
        localStorage.setItem('profileImage', data.profileImage);

        alert("프로필이 성공적으로 변경되었습니다.");
        window.location.href = "../pages/list.html";
    } catch (error) {
        alert("프로필 변경 중 오류가 발생했습니다.");
        console.error("프로필 변경 오류:", error);
    }
}

export async function DeleteUserUtils(accessToken) {
    try {
        const response = await fetch(`http://localhost:8080/users`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${accessToken}`
            }
        });

        if (!response.ok) throw new Error("회원 탈퇴에 실패했습니다.");

        showToastMessage("회원 탈퇴가 완료되었습니다.", "../pages/login.html");

    } catch (error) {
        alert("회원 탈퇴 중 오류가 발생했습니다.");
        console.error("회원 탈퇴 오류:", error);
    }
}


function showToastMessage(message, redirectUrl) {
    const toastMessage = document.createElement('div');
    toastMessage.textContent = message;
    toastMessage.style.position = "fixed";
    toastMessage.style.top = "83%";
    toastMessage.style.left = "50%";
    toastMessage.style.transform = "translateX(-50%)";
    toastMessage.style.backgroundColor = "#ACA0EB";
    toastMessage.style.color = "white";
    toastMessage.style.padding = "10px 20px";
    toastMessage.style.borderRadius = "5px";
    toastMessage.style.zIndex = "9999";
    document.body.appendChild(toastMessage);

    setTimeout(() => {
        document.body.removeChild(toastMessage);
        if (redirectUrl) {
            window.location.href = redirectUrl;
        }
    }, 3000);
}