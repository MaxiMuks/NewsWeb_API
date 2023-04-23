// let news = []

// const getLatestNews = async() => {
//     let url = new URL('https://api.newscatcherapi.com/v2/latest_headlines?countries=KR&topic=business&page_size=10') 
//     let header = new Headers({'x-api-key' : 'zB2nLs_Le3g1zAAaUr-Ike1cgUSkfmtnb4_2RDzYeTM'});
//     let response = await fetch(url, {headers:header});
//     let data = await response.json();
//     console.log("data", data);
//     news = data.articles
//     console.log(news);
// }
// getLatestNews();