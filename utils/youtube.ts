export const getId = (url: string) => {
  const newUrl = url
    .replace(/(>|<)/gi,'')
    .split(/(vi\/|v=|\/v\/|youtu\.be\/|\/embed\/)/);
  if (newUrl[2]) {
    return newUrl[2].split(/[^0-9a-z_-]/i)[0]
  } else return newUrl[0]
}

export const getThumbnail = (videoId: string) => {
  return `https://img.youtube.com/vi/${videoId}/sddefault.jpg`
}

export const getImage = (videoId: string) => {
  return `https://img.youtube.com/vi/${videoId}/1.jpg`
}

export default {
  getId,
  getThumbnail,
  getImage
}