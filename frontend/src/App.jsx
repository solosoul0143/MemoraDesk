
import { useState, useRef, useEffect } from 'react'
import './App.css'

const API_URL = 'http://127.0.0.1:8000'

function App() {
  const [activePage, setActivePage] = useState('chat')

  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content:
        'Hello! I am MemoraDesk AI. I can remember information, retrieve your saved memories, and help you whenever you need. What would you like to talk about?',
    },
  ])

  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [memoryCount, setMemoryCount] = useState(0)

  // Dashboard state
  const [searchQuery, setSearchQuery] = useState('')
  const [memories, setMemories] = useState([])
  const [dashboardLoading, setDashboardLoading] = useState(false)
  const [dashboardError, setDashboardError] = useState('')
  const [hasSearched, setHasSearched] = useState(false)

  const messagesEndRef = useRef(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: 'smooth',
    })
  }, [messages, loading])

  // Convert different recall response formats into displayable items
  const formatMemories = (data) => {
    const result = data?.memories

    if (Array.isArray(result)) {
      return result.map((item, index) => ({
        id: index,
        content:
          typeof item === 'string'
            ? item
            : item.text ||
              item.content ||
              item.fact ||
              JSON.stringify(item, null, 2),
      }))
    }

    if (result && typeof result === 'object') {
      return Object.entries(result).map(([key, value], index) => ({
        id: index,
        content:
          typeof value === 'string'
            ? value
            : `${key}: ${JSON.stringify(value)}`,
      }))
    }

    if (result) {
      return [{ id: 0, content: String(result) }]
    }

    return []
  }

  // Search memories in Hindsight
  const searchMemories = async (e) => {
    e?.preventDefault()

    if (!searchQuery.trim() || dashboardLoading) return

    setDashboardLoading(true)
    setDashboardError('')
    setHasSearched(true)
    setMemories([])

    try {
      const response = await fetch(`${API_URL}/recall`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: searchQuery.trim(),
        }),
      })

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`)
      }

      const data = await response.json()
      const formattedMemories = formatMemories(data)

      setMemories(formattedMemories)
    } catch (error) {
      console.error('Memory search error:', error)
      setDashboardError(
        'Unable to retrieve memories. Please check your backend connection.'
      )
    } finally {
      setDashboardLoading(false)
    }
  }

  // Send message to AI
  const sendMessage = async (e) => {
    e.preventDefault()

    const userMessage = input.trim()

    if (!userMessage || loading) return

    setMessages((prev) => [
      ...prev,
      { role: 'user', content: userMessage },
    ])

    setInput('')
    setLoading(true)

    try {
      const response = await fetch(`${API_URL}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage,
        }),
      })

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`)
      }

      const data = await response.json()

      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: data.answer || 'I could not generate a response.',
        },
      ])

      setMemoryCount(data.memories_used?.length || 0)
    } catch (error) {
      console.error('Chat error:', error)

      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content:
            'Unable to connect to MemoraDesk. Please check that your backend is running.',
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  // Clear current chat
  const clearChat = () => {
    setMessages([
      {
        role: 'assistant',
        content:
          'Chat cleared! Your saved memories are still available. How can I help you?',
      },
    ])

    setMemoryCount(0)
  }

  return (
    <div className="app">

      {/* SIDEBAR */}
      <aside className="sidebar">

        <div className="brand">
          <div className="brand-icon">M</div>

          <div>
            <h2>MemoraDesk</h2>
            <span>AI MEMORY ASSISTANT</span>
          </div>
        </div>

        <button className="new-chat" onClick={clearChat}>
          <span>＋</span> New conversation
        </button>

        <div className="sidebar-info">
          <span className="sidebar-label">YOUR WORKSPACE</span>

          <button
            className={`workspace-item ${activePage === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActivePage('dashboard')}
          >
            <span>◈</span> Memory Dashboard
          </button>

          <button
            className={`workspace-item ${activePage === 'chat' ? 'active' : ''}`}
            onClick={() => setActivePage('chat')}
          >
            <span>✦</span> AI Assistant
          </button>
        </div>

        <div className="sidebar-bottom">
          <div className="team-badge">S</div>

          <div>
            <strong>Team SIGMA</strong>
            <small>MemoraDesk Project</small>
          </div>
        </div>

      </aside>

      {/* MAIN CONTENT */}
      <main className="main">

        <header className="topbar">
          <div>
            <span className="page-label">
              WORKSPACE / {activePage === 'chat' ? 'CHAT' : 'MEMORY'}
            </span>

            <h3>
              {activePage === 'chat'
                ? 'AI Assistant'
                : 'Memory Dashboard'}
            </h3>
          </div>

          <div className="connection">
            <span className="status-dot"></span>
            AI Workspace
          </div>
        </header>

        {/* CHAT PAGE */}
        {activePage === 'chat' && (

          <section className="chat-area">

            <div className="welcome">
              <div className="welcome-icon">✦</div>

              <h1>
                Your memory, <span>reimagined.</span>
              </h1>

              <p>
                An intelligent assistant that remembers what matters
                and helps you think better.
              </p>
            </div>

            <div className="messages">

              {messages.map((message, index) => (
                <div
                  className={`message-row ${message.role}`}
                  key={index}
                >
                  <div className="avatar">
                    {message.role === 'assistant' ? 'M' : 'U'}
                  </div>

                  <div className="message-content">
                    <span className="message-name">
                      {message.role === 'assistant'
                        ? 'MemoraDesk AI'
                        : 'You'}
                    </span>

                    <div className="message-bubble">
                      {message.content}
                    </div>
                  </div>
                </div>
              ))}

              {loading && (
                <div className="message-row assistant">
                  <div className="avatar">M</div>

                  <div className="message-content">
                    <span className="message-name">
                      MemoraDesk AI
                    </span>

                    <div className="message-bubble typing">
                      Thinking and recalling memories...
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />

            </div>

            <div className="chat-footer">

              <div className="memory-indicator">
                <span>◈</span>
                {memoryCount} memories used in last response
              </div>

              <form className="input-box" onSubmit={sendMessage}>
                <input
                  type="text"
                  placeholder="Ask anything... MemoraDesk remembers."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  disabled={loading}
                />

                <button
                  type="submit"
                  disabled={!input.trim() || loading}
                  aria-label="Send message"
                >
                  ↑
                </button>
              </form>

              <p className="footer-note">
                Powered by Hindsight Memory and Groq AI
              </p>

            </div>

          </section>

        )}

        {/* MEMORY DASHBOARD PAGE */}
        {activePage === 'dashboard' && (

          <section className="dashboard-area">

            <div className="dashboard-heading">
              <div>
                <span className="dashboard-label">
                  YOUR PERSONAL KNOWLEDGE
                </span>

                <h1>
                  Memory <span>Dashboard</span>
                </h1>

                <p>
                  Search and explore information remembered by MemoraDesk.
                </p>
              </div>

              <div className="dashboard-icon">◈</div>
            </div>

            {/* MEMORY STATISTICS */}
            <div className="stats-grid">

              <div className="stat-card">
                <div className="stat-icon">◈</div>
                <span>Memories found</span>
                <h2>{memories.length}</h2>
                <small>From your latest search</small>
              </div>

              <div className="stat-card">
                <div className="stat-icon">⌕</div>
                <span>Search status</span>
                <h2 className="stat-status">
                  {dashboardLoading
                    ? 'Searching'
                    : hasSearched
                      ? 'Completed'
                      : 'Ready'}
                </h2>
                <small>Hindsight memory retrieval</small>
              </div>

              <div className="stat-card">
                <div className="stat-icon">✦</div>
                <span>AI Platform</span>
                <h2 className="stat-status">Hindsight</h2>
                <small>Connected memory service</small>
              </div>

            </div>

            {/* SEARCH */}
            <div className="memory-search-section">

              <h2>Explore your memories</h2>

              <p>
                Enter a topic, name, project, or question to retrieve
                related memories.
              </p>

              <form
                className="memory-search-box"
                onSubmit={searchMemories}
              >
                <span>⌕</span>

                <input
                  type="text"
                  placeholder="Search memories... e.g. My projects, interests, or team"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />

                <button
                  type="submit"
                  disabled={!searchQuery.trim() || dashboardLoading}
                >
                  {dashboardLoading ? 'Searching...' : 'Search'}
                </button>
              </form>

            </div>

            {/* RESULTS */}
            <div className="memory-results">

              <div className="results-heading">
                <h2>Retrieved memories</h2>
                <span>{memories.length} results</span>
              </div>

              {dashboardLoading && (
                <div className="dashboard-message">
                  Searching your Hindsight memories...
                </div>
              )}

              {dashboardError && (
                <div className="dashboard-error">
                  {dashboardError}
                </div>
              )}

              {!dashboardLoading &&
                !dashboardError &&
                hasSearched &&
                memories.length === 0 && (
                  <div className="dashboard-message">
                    No memories found for this search. Try another keyword.
                  </div>
                )}

              {!dashboardLoading &&
                !dashboardError &&
                !hasSearched && (
                  <div className="dashboard-message">
                    <span>◈</span>
                    <p>
                      Your retrieved memories will appear here.
                    </p>
                    <small>
                      Start by searching for something you have told
                      MemoraDesk.
                    </small>
                  </div>
                )}

              <div className="memory-list">

                {memories.map((memory) => (
                  <div className="memory-card" key={memory.id}>

                    <div className="memory-card-icon">✦</div>

                    <div className="memory-card-content">
                      <span>RETRIEVED MEMORY</span>
                      <p>{memory.content}</p>
                    </div>

                  </div>
                ))}

              </div>

            </div>

          </section>

        )}

      </main>
    </div>
  )
}

export default App
