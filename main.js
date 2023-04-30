let news = [];
let page = 1;
let total_pages = 1;
let searchBtn = document.getElementById("search_btn");
let url;
let menus = document.querySelectorAll(".menus button");
menus.forEach((menu) =>menu.addEventListener("click", (e) => getNewsByTopic(e)));

const getNews = async() => {
    try {
        let header = new Headers({'x-api-key' : 'HoJX3j2p7RWHPJtIaNrQSw3Q0Cn09ys5EHbGd65xj8M'});
        url.searchParams.set('page', page); // = ....&page = page
        // console.log("url", url);
        let response = await fetch(url, {headers:header});
        let data = await response.json();
        // console.log("data", data);
        if(response.status == 200) {
            if(data.total_hits == 0) {
                page = 0;
                total_pages = 0;
                renderPagenation();
                throw new Error("검색된 내용이 없습니다.");
            }
            news = data.articles;
            total_pages = data.total_pages;
            page = data.page;
            // console.log(news);
            render();
            renderPagenation();
        } else {
            page = 0;
            total_pages = 0;
            renderPagenation();
            throw new Error(data.message);
        }
        // console.log("response는?", response);
        // console.log("data는?", data);
    } catch(error) {
        // console.log("잡힌 에러는???", error.message);
        ErrorRender(error.message);
        page = 0;
        total_pages = 0;
        renderPagenation();
    };

};
 
const getLatestNews = async() => {
    page = 1;
    url = new URL('https://api.newscatcherapi.com/v2/latest_headlines?countries=KR&topic=business&page_size=10') 
    getNews();
};

const getNewsByTopic = async(e) => {
    let topic = e.target.textContent.toLowerCase();
    page = 1;
    url = new URL(`https://api.newscatcherapi.com/v2/latest_headlines?countries=KR&page_size=10&topic=${topic}`);
    getNews();
};

const getNewsByKeyword = async() => {
    let keyWord = document.getElementById("search_input").value
    page = 1;
    // console.log("키워드", keyWord);
    url = new URL(`https://api.newscatcherapi.com/v2/search?q=${keyWord}&countries=KR&page_size=10`)
    getNews();
};

const render = () => {
    let newsHTML = "";
    newsHTML = news.map((item) => {
        return `
                <div class="row news">
                    <div class="col-lg-4">
                        <img class="news_img" 
                             src="${item.media || 
                             "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRqEWgS0uxxEYJ0PsOb2OgwyWvC0Gjp8NUdPw&usqp=CAU"}"/>
                    </div>
                    <div class="col-lg-8 contents">
                        <h2>${item.title}</h2>
                        <p>
                            ${item.summary == null || item.summary == "" 
                            ? "내용없음"
                            : item.summary.length > 200
                            ? item.summary.substring(0, 200) + "..."
                            : item.summary}
                        </p>
                        <div>
                            ${item.rights || "no source"} ${moment(item.published_date).fromNow()}
                        </div>
                    </div>
                </div>
                `
    }).join('');
    document.getElementById("news_board").innerHTML = newsHTML;
};

const renderPagenation = () => {
    let pagenationHTML = ``;

    // 그룹(페이지 5개씩 묶인 하나의 그룹)
    let pageGroup = Math.ceil(page / 5);

    // 그룹의 마지막 페이지
    let lastPage = pageGroup * 5;

    if (lastPage > total_pages) {
        // 마지막 그룹이 5개 이하이면
        lastPage = total_pages;
      };

    // 그룹의 첫 페이지 
    let firstPage = lastPage - 4 <= 0 ? 1 : lastPage - 4; // 첫그룹이 5이하이면
    if (firstPage >= 6) {
        pagenationHTML = `
                        <li class="page-item" onclick="moveToPage(1)">
                            <a class="page-link" href='#js-bottom'>&lt;&lt;</a>
                        </li>
                        <li class="page-item" onClick="moveToPage(${page - 1})">
                            <a class="page-link" href="#" aria-label="Previous">&lt;</a>
                        </li>
                        `;
    };
    
    // 처음(1)부터 마지막(5) 페이지 보여주는 부분
    for(let i = firstPage; i <= lastPage; i++) {
        pagenationHTML +=   `<li class="page-item ${page == i ? "active" : ""}">
                                <a class="page-link" href="#" onClick="moveToPage(${i})">${i}</a>
                            </li>`
    };

    if(lastPage < total_pages) {
        pagenationHTML += `
                        <li class="page-item" onClick="moveToPage(${page + 1})">
                            <a class="page-link" href="#" aria-label="Next">&gt;</a>
                        </li>
                        <li class="page-item" onclick="moveToPage(${total_pages})">
                            <a class="page-link" href='#js-bottom'>&gt;&gt;</a>
                        </li>
                        `;
                      
    };
    
    document.querySelector(".pagination").innerHTML = pagenationHTML;
};

const moveToPage = (pageNum) => {
    // 이동한 페이지 
    page = pageNum;
    window.scrollTo({ top: 0, behavior: "smooth" });

    // 이동한 페이지의 api 호출
    getNews();
};

const ErrorRender = (message) => {
    let errorHTML = `<div class="alert alert-danger text-center" role="alert">${message}</div>`
    document.getElementById("news_board").innerHTML = errorHTML;
};

const openNav = () => {
    document.getElementById("mySidenav").style.width = "250px";
  };
  
  const closeNav = () => {
    document.getElementById("mySidenav").style.width = "0";
  };

searchBtn.addEventListener("click", getNewsByKeyword);
getLatestNews();