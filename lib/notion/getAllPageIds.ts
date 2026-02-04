import { idToUuid } from 'notion-utils'
import type { CollectionQuery, CollectionQueryView } from '@/types/notion'

export default function getAllPageIds(
  collectionQuery: CollectionQuery,
  viewId?: string
): string[] {
  const views = Object.values(collectionQuery)[0] as Record<string, CollectionQueryView>
  let pageIds: string[] = []
  
  if (viewId) {
    const vId = idToUuid(viewId)
    pageIds = views[vId]?.blockIds || []
  } else {
    const pageSet = new Set<string>()
    Object.values(views).forEach((view: CollectionQueryView) => {
      view?.collection_group_results?.blockIds?.forEach(id => pageSet.add(id))
    })
    pageIds = [...pageSet]
  }
  
  return pageIds
}
