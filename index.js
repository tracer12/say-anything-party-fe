async function loadAndStoreData() {
    // try {
    //     const usersResponse = await fetch('sample/sampledata/users.json');
    //     const usersData = await usersResponse.json();

    //     const postsResponse = await fetch('sample/sampledata/posts.json');
    //     const postsData = await postsResponse.json();

    //     localStorage.setItem('users', JSON.stringify(usersData));
    //     localStorage.setItem('posts', JSON.stringify(postsData));

    //     setTimeout(() => {
    //         window.location.href = '../login/login.html';
    //     }, 2000);

    // } catch (error) {
    //     console.error('데이터를 불러오는 중 오류가 발생했습니다:', error);
    // }
}

window.onload = loadAndStoreData;
