let news = [];
let menus = document.querySelectorAll(".menus button");
menus.forEach((menu) =>menu.addEventListener("click", (e) => getNewsByTopic(e)));

const getLatestNews = async() => {
    let url = new URL('https://api.newscatcherapi.com/v2/latest_headlines?countries=KR&topic=business&page_size=10') 
    let header = new Headers({'x-api-key' : 'zB2nLs_Le3g1zAAaUr-Ike1cgUSkfmtnb4_2RDzYeTM'});
    let response = await fetch(url, {headers:header});
    let data = await response.json();
    // console.log("data", data);
    news = data.articles
    // console.log(news);

    render();
};

const getNewsByTopic = async(e) => {
    let topic = e.target.textContent.toLowerCase();
    let url = new URL(`https://api.newscatcherapi.com/v2/latest_headlines?countries=KR&page_size=10&topic=${topic}`);
    let header = new Headers({'x-api-key' : 'zB2nLs_Le3g1zAAaUr-Ike1cgUSkfmtnb4_2RDzYeTM'});
    let response = await fetch(url, {headers:header});
    let data = await response.json();
    news = data.articles
    render();
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
getLatestNews();