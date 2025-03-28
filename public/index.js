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
    render();  // 페이지 렌더링 호출
}

async function render() {
    const path = window.location.pathname;
    const PageComponent = routes[path] || LoginForm; // 기본적으로 로그인 페이지

    // 해당 페이지가 DetailForm이면, 먼저 데이터를 fetch하고, 그 후 렌더링
    if (PageComponent === DetailForm) {
        const detailForm = new DetailForm();
        await detailForm.fetchPostData(); // 데이터를 먼저 불러오고
        //detailForm.render(); // 데이터를 불러온 후에 렌더링
    } else {
        // 다른 페이지들은 기존처럼 render
        document.getElementById("root").innerHTML = "";
        const page = PageComponent();
        page.render();
    }
}

// 브라우저 뒤로가기/앞으로 가기 이벤트 처리
window.addEventListener("popstate", render);

// 초기 실행
document.addEventListener("DOMContentLoaded", render);
