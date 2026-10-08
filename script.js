const copyButton = document.querySelector("[data-copy]");
const copyStatus = document.querySelector("[data-copy-status]");
const contract = document.querySelector("#contract");
const header = document.querySelector("[data-header]");
const config = window.SITE_CONFIG || {};

const hasRealValue = (value) => Boolean(value && value.trim() && !value.includes("PASTE_"));

document.querySelectorAll("[data-config]").forEach((element) => {
  const key = element.dataset.config;
  const value = config[key];

  if (hasRealValue(value)) {
    element.textContent = value;
  }
});

document.querySelectorAll("[data-link]").forEach((element) => {
  const key = element.dataset.link;
  const value = config[key];

  if (hasRealValue(value)) {
    element.href = value;
    element.target = "_blank";
    element.rel = "noreferrer";
    return;
  }

  if (element.classList.contains("mini-link")) {
    element.hidden = true;
  }
});

if (hasRealValue(config.brandLabel)) {
  document.title = `${config.brandLabel} - Premium Solana Meme`;
}

if (!hasRealValue(config.contractAddress) && contract) {
  contract.textContent = "PASTE_SOL_CONTRACT_ADDRESS_HERE";
}

copyButton?.addEventListener("click", async () => {
  const value = contract?.textContent?.trim() || "";

  if (!value || value.includes("TBA") || value.includes("PASTE_")) {
    copyStatus.textContent = "Contract address is not set yet.";
    return;
  }

  try {
    await navigator.clipboard.writeText(value);
    copyStatus.textContent = "Contract copied.";
  } catch {
    copyStatus.textContent = "Copy failed. Select the address manually.";
  }
});

const updateHeader = () => {
  if (!header) return;
  header.classList.toggle("is-scrolled", window.scrollY > 12);
};

updateHeader();
window.addEventListener("scroll", updateHeader, { passive: true });
