const copyButtons = document.querySelectorAll("[data-copy]");
const copyStatus = document.querySelector("[data-copy-status]");
const contract = document.querySelector("#contract");
const header = document.querySelector("[data-header]");
const config = window.SITE_CONFIG || {};

const hasRealValue = (value) => {
  if (typeof value !== "string") return value !== null && value !== undefined;

  const normalized = value.trim().toUpperCase();
  return Boolean(
    normalized &&
      normalized !== "TBA" &&
      normalized !== "NOT ANNOUNCED" &&
      !normalized.includes("PASTE_")
  );
};

const isSafeUrl = (value) => {
  if (!hasRealValue(value)) return false;

  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
};

document.querySelectorAll("[data-config]").forEach((element) => {
  const value = config[element.dataset.config];

  if (hasRealValue(value)) {
    element.textContent = value;
  }
});

document.querySelectorAll("[data-link]").forEach((element) => {
  const value = config[element.dataset.link];

  if (isSafeUrl(value)) {
    element.href = value;
    element.target = "_blank";
    element.rel = "noopener noreferrer";
    element.removeAttribute("aria-disabled");
    return;
  }

  if (element.classList.contains("mini-link")) {
    element.hidden = true;
    return;
  }

  element.href = "#token";
  element.setAttribute("aria-disabled", "true");
});

document.querySelectorAll(".token-links").forEach((group) => {
  const activeLinks = group.querySelectorAll(".mini-link:not([hidden])");
  group.hidden = activeLinks.length === 0;
});

if (hasRealValue(config.brandLabel)) {
  document.title = `${config.brandLabel} - High-Signal Solana Meme`;
}

const contractAddress = hasRealValue(config.contractAddress)
  ? String(config.contractAddress).trim()
  : "";

if (contract) {
  contract.textContent = contractAddress || "NOT ANNOUNCED";
  contract.title = contractAddress || "The official contract has not been announced.";
}

document.body.classList.toggle("is-live", Boolean(contractAddress && isSafeUrl(config.buyUrl)));

const setCopyStatus = (message) => {
  if (!copyStatus) return;
  copyStatus.textContent = message;
};

const copyContract = async () => {
  if (!contractAddress) {
    setCopyStatus("The official contract has not been announced yet.");
    document.querySelector("#token")?.scrollIntoView({ behavior: "smooth", block: "center" });
    return;
  }

  try {
    await navigator.clipboard.writeText(contractAddress);
    setCopyStatus("Official contract copied.");
  } catch {
    const range = document.createRange();
    range.selectNodeContents(contract);
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
    setCopyStatus("Contract selected. Copy it from the highlighted text.");
  }
};

copyButtons.forEach((button) => button.addEventListener("click", copyContract));

document.querySelectorAll("a[aria-disabled='true']").forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();
    document.querySelector("#token")?.scrollIntoView({ behavior: "smooth", block: "start" });
  });
});

const updateHeader = () => {
  if (!header) return;
  header.classList.toggle("is-scrolled", window.scrollY > 12);
};

updateHeader();
window.addEventListener("scroll", updateHeader, { passive: true });
