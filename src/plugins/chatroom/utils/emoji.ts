const UNICODE_TO_EMOJI = new Map() // not exported as gets for it are handled by getEmojiFromUnicode
export const EMOTICON_TO_EMOJI = new Map()

function stripVariation(str: string) {
  return str.replace(/[\uFE00-\uFE0F]$/, '')
}

export const getEmojiFromUnicode = (unicode: string) => UNICODE_TO_EMOJI.get(stripVariation(unicode))

// export function unicodeToShortcode(char) {
//   const shortcodes = getEmojiFromUnicode(char)?.shortcodes;
//   return shortcodes?.length ? `:${shortcodes[0]}:` : "";
// }
