(function () {
    const diaryContent = window.DIARY_CONTENT || {};
    const pages = diaryContent.pages || {};
  
    const escapeHtml = (value) =>
      String(value).replace(/[&<>"']/g, (char) => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      }[char]));
  
    const setText = (selector, value) => {
      const element = document.querySelector(selector);
  
      if (element && value) {
        element.textContent = value;
      }
    };
  
    const formatInline = (value) =>
      escapeHtml(value).replace(/\*([^*]+)\*/g, "<em>$1</em>");
  
    const renderParagraphs = (value) => {
      const normalized = String(value || "").replace(/\r\n/g, "\n").replace(/\r/g, "\n").trim();
  
      return normalized
        .split(/\n{2,}/)
        .filter(Boolean)
        .map((paragraph) => `<p>${formatInline(paragraph).replace(/\n/g, "<br>")}</p>`)
        .join("");
    };
  
    setText("[data-home-title]", diaryContent.title);
    setText("[data-home-subtitle]", diaryContent.subtitle);
    setText("[data-home-from]", diaryContent.from ? `From: ${diaryContent.from}` : "");
    setText("[data-home-to]", diaryContent.to ? `To: ${diaryContent.to}` : "");
    setText("[data-intro-title]", "Introduction");
  
    const introBody = document.querySelector("[data-intro-body]");
  
    if (introBody && diaryContent.introduction) {
      introBody.innerHTML = renderParagraphs(diaryContent.introduction);
    }
  
    const grid = document.querySelector("[data-entry-grid]");
  
    if (!grid) {
      return;
    }
  
    const diaryCards = Object.keys(pages)
      .filter((key) => /^diary-\d+$/.test(key))
      .sort()
      .map((key, index) => {
        const number = String(index + 1).padStart(2, "0");
        const page = pages[key] || {};
  
        return `
          <a class="entry-card" href="${key}.html">
            <span class="entry-number">Diary ${number}</span>
            <span class="entry-name">${escapeHtml(page.date || `Day ${index + 1}`)}</span>
          </a>
        `;
      })
      .join("");
  
    grid.innerHTML = `
      ${diaryCards}
      <a class="entry-card letter-card" href="letter.html">
        <span class="entry-number">Letter</span>
        <span class="entry-name">The Letter</span>
      </a>
    `;
  })();