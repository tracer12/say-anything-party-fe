const express = require("express");
const path = require("path");

const app = express();
const PORT = 3000;

// 정적 파일 제공 (public 폴더 & src 폴더)
app.use(express.static(path.join(__dirname, "public")));
app.use("/src", express.static(path.join(__dirname, "src"))); // 🔥 추가

// SPA를 위한 라우팅 설정
app.get("*", (req, res) => {
    if (req.path.startsWith("/src")) {
        return res.status(404).send("Not Found"); // 🔥 JS 파일 요청 시 index.html 반환하지 않도록 예외처리
    }
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
