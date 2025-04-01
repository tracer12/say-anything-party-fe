import { navigateTo } from "../../../index.js";

export async function SignupUtils(formData) {
    try {
        const response = await fetch("http://localhost:8080/users", {
            method: "POST",
            body: formData,
        });

        if (!response.ok) {
            throw new Error(`회원가입 실패: ${response.status}`);
        }

        alert("회원가입이 완료되었습니다!");
        // /login 경로로 이동
        navigateTo("../login");
    } catch (error) {
        console.error("❌ 회원가입 중 오류 발생:", error.message);
        alert("회원가입 실패: " + error.message);
    }
}
