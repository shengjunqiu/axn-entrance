import { createDemoConversations, refreshOfflineDemoConversation } from './offline-chat-demo.ts'
import type { OfflineChatSourceId } from './offline-chat-sources'

export const offlineHistoryStorageKey = 'axn-offline-chat-history-v1'

export type ChatAttachment = {
  kind: 'file' | 'image'
  name: string
  size: string
}

export type ChatTurn = {
  question: string
  reply: string
  sourceIds?: readonly OfflineChatSourceId[]
  attachments?: ChatAttachment[]
}

export type OfflineConversation = {
  id: string
  updatedAt: number
  pinned?: boolean
  turns: ChatTurn[]
}

type OfflineHistory = { conversations: OfflineConversation[]; saved: boolean }

function isConversation(value: unknown): value is OfflineConversation {
  if (!value || typeof value !== 'object') return false
  const { id, updatedAt, pinned, turns } = value as Partial<OfflineConversation>
  return typeof id === 'string'
    && typeof updatedAt === 'number'
    && Number.isFinite(new Date(updatedAt).getTime())
    && (pinned === undefined || typeof pinned === 'boolean')
    && Array.isArray(turns)
    && turns.length > 0
    && turns.every((turn) => turn && typeof turn.question === 'string' && typeof turn.reply === 'string')
}

function readOfflineHistory() {
  try {
    const stored: unknown = JSON.parse(localStorage.getItem(offlineHistoryStorageKey) ?? '[]')
    if (Array.isArray(stored)) {
      const existing = stored.filter(isConversation).map(refreshOfflineDemoConversation)
      const existingIds = new Set(existing.map(({ id }) => id))
      const demos = createDemoConversations().filter(({ id }) => !existingIds.has(id))
      return [...existing, ...demos].sort((a, b) => b.updatedAt - a.updatedAt)
    }

    if (stored && typeof stored === 'object' && 'version' in stored && stored.version === 1
      && 'conversations' in stored && Array.isArray(stored.conversations)) {
      return stored.conversations.filter(isConversation).map(refreshOfflineDemoConversation).sort((a, b) => b.updatedAt - a.updatedAt)
    }
    return null
  } catch {
    return null
  }
}

export function loadOfflineHistory(): OfflineHistory {
  return { conversations: readOfflineHistory() ?? createDemoConversations(), saved: true }
}

function currentConversations(history: OfflineHistory) {
  return history.saved ? readOfflineHistory() ?? history.conversations : history.conversations
}

function saveOfflineHistory(conversations: OfflineConversation[]): OfflineHistory {
  try {
    localStorage.setItem(offlineHistoryStorageKey, JSON.stringify({ version: 1, conversations }))
    return { conversations, saved: true }
  } catch {
    return { conversations, saved: false }
  }
}

export function appendOfflineTurn(history: OfflineHistory, activeId: string | null, turn: ChatTurn) {
  const current = currentConversations(history)
  const previous = current.find(({ id }) => id === activeId)
  const id = previous?.id ?? crypto.getRandomValues(new Uint32Array(4)).join('-')
  const session: OfflineConversation = {
    id,
    updatedAt: Date.now(),
    pinned: previous?.pinned,
    turns: [...(previous?.turns ?? []), turn],
  }
  return { history: saveOfflineHistory([session, ...current.filter((item) => item.id !== id)]), id }
}

export function setOfflineConversationPinned(history: OfflineHistory, id: string, pinned: boolean) {
  return saveOfflineHistory(currentConversations(history).map((session) => session.id === id ? { ...session, pinned } : session))
}

export function deleteOfflineConversation(history: OfflineHistory, id: string) {
  return saveOfflineHistory(currentConversations(history).filter((session) => session.id !== id))
}

export function restoreOfflineConversation(history: OfflineHistory, conversation: OfflineConversation) {
  const current = currentConversations(history).filter(({ id }) => id !== conversation.id)
  return saveOfflineHistory([...current, conversation].sort((a, b) => b.updatedAt - a.updatedAt))
}
