interface RawMetadata {
  format?: {
    block_locked?: boolean
    page_full_width?: boolean
    page_font?: string
    page_small_text?: boolean
  }
  created_time: number
  last_edited_time: number
}

interface Metadata {
  locked?: boolean
  page_full_width?: boolean
  page_font?: string
  page_small_text?: boolean
  created_time: number
  last_edited_time: number
}

export default function getMetadata(rawMetadata: RawMetadata): Metadata {
  const metadata: Metadata = {
    locked: rawMetadata?.format?.block_locked,
    page_full_width: rawMetadata?.format?.page_full_width,
    page_font: rawMetadata?.format?.page_font,
    page_small_text: rawMetadata?.format?.page_small_text,
    created_time: rawMetadata.created_time,
    last_edited_time: rawMetadata.last_edited_time
  }
  return metadata
}
