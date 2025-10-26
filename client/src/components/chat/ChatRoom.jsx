// Chat room component with Socket.io integration
// spec: see FullStackProject-Sem3_33099103.pdf

import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { io } from 'socket.io-client'
import { chatAPI, courseAPI } from '../../services/api'
import { useAuth } from '../../hooks/useAuth'

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000'

const ChatRoom = () => {
  const { id: courseId } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  
  const [course, setCourse] = useState(null)
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(true)
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
      alert('Failed to load chat')
      navigate('/courses')
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
        <div className="spinner"></div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="card mb-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">{course?.title}</h1>
            <p className="text-gray-600 text-sm">Course Discussion</p>
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
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    isOwnMessage
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-200 text-gray-900'
                  }`}
                >
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="font-semibold text-sm">
                      {isOwnMessage ? 'You' : message.sender.name}
                    </span>
                    <span className={`text-xs ${isOwnMessage ? 'text-primary-200' : 'text-gray-500'}`}>
                      {message.sender.role}
                    </span>
                  </div>
                  <p className="break-words">{message.content}</p>
                  <p className={`text-xs mt-1 ${isOwnMessage ? 'text-primary-200' : 'text-gray-500'}`}>
                    {new Date(message.createdAt).toLocaleTimeString()}
                  </p>
                </div>
              </div>
            )
          })}
          
          {/* Typing Indicator */}
          {typingUsers.size > 0 && (
            <div className="flex justify-start">
              <div className="bg-gray-200 text-gray-600 px-4 py-2 rounded-lg text-sm">
                Someone is typing...
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input Form */}
        <div className="border-t border-gray-200 p-4">
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