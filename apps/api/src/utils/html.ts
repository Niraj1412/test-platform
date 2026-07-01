import sanitizeHtml from 'sanitize-html'

const s3BaseUrl = process.env.S3_PUBLIC_BASE_URL

export const sanitiseHtml = (value: string | null | undefined) => {
  if (!value) {
    return value ?? null
  }

  return sanitizeHtml(value, {
    allowedTags: ['p', 'strong', 'em', 'ul', 'ol', 'li', 'br', 'img'],
    allowedAttributes: {
      img: ['src', 'alt']
    },
    allowedSchemes: ['https'],
    allowedSchemesByTag: {
      img: ['https']
    },
    exclusiveFilter: (frame) => {
      if (frame.tag !== 'img') {
        return false
      }
      const src = frame.attribs.src
      if (!src || !s3BaseUrl) {
        return true
      }
      return !src.startsWith(s3BaseUrl)
    }
  })
}
