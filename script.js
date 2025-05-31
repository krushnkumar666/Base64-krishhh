document.addEventListener("DOMContentLoaded", () => {
  let mode = "base64";

  document
    .getElementById("base64Btn")
    .addEventListener("click", () => switchMode("base64"));
  document
    .getElementById("xmlBtn")
    .addEventListener("click", () => switchMode("xml"));

  function switchMode(newMode) {
    mode = newMode;

    document
      .getElementById("base64Btn")
      .classList.toggle("active", mode === "base64");
    document
      .getElementById("xmlBtn")
      .classList.toggle("active", mode === "xml");

    document.getElementById("inputTitle").textContent =
      mode === "base64" ? "Base64 Input" : "XML Input";
    document.getElementById("outputTitle").textContent =
      mode === "base64" ? "Decoded Output" : "JSON Output";
    document.getElementById("inputText").placeholder =
      mode === "base64" ? "Paste Base64 string..." : "Paste XML here...";
    clearOutput();
  }

  window.handleDecode = function () {
    const inputText = document.getElementById("inputText").value;
    const outputTextElem = document.getElementById("outputText");
    const errorElem = document.getElementById("error");
    const copyStatus = document.getElementById("copyStatus");

    errorElem.textContent = "";
    outputTextElem.textContent = "";
    copyStatus.textContent = "";

    try {
      if (mode === "base64") {
        const binaryString = atob(inputText);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }
        const decompressed = pako.ungzip(bytes, { to: "string" });
        outputTextElem.textContent = decompressed;
      } else if (mode === "xml") {
        const json = window.xmljs
          ? window.xmljs.xml2json(inputText, { compact: true, spaces: 2 })
          : xml2json(inputText, { compact: true, spaces: 2 });
        outputTextElem.textContent = json;
      }
    } catch (err) {
      errorElem.textContent = "Failed to decode. Check your input ... 🙄";
      console.error(err);
    }
  };

  window.handleCopy = async function () {
    const output = document.getElementById("outputText").textContent;
    const copyStatus = document.getElementById("copyStatus");

    try {
      await navigator.clipboard.writeText(output);
      copyStatus.textContent = "Copied ... 😎";
      setTimeout(() => (copyStatus.textContent = ""), 2000);
    } catch (err) {
      copyStatus.textContent = "Failed to copy.";
    }
  };

  function clearOutput() {
    document.getElementById("outputText").textContent = "";
    document.getElementById("error").textContent = "";
    document.getElementById("copyStatus").textContent = "";
  }

  document.getElementById("year").textContent = new Date().getFullYear();
});
