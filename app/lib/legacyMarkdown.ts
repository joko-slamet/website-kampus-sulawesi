function escapeHtml(text: string): string {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function inlineToHtml(text: string): string {
  return escapeHtml(text)
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/_(.+?)_/g, '<em>$1</em>');
}

/** Converts the limited markdown subset produced by the AI generator / legacy textarea into HTML for loading into the Tiptap editor. */
export function markdownToHtml(md: string): string {
  const lines = md.split('\n');
  const html: string[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i].trim();

    if (!line) { i++; continue; }

    if (line.startsWith('### ')) { html.push(`<h2>${inlineToHtml(line.slice(4).trim())}</h2>`); i++; continue; }
    if (line.startsWith('## ')) { html.push(`<h2>${inlineToHtml(line.slice(3).trim())}</h2>`); i++; continue; }
    if (line.startsWith('# ')) { html.push(`<h1>${inlineToHtml(line.slice(2).trim())}</h1>`); i++; continue; }
    if (line === '---') { html.push('<hr>'); i++; continue; }

    if (line.startsWith('- ')) {
      const items: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith('- ')) {
        items.push(`<li>${inlineToHtml(lines[i].trim().slice(2).trim())}</li>`);
        i++;
      }
      html.push(`<ul>${items.join('')}</ul>`);
      continue;
    }

    if (/^\d+\.\s/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\d+\.\s/.test(lines[i].trim())) {
        items.push(`<li>${inlineToHtml(lines[i].trim().replace(/^\d+\.\s/, '').trim())}</li>`);
        i++;
      }
      html.push(`<ol>${items.join('')}</ol>`);
      continue;
    }

    html.push(`<p>${inlineToHtml(line)}</p>`);
    i++;
  }

  return html.join('');
}
