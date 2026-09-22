import { FormEvent, useMemo, useState } from 'react';

type Message = { role: 'user' | 'assistant'; content: string };

const initialMessages: Message[] = [
  { role: 'assistant', content: 'Welcome to c4rlosgpt. Add your AI provider key on the server, then start chatting.' }
];

export default function App() {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [fileName, setFileName] = useState('');
  const [error, setError] = useState('');

  const canSend = useMemo(() => Boolean(input.trim()) && !loading, [input, loading]);

  async function sendMessage(event?: FormEvent) {
    event?.preventDefault();
    const text = input.trim();
    if (!text || loading) return;

    const nextMessages = [...messages, { role: 'user' as const, content: text }];
    setMessages(nextMessages);
    setInput('');
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'c4rlosgpt',
          temperature: 0.7,
          messages: nextMessages
        })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Request failed.');
      setMessages((current) => [...current, { role: 'assistant', content: data.content || 'No response returned.' }]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not contact the server.');
    } finally {
      setLoading(false);
    }
  }

  function handleFile(file?: File) {
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      setError('Files must be 10 MB or smaller.');
      return;
    }
    setFileName(file.name);
    setError('');
  }

  return (
    <main className="app-shell">
      <aside className="sidebar">
        <div className="brand-mark">C</div>
        <h1>c4rlosgpt</h1>
        <p className="muted">A clean AI workspace</p>
        <button className="secondary" onClick={() => setMessages(initialMessages)}>New chat</button>
        <div className="side-note">No subscriptions, credits, or paid-feature gates.</div>
      </aside>

      <section className="chat-panel">
        <header className="topbar">
          <div><strong>c4rlosgpt</strong><span className="status">â— Ready</span></div>
          <button className="ghost" onClick={() => setMessages(initialMessages)}>Clear</button>
        </header>

        <div className="messages" aria-live="polite">
          {messages.map((message, index) => (
            <article className={`message ${message.role}`} key={`${message.role}-${index}`}>
              <div className="avatar">{message.role === 'user' ? 'You' : 'AI'}</div>
              <div><div className="role">{message.role === 'user' ? 'You' : 'c4rlosgpt'}</div><p>{message.content}</p></div>
            </article>
          ))}
          {loading && <div className="typing">c4rlosgpt is thinkingâ€¦</div>}
        </div>

        <div className="composer-wrap">
          {error && <div className="error">{error}</div>}
          {fileName && <div className="file-chip">Attached: {fileName} <button onClick={() => setFileName('')}>Ã—</button></div>}
          <form className="composer" onSubmit={sendMessage}>
            <label className="attach" title="Attach a text or image file">
              ðŸ“Ž
              <input type="file" accept=".txt,.md,.json,.csv,.js,.jsx,.ts,.tsx,.py,.html,.css,.xml,.yaml,.yml,.sql,.sh,image/png,image/jpeg,image/gif,image/webp" onChange={(e) => handleFile(e.target.files?.[0])} />
            </label>
            <textarea value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); void sendMessage(); } }} placeholder="Message c4rlosgptâ€¦" rows={1} />
            <button className="send" disabled={!canSend}>{loading ? 'â€¦' : 'â†‘'}</button>
          </form>
          <small>Enter to send Â· Shift+Enter for a new line Â· Maximum file size: 10 MB</small>
        </div>
      </section>
    </main>
  );
}
