const apiKey = "d26b4eade8454809891148a84096ac9e";

// 한글 키워드를 영어로 매핑
const keywordMap = {
  "챗지피티": "ChatGPT",
  "인공지능": "AI",
  "애플": "Apple",
  "마이크로소프트": "Microsoft",
  "구글": "Google",
  "오픈AI": "OpenAI",
  "메타": "Meta",
  "로봇": "Robot",
  "기술": "Technology"
};

function searchNews() {
  const keywordInput = document.getElementById("keyword");
  const userKeyword = keywordInput.value.trim();

  if (userKeyword === "") {
    alert("검색어를 입력해주세요!");
    return;
  }

  // 매핑된 키워드가 있다면 사용, 없다면 원래 키워드 사용
  const searchKeyword = keywordMap[userKeyword.toLowerCase()] || userKeyword;
  const encodedKeyword = encodeURIComponent(searchKeyword);
  const baseUrl = `https://newsapi.org/v2/everything?q=${encodedKeyword}&language=ko&sortBy=publishedAt&apiKey=${apiKey}`;
  const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(baseUrl)}`;

  console.log("📡 요청 URL:", proxyUrl);

  fetch(proxyUrl)
    .then(response => response.json())
    .then(data => {
      const container = document.getElementById("news-container");
      container.innerHTML = "";

      if (!data.articles || data.articles.length === 0) {
        container.innerHTML = "📭 관련 뉴스가 없습니다.";
        return;
      }

      let filteredArticles = [];

      // "삼성"일 경우 제목에 포함된 기사만
      if (userKeyword.toLowerCase() === "삼성") {
        filteredArticles = data.articles.filter(article =>
          article.title && article.title.includes("삼성")
        );
      } else {
        filteredArticles = data.articles;
      }

      if (filteredArticles.length === 0) {
        container.innerHTML = `📭 '${userKeyword}' 관련 뉴스가 없습니다.`;
        return;
      }

      filteredArticles.forEach(article => {
        const newsDiv = document.createElement("div");
        newsDiv.className = "news-item";
        newsDiv.innerHTML = `
          <h3><a href="${article.url}" target="_blank">${article.title}</a></h3>
          <p>${article.description || "설명이 없습니다."}</p>
          ${article.urlToImage ? `<img src="${article.urlToImage}" alt="뉴스 이미지">` : ""}
        `;
        container.appendChild(newsDiv);
      });
    })
    .catch(error => {
      document.getElementById("news-container").innerHTML = "❌ 뉴스 로딩 실패";
      console.error("에러:", error);
    });
}

// 엔터키로 검색 가능하게 설정
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("keyword").addEventListener("keypress", event => {
    if (event.key === "Enter") {
      searchNews();
    }
  });
});
