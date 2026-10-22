import { useEffect, useRef, useState } from 'react'
import { FileText, Image, Paperclip, UploadCloud, X } from 'lucide-react'

type Attachment = { id: string; file: File; url: string; image: boolean }
const extensions = /\.(pdf|docx?|txt|png|jpe?g|webp)$/i
const documentExtensions = /\.(pdf|docx?|txt)$/i
const imageExtensions = /\.(png|jpe?g|webp)$/i
const accept = '.pdf,.doc,.docx,.txt,.png,.jpg,.jpeg,.webp'

function formatSize(bytes: number) {
  return bytes < 1024 * 1024 ? `${Math.max(1, Math.ceil(bytes / 1024))} KB` : `${(bytes / 1024 / 1024).toFixed(1)} MB`
}

/** 参考附件的本地选择与预览；未接文件存储、文档解析或多模态模型。 */
export function ReferenceAttachments({ documentsOnly = false, showDescription = true, maxFiles = 5 }: { documentsOnly?: boolean; showDescription?: boolean; maxFiles?: number | null }) {
  const [attachments, setAttachments] = useState<Attachment[]>([])
  const [error, setError] = useState('')
  const [dragging, setDragging] = useState(false)
  const [previewId, setPreviewId] = useState<string | null>(null)
  const input = useRef<HTMLInputElement>(null)
  const urls = useRef(new Set<string>())
  const preview = attachments.find(item => item.id === previewId)

  useEffect(() => () => { urls.current.forEach(url => URL.revokeObjectURL(url)) }, [])

  function addFiles(files: File[]) {
    const next = [...attachments]
    const errors: string[] = []
    for (const file of files) {
      if (!(documentsOnly ? documentExtensions : extensions).test(file.name) || (documentsOnly && file.type.startsWith('image/'))) {
        errors.push(`${file.name}：${documentsOnly ? '仅支持 Word、PDF、TXT 文档' : '不支持该文件格式'}`)
        continue
      }
      if (!file.size) { errors.push(`${file.name}：文件为空`); continue }
      if (file.size > 10 * 1024 * 1024) { errors.push(`${file.name}：超过 10 MB`); continue }
      const id = `${file.name}-${file.size}-${file.lastModified}`
      if (next.some(item => item.id === id)) { errors.push(`${file.name}：已添加，请勿重复选择`); continue }
      if (maxFiles !== null && next.length >= maxFiles) { errors.push(`最多添加 ${maxFiles} 个参考附件`); break }
      const url = URL.createObjectURL(file)
      urls.current.add(url)
      next.push({ id, file, url, image: imageExtensions.test(file.name) })
    }
    setAttachments(next)
    setError(errors.join('；'))
  }

  return (
    <section className="er-ai-attachments" aria-label={documentsOnly ? '参考文档' : '参考文档与图片'}>
      <div className="er-ai-label-row"><span className="er-ai-attachment-label"><Paperclip />{documentsOnly ? '参考文档' : '参考文档 / 图片'}</span><span className="er-ai-small">选填 · {maxFiles === null ? `已添加 ${attachments.length} 个` : `${attachments.length}/${maxFiles}`}</span></div>
      <div className={`er-ai-dropzone ${dragging ? 'is-dragging' : ''}`} onDragOver={event => { event.preventDefault(); setDragging(true) }} onDragLeave={event => { if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setDragging(false) }} onDrop={event => {
        event.preventDefault(); setDragging(false); addFiles(Array.from(event.dataTransfer.files))
      }}>
        <UploadCloud />
        <button type="button" className="er-ai-upload-trigger" disabled={maxFiles !== null && attachments.length >= maxFiles} onClick={() => input.current?.click()}>点击上传参考文件</button>
        <p>{documentsOnly ? '或将文档拖到这里' : '或将文档、图片拖到这里'}</p>
        <span>{documentsOnly ? 'Word、PDF、TXT' : 'Word、PDF、TXT、JPG、PNG、WebP'}<br />{maxFiles === null ? '数量不限' : `最多 ${maxFiles} 个`}，每个不超过 10 MB</span>
        <input ref={input} type="file" accept={documentsOnly ? '.pdf,.doc,.docx,.txt' : accept} multiple hidden aria-label={documentsOnly ? '选择参考文档' : '选择参考文档或图片'} onChange={event => {
          addFiles(Array.from(event.target.files ?? [])); event.target.value = ''
        }} />
      </div>
      {error && <p className="er-ai-error" role="alert">{error}</p>}
      {attachments.length > 0 && <>
        <ul className="er-ai-file-list" aria-label="已添加的参考附件">
          {attachments.map(item => <li key={item.id}>
            {item.image ? <button type="button" className="er-ai-file-thumbnail" aria-label={`预览 ${item.file.name}`} onClick={() => setPreviewId(previewId === item.id ? null : item.id)}><img src={item.url} alt="" /></button> : <span className="er-ai-file-icon"><FileText /></span>}
            <div className="er-ai-file-info"><span title={item.file.name}>{item.file.name}</span><small>{formatSize(item.file.size)} · 已添加，待接入识别</small></div>
            <button type="button" className="er-ai-file-remove" aria-label={`移除 ${item.file.name}`} onClick={() => {
              URL.revokeObjectURL(item.url); urls.current.delete(item.url); setAttachments(attachments.filter(file => file.id !== item.id)); setError('')
              if (previewId === item.id) setPreviewId(null)
            }}><X /></button>
          </li>)}
        </ul>
        {preview && <div className="er-ai-image-preview"><div><span><Image />图片预览</span><button type="button" aria-label="关闭图片预览" onClick={() => setPreviewId(null)}><X /></button></div><img src={preview.url} alt={preview.file.name} /></div>}
      </>}
      {showDescription && <p className="er-ai-small">附件仅在当前页面暂存，可预览图片；暂未接入内容识别，不参与本次生成。请将需要参考的信息填入写作要求。</p>}
    </section>
  )
}
