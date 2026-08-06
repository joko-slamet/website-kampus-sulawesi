'use client';

import { useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';

interface Props {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  minHeight?: string;
}

function ToolbarButton({ onClick, active, label, children }: { onClick: () => void; active?: boolean; label: string; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={label}
      style={{
        minWidth: '30px', height: '30px', padding: '0 0.4rem', borderRadius: '6px',
        border: '1px solid var(--border)',
        background: active ? '#6366f1' : 'var(--bg-card)',
        color: active ? 'white' : 'var(--text-body)',
        fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}
    >{children}</button>
  );
}

export default function ArtikelEditor({ value, onChange, placeholder, minHeight = '320px' }: Props) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({ heading: { levels: [1, 2] } }),
      Placeholder.configure({ placeholder: placeholder ?? 'Tulis isi artikel di sini...' }),
    ],
    content: value,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
    editorProps: {
      attributes: { class: 'artikel-editor-content' },
    },
  });

  // Load content that arrives after the editor mounts (e.g. async fetch in edit mode),
  // but never clobber what the user is actively typing.
  useEffect(() => {
    if (!editor) return;
    const current = editor.getHTML();
    if (value !== current && (current === '<p></p>' || current === '')) {
      editor.commands.setContent(value || '', { emitUpdate: false });
    }
  }, [value, editor]);

  if (!editor) return null;

  return (
    <div style={{ border: '1.5px solid var(--border)', borderRadius: '8px', overflow: 'hidden' }}>
      <div style={{ display: 'flex', gap: '0.35rem', padding: '0.5rem', borderBottom: '1px solid var(--border)', background: 'var(--bg-muted)', flexWrap: 'wrap' }}>
        <ToolbarButton label="Tebal" active={editor.isActive('bold')} onClick={() => editor.chain().focus().toggleBold().run()}>B</ToolbarButton>
        <ToolbarButton label="Miring" active={editor.isActive('italic')} onClick={() => editor.chain().focus().toggleItalic().run()}>I</ToolbarButton>
        <ToolbarButton label="Judul Besar" active={editor.isActive('heading', { level: 1 })} onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}>H1</ToolbarButton>
        <ToolbarButton label="Sub Judul" active={editor.isActive('heading', { level: 2 })} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>H2</ToolbarButton>
        <ToolbarButton label="Daftar Bullet" active={editor.isActive('bulletList')} onClick={() => editor.chain().focus().toggleBulletList().run()}>••</ToolbarButton>
        <ToolbarButton label="Daftar Angka" active={editor.isActive('orderedList')} onClick={() => editor.chain().focus().toggleOrderedList().run()}>1.</ToolbarButton>
        <ToolbarButton label="Garis Pemisah" onClick={() => editor.chain().focus().setHorizontalRule().run()}>―</ToolbarButton>
      </div>
      <div style={{ padding: '0.75rem 0.9rem', minHeight }}>
        <EditorContent editor={editor} />
      </div>
      <style>{`
        .artikel-editor-content { outline: none; color: var(--text-heading); font-size: 0.85rem; line-height: 1.65; }
        .artikel-editor-content p { margin: 0 0 0.75rem; }
        .artikel-editor-content h1 { font-size: 1.3rem; font-weight: 800; margin: 0.5rem 0 0.6rem; }
        .artikel-editor-content h2 { font-size: 1.05rem; font-weight: 700; margin: 0.75rem 0 0.5rem; }
        .artikel-editor-content ul, .artikel-editor-content ol { padding-left: 1.25rem; margin: 0 0 0.75rem; }
        .artikel-editor-content li { margin-bottom: 0.3rem; }
        .artikel-editor-content hr { border: none; border-top: 1px solid var(--border); margin: 1rem 0; }
        .artikel-editor-content p.is-editor-empty:first-child::before {
          content: attr(data-placeholder);
          color: var(--text-subtle);
          pointer-events: none;
          float: left;
          height: 0;
        }
      `}</style>
    </div>
  );
}
