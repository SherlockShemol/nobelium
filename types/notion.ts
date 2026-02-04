// Define types locally to avoid version conflicts between different notion-types versions

export interface Block {
  id: string
  type: string
  parent_id?: string
  parent_table?: string
  version?: number
  created_time?: number
  last_edited_time?: number
  properties?: Record<string, unknown>
  format?: Record<string, unknown>
  content?: string[]
  [key: string]: unknown
}

export interface Collection {
  id: string
  name?: unknown[]
  schema?: Record<string, unknown>
  [key: string]: unknown
}

export interface BlockMap {
  [key: string]: {
    role: string
    value: Block
  }
}

export interface CollectionMap {
  [key: string]: {
    role: string
    value: Collection
  }
}

export interface ExtendedRecordMap {
  block: BlockMap
  collection: CollectionMap
  collection_view: Record<string, unknown>
  collection_query: Record<string, unknown>
  notion_user: Record<string, unknown>
  signed_urls: Record<string, string>
  [key: string]: unknown
}

// Notion API response types
export interface NotionPageResponse {
  block: Record<string, { value: Block }>
  collection: Record<string, { value: Collection }>
  collection_query: CollectionQuery
}

export interface CollectionQueryView {
  blockIds?: string[]
  collection_group_results?: {
    blockIds?: string[]
  }
}

export interface CollectionQuery {
  [collectionId: string]: {
    [viewId: string]: CollectionQueryView
  }
}

// Schema types
export interface NotionPropertySchema {
  name: string
  type: 'title' | 'text' | 'number' | 'select' | 'multi_select' | 'date' | 'person' | 'file' | 'checkbox' | 'url' | 'email' | 'phone_number' | 'formula' | 'relation' | 'rollup' | 'created_time' | 'created_by' | 'last_edited_time' | 'last_edited_by'
}

export type NotionSchema = Record<string, NotionPropertySchema>
