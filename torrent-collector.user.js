// ==UserScript==
// @name         Torrent Link Collector
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Adds a button that collects all .torrent links on the page, logs them, copies to clipboard, and shows notifications
// @author       rabin-io
// @match        https://nyaa.si/?*
// @grant        GM_setClipboard
// @run-at       document-start
// ==/UserScript==

(function () {
  "use strict";

  // Initialize once DOM is ready
  function init() {
    // Helper: show transient notification
    function showNotification(message) {
      const notif = document.createElement("div");
      notif.textContent = message;
      Object.assign(notif.style, {
        position: "fixed",
        top: "20px",
        left: "50%",
        transform: "translateX(-50%)",
        backgroundColor: "rgba(0,0,0,0.8)",
        color: "#fff",
        padding: "10px 20px",
        borderRadius: "5px",
        fontSize: "14px",
        zIndex: 10001,
        opacity: "0",
        transition: "opacity 0.3s ease",
      });
      document.body.appendChild(notif);
      requestAnimationFrame(() => {
        notif.style.opacity = "1";
      });
      setTimeout(() => {
        notif.style.opacity = "0";
        notif.addEventListener("transitionend", () => notif.remove());
      }, 3000);
    }

    // Create and style the button
    const btn = document.createElement("button");
    btn.textContent = "Collect .torrent 🌊 Links";
    Object.assign(btn.style, {
      position: "fixed",
      top: "10px",
      right: "10px",
      padding: "8px 12px",
      backgroundColor: "#28a745",
      color: "#fff",
      border: "none",
      borderRadius: "4px",
      cursor: "pointer",
      zIndex: 10000,
    });
    document.body.appendChild(btn);

    // On button click: find links, log, copy, notify
    btn.addEventListener("click", async () => {
      const links = Array.from(
        document.querySelectorAll('a[href$=".torrent"]'),
      ).map((a) => a.href);

      if (links.length === 0) {
        console.log("No .torrent links found on this page.");
        showNotification("No .torrent links found on this page.");
        return;
      }

      console.log("Found .torrent links:", links);
      const text = links.join("\n");

      try {
        if (typeof GM_setClipboard === "function") {
          GM_setClipboard(text);
        } else if (navigator.clipboard && navigator.clipboard.writeText) {
          await navigator.clipboard.writeText(text);
        } else {
          const ta = document.createElement("textarea");
          ta.value = text;
          document.body.appendChild(ta);
          ta.select();
          document.execCommand("copy");
          document.body.removeChild(ta);
        }
        showNotification(
          `Copied ${links.length} .torrent link(s) to clipboard.`,
        );
        console.log(`Copied ${links.length} link(s) to clipboard.`);
      } catch (err) {
        console.error("Failed to copy links to clipboard:", err);
        showNotification("Error copying links: " + err.message);
      }
    });
  }

  // Run init() when possible
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
