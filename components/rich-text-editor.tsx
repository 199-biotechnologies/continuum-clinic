'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import Underline from '@tiptap/extension-underline'
import Link from '@tiptap/extension-link'
import Image from '@tiptap/extension-image'
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  List,
  ListOrdered,
  Heading1,
  Heading2,
  Heading3,
  Quote,
  Code,
  Link as LinkIcon,
  Image as ImageIcon,
  Undo,
  Redo
} from 'lucide-react'
import { useCallback } from 'react'

interface RichTextEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
}

export function RichTextEditor({
  value,
  onChange,
  placeholder = 'Write your content here...',
  className = ''
}: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({ placeholder }),
      Underline,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-blue-600 dark:text-blue-400 underline cursor-pointer'
        }
      }),
      Image.configure({
        HTMLAttributes: {
          class: 'max-w-full h-auto rounded-lg'
        }
      })
    ],
    content: value,
    onUpdate: ({ editor }) => {
      // Convert to markdown-like format
      const html = editor.getHTML()
      onChange(html)
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm dark:prose-invert max-w-none focus:outline-none min-h-[300px] px-4 py-3'
      }
    }
  })

  const setLink = useCallback(() => {
    if (!editor) return

    const previousUrl = editor.getAttributes('link').href
    const url = window.prompt('URL', previousUrl)

    if (url === null) return

    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run()
      return
    }

    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
  }, [editor])

  const addImage = useCallback(() => {
    if (!editor) return

    const url = window.prompt('Image URL')
    if (url) {
      editor.chain().focus().setImage({ src: url }).run()
    }
  }, [editor])

  if (!editor) {
    return null
  }

  return (
    <div className={`border rounded-lg overflow-hidden ${className}`}>
      {/* Toolbar */}
      <div className="flex flex-wrap gap-1 p-2 border-b bg-muted/10">
        {/* Text Formatting */}
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-2 rounded transition-colors ${
            editor.isActive('bold')
              ? 'bg-foreground text-background'
              : 'hover:bg-muted/20'
          }`}
          type="button"
          title="Bold"
        >
          <Bold className="w-4 h-4" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-2 rounded transition-colors ${
            editor.isActive('italic')
              ? 'bg-foreground text-background'
              : 'hover:bg-muted/20'
          }`}
          type="button"
          title="Italic"
        >
          <Italic className="w-4 h-4" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={`p-2 rounded transition-colors ${
            editor.isActive('underline')
              ? 'bg-foreground text-background'
              : 'hover:bg-muted/20'
          }`}
          type="button"
          title="Underline"
        >
          <UnderlineIcon className="w-4 h-4" />
        </button>

        <div className="w-px h-6 bg-border mx-1" />

        {/* Headings */}
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={`p-2 rounded transition-colors ${
            editor.isActive('heading', { level: 1 })
              ? 'bg-foreground text-background'
              : 'hover:bg-muted/20'
          }`}
          type="button"
          title="Heading 1"
        >
          <Heading1 className="w-4 h-4" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`p-2 rounded transition-colors ${
            editor.isActive('heading', { level: 2 })
              ? 'bg-foreground text-background'
              : 'hover:bg-muted/20'
          }`}
          type="button"
          title="Heading 2"
        >
          <Heading2 className="w-4 h-4" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={`p-2 rounded transition-colors ${
            editor.isActive('heading', { level: 3 })
              ? 'bg-foreground text-background'
              : 'hover:bg-muted/20'
          }`}
          type="button"
          title="Heading 3"
        >
          <Heading3 className="w-4 h-4" />
        </button>

        <div className="w-px h-6 bg-border mx-1" />

        {/* Lists */}
        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-2 rounded transition-colors ${
            editor.isActive('bulletList')
              ? 'bg-foreground text-background'
              : 'hover:bg-muted/20'
          }`}
          type="button"
          title="Bullet List"
        >
          <List className="w-4 h-4" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`p-2 rounded transition-colors ${
            editor.isActive('orderedList')
              ? 'bg-foreground text-background'
              : 'hover:bg-muted/20'
          }`}
          type="button"
          title="Numbered List"
        >
          <ListOrdered className="w-4 h-4" />
        </button>

        <div className="w-px h-6 bg-border mx-1" />

        {/* Block Elements */}
        <button
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`p-2 rounded transition-colors ${
            editor.isActive('blockquote')
              ? 'bg-foreground text-background'
              : 'hover:bg-muted/20'
          }`}
          type="button"
          title="Blockquote"
        >
          <Quote className="w-4 h-4" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          className={`p-2 rounded transition-colors ${
            editor.isActive('codeBlock')
              ? 'bg-foreground text-background'
              : 'hover:bg-muted/20'
          }`}
          type="button"
          title="Code Block"
        >
          <Code className="w-4 h-4" />
        </button>

        <div className="w-px h-6 bg-border mx-1" />

        {/* Media */}
        <button
          onClick={setLink}
          className={`p-2 rounded transition-colors ${
            editor.isActive('link')
              ? 'bg-foreground text-background'
              : 'hover:bg-muted/20'
          }`}
          type="button"
          title="Add Link"
        >
          <LinkIcon className="w-4 h-4" />
        </button>
        <button
          onClick={addImage}
          className="p-2 rounded transition-colors hover:bg-muted/20"
          type="button"
          title="Add Image"
        >
          <ImageIcon className="w-4 h-4" />
        </button>

        <div className="w-px h-6 bg-border mx-1" />

        {/* Undo/Redo */}
        <button
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          className="p-2 rounded transition-colors hover:bg-muted/20 disabled:opacity-30 disabled:cursor-not-allowed"
          type="button"
          title="Undo"
        >
          <Undo className="w-4 h-4" />
        </button>
        <button
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          className="p-2 rounded transition-colors hover:bg-muted/20 disabled:opacity-30 disabled:cursor-not-allowed"
          type="button"
          title="Redo"
        >
          <Redo className="w-4 h-4" />
        </button>
      </div>

      {/* Editor */}
      <EditorContent editor={editor} />
    </div>
  )
}
