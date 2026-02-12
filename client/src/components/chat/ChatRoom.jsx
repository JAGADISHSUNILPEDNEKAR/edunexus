// Chat room component with Socket.io integration
// spec: see FullStackProject-Sem3_33099103.pdf

import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { io } from 'socket.io-client'
import { chatAPI, courseAPI } from '../../services/api'
import { useAuth } from '../../hooks/useAuth'

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'https://edunexus-tix1.onrender.com'

const ChatRoom = () => {
  const { id: courseId } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()

  const [course, setCourse] = useState(null)
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('') // Added error state
  const [socket, setSocket] = useState(null)
  const [isTyping, setIsTyping] = useState(false)
  const [typingUsers, setTypingUsers] = useState(new Set())

  const messagesEndRef = useRef(null)
  const typingTimeoutRef = useRef(null)

  useEffect(() => {
    fetchCourseAndMessages()
    initializeSocket()

    return () => {
      if (socket) {
        socket.disconnect()
      }
    }
  }, [courseId])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const fetchCourseAndMessages = async () => {
    try {
      setLoading(true)
      const [courseRes, messagesRes] = await Promise.all([
        courseAPI.getById(courseId),
        chatAPI.getMessages(courseId)
      ])
      setCourse(courseRes.data.course)
      setMessages(messagesRes.data.messages)
    } catch (err) {
      console.error('Failed to fetch data:', err)
      const errorMsg = err.response?.data?.message || 'Failed to load chat. You might not have permission to view this course chat.'
      setError(errorMsg)
      // Don't redirect immediately so user can see the error
    } finally {
      setLoading(false)
    }
  }

  const initializeSocket = () => {
    const token = localStorage.getItem('token')

    const newSocket = io(SOCKET_URL, {
      auth: { token }
    })

    newSocket.on('connect', () => {
      console.log('Connected to chat server')
      newSocket.emit('join-course', courseId)
    })

    newSocket.on('new-message', (data) => {
      setMessages(prev => [...prev, {
        _id: Date.now().toString(),
        sender: { _id: data.userId, name: 'User' },
        content: data.message,
        createdAt: data.timestamp
      }])
    })

    newSocket.on('user-joined', (data) => {
      console.log('User joined:', data)
    })

    newSocket.on('user-typing', (data) => {
      if (data.userId !== user?.id) {
        if (data.isTyping) {
          setTypingUsers(prev => new Set(prev).add(data.userId))
        } else {
          setTypingUsers(prev => {
            const newSet = new Set(prev)
            newSet.delete(data.userId)
            return newSet
          })
        }
      }
    })

    newSocket.on('connect_error', (err) => {
      console.error('Socket connection error:', err)
    })

    setSocket(newSocket)
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleTyping = () => {
    if (!isTyping && socket) {
      setIsTyping(true)
      socket.emit('typing', { courseId, isTyping: true })
    }

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current)
    }

    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false)
      if (socket) {
        socket.emit('typing', { courseId, isTyping: false })
      }
    }, 1000)
  }

  const handleSendMessage = async (e) => {
    e.preventDefault()

    if (!newMessage.trim() || !socket) return

    const messageText = newMessage.trim()
    setNewMessage('')

    try {
      // Send via REST API for persistence
      await chatAPI.sendMessage(courseId, { content: messageText })

      // Broadcast via Socket.io
      socket.emit('send-message', {
        courseId,
        message: messageText
      })

      // Clear typing indicator
      setIsTyping(false)
      socket.emit('typing', { courseId, isTyping: false })
    } catch (err) {
      console.error('Failed to send message:', err)
      alert('Failed to send message')
      setNewMessage(messageText)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-12 h-12 border-4 border-t-primary-600 border-border-light rounded-full animate-spin"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto mt-8">
        <div className="bg-rose-50 border border-rose-200 text-rose-700 px-6 py-4 rounded-lg shadow-sm">
          <h3 className="text-lg font-bold mb-2">Access Denied</h3>
          <p>{error}</p>
          <button
            onClick={() => navigate(`/courses/${courseId}`)}
            className="mt-4 btn btn-secondary text-sm"
          >
            &larr; Back to Course
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="card mb-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-text-primary">{course?.title}</h1>
            <p className="text-text-muted text-sm">Course Discussion</p>
          </div>
          <button
            onClick={() => navigate(`/courses/${courseId}`)}
            className="btn btn-secondary"
          >
            Back to Course
          </button>
        </div>
      </div>

      {/* Chat Container */}
      <div className="card h-[600px] flex flex-col">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => {
            const isOwnMessage = message.sender._id === user?.id

            return (
              <div
                key={message._id}
                className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${isOwnMessage
                    ? 'bg-primary-600 text-white'
                    : 'bg-bg-tertiary text-text-primary'
                    }`}
                >
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="font-semibold text-sm">
                      {isOwnMessage ? 'You' : message.sender.name}
                    </span>
                    <span className={`text-xs ${isOwnMessage ? 'text-primary-200' : 'text-text-muted'}`}>
                      {message.sender.role}
                    </span>
                  </div>
                  <p className="break-words">{message.content}</p>
                  <p className={`text-xs mt-1 ${isOwnMessage ? 'text-primary-200' : 'text-text-muted'}`}>
                    {new Date(message.createdAt).toLocaleTimeString()}
                  </p>
                </div>
              </div>
            )
          })}

          {/* Typing Indicator */}
          {typingUsers.size > 0 && (
            <div className="flex justify-start">
              <div className="bg-bg-tertiary text-text-muted px-4 py-2 rounded-lg text-sm">
                Someone is typing...
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Form */}
        <div className="border-t border-border-light p-4">
          <form onSubmit={handleSendMessage} className="flex space-x-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => {
                setNewMessage(e.target.value)
                handleTyping()
              }}
              placeholder="Type your message..."
              className="input flex-1"
              maxLength={1000}
            />
            <button
              type="submit"
              disabled={!newMessage.trim()}
              className="btn btn-primary disabled:opacity-50"
            >
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default ChatRoom