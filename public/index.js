import { LoginForm } from "../src/components/login/LoginForm.js";
import { SignupForm } from "../src/components/signup/SignupForm.js";
import { ListForm } from "../src/components/list/ListForm.js";
import { DetailForm } from "../src/components/detail/DetailForm.js";


const routes = {
    "/login": LoginForm,
    "/signup": SignupForm,
    "/list": ListForm,
    "/detail": DetailForm,
};

export function navigateTo(url) {
    history.pushState(null, null, url);
    render();
}

function render() {
    const path = window.location.pathname;
    const PageComponent = routes[path] || LoginForm; // 기본적으로 로그인 페이지
    document.getElementById("root").innerHTML = "";
    const page = PageComponent();
    page.render();
}

// 브라우저 뒤로가기/앞으로 가기 이벤트 처리
window.addEventListener("popstate", render);

// 초기 실행
document.addEventListener("DOMContentLoaded", render);
