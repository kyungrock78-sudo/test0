const services = [
  { id: "S001", name: "주민등록등본 발급", agency: "주민센터", category: "주민등록", online: "가능", deadline: 7, fee: 500 },
  { id: "S002", name: "전입신고", agency: "복지정책과", category: "주민등록", online: "불가", deadline: 1, fee: 0 },
  { id: "S003", name: "인감증명 발급", agency: "복지정책과", category: "주민등록", online: "가능", deadline: 1, fee: 0 },
  { id: "S004", name: "주민등록증 재발급", agency: "건축과", category: "주민등록", online: "가능", deadline: 0, fee: 0 },
  { id: "S005", name: "건축물대장 발급", agency: "구청 민원봉사과", category: "건축", online: "불가", deadline: 0, fee: 1000 },
  { id: "S006", name: "건축허가 신청", agency: "건축과", category: "건축", online: "불가", deadline: 1, fee: 2000 },
  { id: "S007", name: "용도변경 신고", agency: "시청 민원과", category: "건축", online: "불가", deadline: 0, fee: 0 },
  { id: "S008", name: "지방세 납부확인서", agency: "건축과", category: "세무", online: "가능", deadline: 1, fee: 1000 },
  { id: "S009", name: "취득세 신고", agency: "교통행정과", category: "세무", online: "가능", deadline: 0, fee: 0 },
  { id: "S010", name: "재산세 조회", agency: "교통행정과", category: "세무", online: "가능", deadline: 3, fee: 0 },
  { id: "S011", name: "기초연금 신청", agency: "건축과", category: "복지", online: "가능", deadline: 7, fee: 500 },
  { id: "S012", name: "복지급여 조회", agency: "시청 민원과", category: "복지", online: "가능", deadline: 14, fee: 5000 },
  { id: "S013", name: "장애인 등록", agency: "주민센터", category: "복지", online: "가능", deadline: 5, fee: 0 },
  { id: "S014", name: "자동차 등록", agency: "주민센터", category: "교통", online: "가능", deadline: 1, fee: 5000 },
  { id: "S015", name: "운전면허 갱신", agency: "교통행정과", category: "교통", online: "불가", deadline: 1, fee: 0 },
  { id: "S016", name: "주정차 위반 조회", agency: "주민센터", category: "교통", online: "가능", deadline: 7, fee: 1000 },
  { id: "S017", name: "배출시설 신고", agency: "주민센터", category: "환경", online: "가능", deadline: 1, fee: 0 },
  { id: "S018", name: "폐기물 처리 신청", agency: "시청 민원과", category: "환경", online: "가능", deadline: 14, fee: 5000 },
  { id: "S019", name: "식품영업 신고", agency: "건축과", category: "위생", online: "가능", deadline: 3, fee: 2000 },
  { id: "S020", name: "위생업소 조회", agency: "시청 민원과", category: "위생", online: "불가", deadline: 7, fee: 500 },
  { id: "S021", name: "여권 발급 신청", agency: "건축과", category: "여권", online: "가능", deadline: 7, fee: 1000 },
  { id: "S022", name: "여권 재발급", agency: "교통행정과", category: "여권", online: "가능", deadline: 1, fee: 1000 }
];

const searchInput = document.getElementById("searchInput");
const clearSearch = document.getElementById("clearSearch");
const categoryFilters = document.getElementById("categoryFilters");
const serviceList = document.getElementById("serviceList");
const visibleCount = document.getElementById("visibleCount");
const totalCount = document.getElementById("totalCount");
const searchStatus = document.getElementById("searchStatus");
const emptyState = document.getElementById("emptyState");
const resetFilters = document.getElementById("resetFilters");

let selectedCategory = "전체";

const categories = ["전체", ...new Set(services.map(service => service.category))];

totalCount.textContent = services.length;

function formatFee(fee) {
  return fee === 0 ? "무료" : `${fee.toLocaleString("ko-KR")}원`;
}

function formatDeadline(days) {
  return days === 0 ? "즉시" : `${days}일`;
}

function renderFilters() {
  categoryFilters.innerHTML = categories.map(category => `
    <button
      type="button"
      class="filter-btn ${category === selectedCategory ? "active" : ""}"
      data-category="${category}"
      aria-pressed="${category === selectedCategory}"
    >${category}</button>
  `).join("");

  categoryFilters.querySelectorAll(".filter-btn").forEach(button => {
    button.addEventListener("click", () => {
      selectedCategory = button.dataset.category;
      renderFilters();
      applyFilters();
    });
  });
}

function renderServices(filteredServices) {
  serviceList.innerHTML = filteredServices.map(service => `
    <article class="service-card">
      <div class="card-top">
        <h3 class="card-title">${service.name}</h3>
        <span class="category-badge">${service.category}</span>
      </div>
      <dl class="card-meta">
        <div class="meta-item">
          <dt>소속기관</dt>
          <dd>${service.agency}</dd>
        </div>
        <div class="meta-item">
          <dt>온라인처리</dt>
          <dd class="${service.online === "가능" ? "online-yes" : "online-no"}">${service.online}</dd>
        </div>
        <div class="meta-item">
          <dt>처리기한</dt>
          <dd>${formatDeadline(service.deadline)}</dd>
        </div>
        <div class="meta-item">
          <dt>수수료</dt>
          <dd>${formatFee(service.fee)}</dd>
        </div>
      </dl>
    </article>
  `).join("");

  serviceList.hidden = filteredServices.length === 0;
  emptyState.hidden = filteredServices.length !== 0;
}

function applyFilters() {
  const keyword = searchInput.value.trim().toLowerCase();

  const filtered = services.filter(service => {
    const matchesKeyword = service.name.toLowerCase().includes(keyword);
    const matchesCategory = selectedCategory === "전체" || service.category === selectedCategory;
    return matchesKeyword && matchesCategory;
  });

  visibleCount.textContent = `${filtered.length}건`;

  const keywordText = keyword ? `검색어 “${searchInput.value.trim()}”` : "전체 서비스";
  const categoryText = selectedCategory === "전체" ? "전체 분야" : `${selectedCategory} 분야`;
  searchStatus.textContent = `${keywordText}, ${categoryText} 기준으로 ${filtered.length}건을 표시하고 있습니다.`;

  renderServices(filtered);
}

searchInput.addEventListener("input", applyFilters);

clearSearch.addEventListener("click", () => {
  searchInput.value = "";
  searchInput.focus();
  applyFilters();
});

resetFilters.addEventListener("click", () => {
  searchInput.value = "";
  selectedCategory = "전체";
  renderFilters();
  applyFilters();
});

renderFilters();
applyFilters();