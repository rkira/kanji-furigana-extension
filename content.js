// Mapping object
const kanjiToHiragana = {
  "日": "にち",
  "一": "いち",
  "国": "こく",
  "人": "じん",
// Rest of the mappings
  
};

// Function to annotate Kanji with Furigana 
function annotateKanji(node) { 
  if (node.nodeType === Node.TEXT_NODE) { 
    const kanjiRegex = /([\u4e00-\u9faf])/g; 
 
    // Avoid reprocessing if already annotated 
    if (node.parentNode.tagName === "RUBY") return; 
 
    // Check if text contains Kanji 
    if (kanjiRegex.test(node.textContent)) { 
      const fragment = document.createDocumentFragment(); 
      let lastIndex = 0; 
 
      node.textContent.replace(kanjiRegex, (match, p1, offset) => { 
        if (offset > lastIndex) { 
          fragment.appendChild(document.createTextNode(node.textContent.substring(lastIndex, offset))); 
        } 
 
        // Create ruby annotation 
        const ruby = document.createElement("ruby"); 
        const rb = document.createElement("rb"); 
        rb.textContent = match; 
 
        const rt = document.createElement("rt"); 
        rt.textContent = kanjiToHiragana[match] || ""; // Show Furigana if available 
 
        ruby.appendChild(rb); 
        ruby.appendChild(rt); 
        fragment.appendChild(ruby); 
 
        lastIndex = offset + match.length; 
      }); 
 
      if (lastIndex < node.textContent.length) { 
        fragment.appendChild(document.createTextNode(node.textContent.substring(lastIndex))); 
      } 
 
      node.parentNode.replaceChild(fragment, node); 
    } 
  } else if ( 
    node.nodeType === Node.ELEMENT_NODE && 
    node.nodeName !== "SCRIPT" && 
    node.nodeName !== "STYLE" 
  ) { 
    Array.from(node.childNodes).forEach(child => annotateKanji(child)); 
  } 
} 
 
// Function to remove previous Furigana before reprocessing 
function removePreviousAnnotations() { 
  document.querySelectorAll("ruby").forEach(ruby => { 
    const rb = ruby.querySelector("rb");
    if (rb) { 
      ruby.replaceWith(document.createTextNode(rb.textContent)); 
    } 
  }); 
} 
 
// Function to run annotation without duplication 
function runAnnotation() { 
  console.log("Running Kanji annotation..."); 
  removePreviousAnnotations(); // Remove old Furigana 
  annotateKanji(document.body); // Re-annotate text 
} 
 
// Run annotation once on page load 
document.addEventListener("DOMContentLoaded", runAnnotation); 
 
// Run annotation every 2 seconds for dynamic content 
setInterval(runAnnotation, 2000);
