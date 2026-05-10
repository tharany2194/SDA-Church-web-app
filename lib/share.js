/**
 * Social sharing utilities
 */

export function shareToWhatsApp(url, text) {
  const message = encodeURIComponent(`${text}\n${url}`);
  window.open(`https://wa.me/?text=${message}`, '_blank', 'noopener,noreferrer');
}

export function shareToFacebook(url) {
  const encodedUrl = encodeURIComponent(url);
  window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`, '_blank', 'noopener,noreferrer,width=600,height=400');
}

export function copyToClipboard(text) {
  return navigator.clipboard.writeText(text);
}
