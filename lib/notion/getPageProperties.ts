import { getTextContent, getDateValue } from 'notion-utils'
import api from '@/lib/server/notion-api'
import type { NotionSchema, PostAuthor } from '@/types'

interface BlockRecord {
  value: {
    properties?: Record<string, unknown>
    [key: string]: unknown
  }
}

interface PageProperties {
  id: string
  [key: string]: unknown
}

interface UserResponse {
  recordMapWithRoles?: {
    notion_user?: Record<string, {
      value?: {
        id?: string
        given_name?: string
        family_name?: string
        profile_photo?: string
      }
    }>
  }
}

async function getPageProperties(
  id: string,
  block: Record<string, BlockRecord>,
  schema: NotionSchema
): Promise<PageProperties> {
  const rawProperties = Object.entries(block?.[id]?.value?.properties || [])
  const excludeProperties = ['date', 'select', 'multi_select', 'person']
  const properties: PageProperties = { id }
  
  for (let i = 0; i < rawProperties.length; i++) {
    const [key, val] = rawProperties[i]
    if (schema[key]?.type && !excludeProperties.includes(schema[key].type)) {
      properties[schema[key].name] = getTextContent(val as Parameters<typeof getTextContent>[0])
    } else {
      switch (schema[key]?.type) {
        case 'date': {
          const dateProperty = getDateValue(val as Parameters<typeof getDateValue>[0])
          if (dateProperty) {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { type: _type, ...rest } = dateProperty as unknown as { type?: string; [key: string]: unknown }
            properties[schema[key].name] = rest
          }
          break
        }
        case 'select':
        case 'multi_select': {
          const selects = getTextContent(val as Parameters<typeof getTextContent>[0])
          if (selects && selects[0]?.length) {
            properties[schema[key].name] = selects.split(',')
          }
          break
        }
        case 'person': {
          const rawUsers = (val as unknown[]).flat()
          const users: PostAuthor[] = []
          for (let j = 0; j < rawUsers.length; j++) {
            const userEntry = rawUsers[j] as unknown[][]
            if (userEntry?.[0]?.[1]) {
              const userId = userEntry[0] as unknown[]
              const res = await api.getUsers(userId as string[]) as UserResponse
              const resValue =
                res?.recordMapWithRoles?.notion_user?.[userId[1] as string]?.value
              const user: PostAuthor = {
                id: resValue?.id || '',
                first_name: resValue?.given_name,
                last_name: resValue?.family_name,
                profile_photo: resValue?.profile_photo
              }
              users.push(user)
            }
          }
          properties[schema[key].name] = users
          break
        }
        default:
          break
      }
    }
  }
  return properties
}

export { getPageProperties as default }
