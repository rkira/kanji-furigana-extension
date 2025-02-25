// background.js

// Create a context menu item that appears when text is selected.
chrome.contextMenus.create({
    id: "searchKanji",
    title: "Search about '%s'",
    contexts: ["selection"]
  });
  
  // Listen for clicks on the context menu item.
  chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === "searchKanji") {
      const selectedText = info.selectionText.trim();
  
      // Check if the selection is exactly one Kanji character.
      if (/^[\u4e00-\u9faf]$/.test(selectedText)) {
        const url = `https://jisho.org/search/${encodeURIComponent(selectedText)}%20%23kanji`;
        chrome.tabs.create({ url });
      } else {
        console.log("The selection is not a single Kanji character.");
      }
    }
  });
  