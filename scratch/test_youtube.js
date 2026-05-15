const patterns = [
  /(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([a-zA-Z0-9_-]{11})/,
  /(?:https?:\/\/)?(?:www\.)?youtu\.be\/([a-zA-Z0-9_-]{11})/,
  /(?:https?:\/\/)?(?:www\.)?youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/,
  /(?:https?:\/\/)?(?:www\.)?youtube\.com\/v\/([a-zA-Z0-9_-]{11})/,
];

function getYouTubeId(url) {
  if (!url) return null;
  if (/^[a-zA-Z0-9_-]{11}$/.test(url)) return url;
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) return match[1];
  }
  return null;
}

const urls = [
  'https://www.youtube.com/watch?v=M6hU4681144',
  'https://www.youtube.com/watch?v=M6hU4681144&t=10s',
  'https://youtu.be/M6hU4681144',
  'https://www.youtube.com/embed/M6hU4681144',
  'https://www.youtube.com/watch?feature=shared&v=M6hU4681144'
];

urls.forEach(u => console.log(`${u} => ${getYouTubeId(u)}`));
