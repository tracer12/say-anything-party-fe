import { LoginForm } from "../src/components/login/LoginForm.js";
import { SignupForm } from "../src/components/signup/SignupForm.js";
import { ListForm } from "../src/components/list/ListForm.js";
import { DetailForm } from "../src/components/detail/DetailForm.js";
import { ChangeProfileForm } from "../src/components/changeprofile/ChangeProfileForm.js";
import { ChangePasswordForm } from "../src/components/changepassword/ChangePasswordForm.js";
import { UploadForm } from "../src/components/upload/UploadForm.js";
import { EditForm } from "../src/components/edit/EditForm.js";

const routes = {
    "/login": LoginForm,
    "/signup": SignupForm,
    "/list": ListForm,
    "/detail": DetailForm,
    "/changepassword": ChangePasswordForm,
    "/changeprofile": ChangeProfileForm,
    "/upload": UploadForm,
    "/edit": EditForm,
};

export function navigateTo(url) {
    history.pushState(null, null, url);
    render();                          
}

async function render() {
    const path = window.location.pathname;
    const PageComponent = routes[path] || LoginForm;


    const root = document.getElementById("root");
    if (root) {
        root.innerHTML = "";
    }

    const page = PageComponent();
    if (typeof page.render === "function") {
        await page.render();
    } else {
        console.error(`🚨 ${path} 경로의 컴포넌트에 render() 함수가 없습니다.`);
    }
}


window.addEventListener("popstate", render);


document.addEventListener("DOMContentLoaded", () => {
    render();
});
