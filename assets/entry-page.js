(function () {
  const body = document.body;
  const pageId = body.dataset.pageId;

  if (!pageId) {
    return;
  }

  const diaryContent = window.DIARY_CONTENT || {};
  const pageContent = (diaryContent.pages && diaryContent.pages[pageId]) || {};
  const pageType = body.dataset.pageType || "diary";
  const isLetter = pageType === "letter";
  const entryNumber = Number(body.dataset.entryNumber || 0);
  const entryLabel = String(entryNumber).padStart(2, "0");
  const title = isLetter ? "The Letter" : (pageContent.date || `Day ${entryNumber}`);
  const kicker = isLetter ? "Letter" : `Diary ${entryLabel}`;
  const prevHref = body.dataset.prev || "";
  const nextHref = body.dataset.next || "";
  const prevLabel = isLetter ? "Diary 14" : "Previous";
  const nextLabel = isLetter ? "" : entryNumber === 14 ? "Letter" : "Next";
  const mainText = isLetter ? pageContent.letter : pageContent.entry;

  const escapeHtml = (value) =>
    String(value).replace(/[&<>"']/g, (char) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    }[char]));

  const navLink = (href, label) =>
    href ? `<a href="${escapeHtml(href)}">${escapeHtml(label)}</a>` : "";

  const formatInline = (value) =>
    escapeHtml(value).replace(/\*([^*]+)\*/g, "<em>$1</em>");

  const renderParagraphs = (value) => {
    const normalized = String(value || "").replace(/\r\n/g, "\n").replace(/\r/g, "\n").trim();

    if (!normalized) {
      return '<p class="empty-note">This page has no content yet.</p>';
    }

    return normalized
      .split(/\n{2,}/)
      .map((paragraph) => `<p>${formatInline(paragraph).replace(/\n/g, "<br>")}</p>`)
      .join("");
  };

  const renderDetail = (label, value) => value ? `
    <div>
      <dt>${escapeHtml(label)}</dt>
      <dd>${escapeHtml(value)}</dd>
    </div>
  ` : "";

  const details = isLetter
    ? `
      ${renderDetail("To", pageContent.to || diaryContent.to)}
      ${renderDetail("From", pageContent.from || diaryContent.from)}
    `
    : renderDetail("Date", pageContent.date);

  body.innerHTML = `
    <header class="site-header">
      <a class="brand" href="index.html">${escapeHtml(diaryContent.title || "My Diary")}</a>
      <nav class="top-nav" aria-label="Diary navigation">
        <a href="index.html">Home</a>
        ${navLink(prevHref, prevLabel)}
        ${navLink(nextHref, nextLabel)}
      </nav>
    </header>
    <main class="page-shell">
      <article class="journal-page">
        <p class="entry-kicker">${escapeHtml(kicker)}</p>
        <h1>${escapeHtml(title)}</h1>
        <dl class="page-details">${details}</dl>
        <div class="entry-body">${renderParagraphs(mainText)}</div>
      </article>
    </main>
  `;
})();
