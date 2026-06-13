export const handleCopyToClipboard = (text) => {
  if (navigator.clipboard && window.isSecureContext) {
    return navigator.clipboard.writeText(text);
  } else {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    let success = false;
    try {
      success = document.execCommand('copy');
    } catch (err) {
      console.error('Failed to copy fallback', err);
    }
    document.body.removeChild(textArea);
    return success ? Promise.resolve() : Promise.reject(new Error("Copy failed"));
  }
};

export const getWhatsAppLink = (number) => {
  // Cleans whitespace and symbols
  const cleanNumber = number.replace(/\s+/g, '').replace('+', '');
  return `https://wa.me/${cleanNumber}`;
};
