"use client"

import React, { useState, useEffect, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@proof-of-fit/ui'
import { Badge } from '@proof-of-fit/ui'
import { Button } from '@proof-of-fit/ui'
import { 
  Users, 
  MessageCircle, 
  Video, 
  Mic, 
  MicOff, 
  VideoOff,
  Phone,
  PhoneOff,
  Share,
  ScreenShare,
  Settings,
  MoreVertical,
  Send,
  Paperclip,
  Smile,
  Bell,
  BellOff
} from 'lucide-react'

interface User {
  id: string
  name: string
  avatar: string
  status: 'online' | 'away' | 'busy' | 'offline'
  role: 'admin' | 'member' | 'viewer'
  isTyping?: boolean
  currentActivity?: string
}

interface Message {
  id: string
  userId: string
  userName: string
  userAvatar: string
  content: string
  timestamp: Date
  type: 'text' | 'system' | 'file' | 'emoji'
  reactions?: { emoji: string; users: string[] }[]
  isEdited?: boolean
  replyTo?: string
}

interface Meeting {
  id: string
  title: string
  participants: User[]
  startTime: Date
  duration: number
  status: 'scheduled' | 'active' | 'ended'
  agenda: string[]
  recording?: boolean
}

export function RealTimeCollaboration() {
  const [users, setUsers] = useState<User[]>([])
  const [messages, setMessages] = useState<Message[]>([])
  const [meetings, setMeetings] = useState<Meeting[]>([])
  const [activeTab, setActiveTab] = useState<'chat' | 'meetings' | 'presence'>('chat')
  const [newMessage, setNewMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [currentUser] = useState({ id: 'current-user', name: 'You', avatar: '/avatars/you.jpg' })
  const [isVideoOn, setIsVideoOn] = useState(false)
  const [isAudioOn, setIsAudioOn] = useState(false)
  const [isScreenSharing, setIsScreenSharing] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    loadCollaborationData()
    scrollToBottom()
  }, [messages])

  const loadCollaborationData = () => {
    // Mock users
    const mockUsers: User[] = [
      {
        id: '1',
        name: 'Sarah Johnson',
        avatar: '/avatars/sarah.jpg',
        status: 'online',
        role: 'admin',
        currentActivity: 'Working on sprint planning'
      },
      {
        id: '2',
        name: 'Mike Chen',
        avatar: '/avatars/mike.jpg',
        status: 'online',
        role: 'member',
        currentActivity: 'Reviewing pull requests'
      },
      {
        id: '3',
        name: 'Lisa Wang',
        avatar: '/avatars/lisa.jpg',
        status: 'away',
        role: 'member',
        currentActivity: 'In a meeting'
      },
      {
        id: '4',
        name: 'Alex Rodriguez',
        avatar: '/avatars/alex.jpg',
        status: 'busy',
        role: 'member',
        currentActivity: 'Focus time - do not disturb'
      },
      {
        id: '5',
        name: 'Emma Davis',
        avatar: '/avatars/emma.jpg',
        status: 'offline',
        role: 'viewer'
      }
    ]

    // Mock messages
    const mockMessages: Message[] = [
      {
        id: '1',
        userId: '1',
        userName: 'Sarah Johnson',
        userAvatar: '/avatars/sarah.jpg',
        content: 'Good morning team! Ready for our sprint planning?',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        type: 'text'
      },
      {
        id: '2',
        userId: '2',
        userName: 'Mike Chen',
        userAvatar: '/avatars/mike.jpg',
        content: 'Morning Sarah! I\'ve reviewed the backlog and have some suggestions.',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000 + 5 * 60 * 1000),
        type: 'text'
      },
      {
        id: '3',
        userId: 'current-user',
        userName: 'You',
        userAvatar: '/avatars/you.jpg',
        content: 'Perfect! I\'ve prepared the velocity data from last sprint.',
        timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
        type: 'text'
      },
      {
        id: '4',
        userId: '1',
        userName: 'Sarah Johnson',
        userAvatar: '/avatars/sarah.jpg',
        content: 'Great! Let\'s start with the high-priority items first.',
        timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000 + 10 * 60 * 1000),
        type: 'text',
        reactions: [
          { emoji: '👍', users: ['2', 'current-user'] },
          { emoji: '🚀', users: ['2'] }
        ]
      }
    ]

    // Mock meetings
    const mockMeetings: Meeting[] = [
      {
        id: '1',
        title: 'Sprint Planning Meeting',
        participants: mockUsers.slice(0, 4),
        startTime: new Date(Date.now() + 2 * 60 * 60 * 1000),
        duration: 60,
        status: 'scheduled',
        agenda: [
          'Review last sprint results',
          'Plan current sprint goals',
          'Estimate story points',
          'Assign tasks'
        ]
      },
      {
        id: '2',
        title: 'Daily Standup',
        participants: mockUsers.slice(0, 3),
        startTime: new Date(Date.now() - 30 * 60 * 1000),
        duration: 15,
        status: 'active',
        agenda: [
          'What did you do yesterday?',
          'What will you do today?',
          'Any blockers?'
        ]
      }
    ]

    setUsers(mockUsers)
    setMessages(mockMessages)
    setMeetings(mockMeetings)
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const sendMessage = () => {
    if (!newMessage.trim()) return

    const message: Message = {
      id: Date.now().toString(),
      userId: currentUser.id,
      userName: currentUser.name,
      userAvatar: currentUser.avatar,
      content: newMessage,
      timestamp: new Date(),
      type: 'text'
    }

    setMessages(prev => [...prev, message])
    setNewMessage('')
    setIsTyping(false)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-500'
      case 'away': return 'bg-yellow-500'
      case 'busy': return 'bg-red-500'
      case 'offline': return 'bg-gray-400'
      default: return 'bg-gray-400'
    }
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  const renderChat = () => (
    <div className="flex flex-col h-[600px]">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map(message => (
          <div
            key={message.id}
            className={`flex ${message.userId === currentUser.id ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-[70%] ${message.userId === currentUser.id ? 'order-2' : 'order-1'}`}>
              {message.userId !== currentUser.id && (
                <div className="flex items-center space-x-2 mb-1">
                  <img
                    src={message.userAvatar}
                    alt={message.userName}
                    className="w-6 h-6 rounded-full"
                  />
                  <span className="text-sm font-medium">{message.userName}</span>
                  <span className="text-xs text-gray-500">{formatTime(message.timestamp)}</span>
                </div>
              )}
              
              <div
                className={`p-3 rounded-lg ${
                  message.userId === currentUser.id
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-900'
                }`}
              >
                <p className="text-sm">{message.content}</p>
                
                {message.reactions && message.reactions.length > 0 && (
                  <div className="flex space-x-1 mt-2">
                    {message.reactions.map((reaction, index) => (
                      <button
                        key={index}
                        className="text-xs bg-white bg-opacity-20 px-2 py-1 rounded-full hover:bg-opacity-30"
                      >
                        {reaction.emoji} {reaction.users.length}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              
              {message.userId === currentUser.id && (
                <div className="text-xs text-gray-500 mt-1 text-right">
                  {formatTime(message.timestamp)}
                </div>
              )}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="border-t p-4">
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Paperclip className="w-4 h-4" />
          </Button>
          <div className="flex-1 relative">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => {
                setNewMessage(e.target.value)
                setIsTyping(e.target.value.length > 0)
              }}
              onKeyPress={handleKeyPress}
              placeholder="Type a message..."
              className="w-full p-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-1 top-1"
            >
              <Smile className="w-4 h-4" />
            </Button>
          </div>
          <Button onClick={sendMessage} disabled={!newMessage.trim()}>
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  )

  const renderMeetings = () => (
    <div className="space-y-4">
      {meetings.map(meeting => (
        <Card key={meeting.id}>
          <CardContent className="p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <Video className="w-5 h-5 text-gray-500" />
                  <h3 className="font-medium">{meeting.title}</h3>
                  <Badge variant={meeting.status === 'active' ? 'default' : 'secondary'}>
                    {meeting.status}
                  </Badge>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-500 mb-3">
                  <div>
                    <span className="font-medium">Start:</span>
                    <div>{meeting.startTime.toLocaleString()}</div>
                  </div>
                  <div>
                    <span className="font-medium">Duration:</span>
                    <div>{meeting.duration} minutes</div>
                  </div>
                  <div>
                    <span className="font-medium">Participants:</span>
                    <div>{meeting.participants.length}</div>
                  </div>
                  <div>
                    <span className="font-medium">Recording:</span>
                    <div>{meeting.recording ? 'Enabled' : 'Disabled'}</div>
                  </div>
                </div>
                
                <div>
                  <span className="font-medium text-sm mb-2 block">Agenda:</span>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {meeting.agenda.map((item, index) => (
                      <li key={index} className="flex items-center space-x-2">
                        <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                {meeting.status === 'active' ? (
                  <>
                    <Button variant="outline" size="sm">
                      <PhoneOff className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <ScreenShare className="w-4 h-4" />
                    </Button>
                  </>
                ) : (
                  <Button>
                    <Phone className="w-4 h-4 mr-2" />
                    Join
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )

  const renderPresence = () => (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Team Presence</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {users.map(user => (
              <div key={user.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-10 h-10 rounded-full"
                    />
                    <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${getStatusColor(user.status)}`}></div>
                  </div>
                  <div>
                    <div className="font-medium">{user.name}</div>
                    <div className="text-sm text-gray-600">{user.currentActivity}</div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Badge variant="outline">{user.role}</Badge>
                  <Button variant="outline" size="sm">
                    <MessageCircle className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Real-Time Collaboration</h2>
          <p className="text-gray-600">Chat, meetings, and team presence in one place</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline">
            <Video className="w-4 h-4 mr-2" />
            Start Meeting
          </Button>
          <Button>
            <Users className="w-4 h-4 mr-2" />
            Invite Team
          </Button>
        </div>
      </div>

      {/* Video Controls (when in meeting) */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Button
                  variant={isAudioOn ? "default" : "outline"}
                  size="sm"
                  onClick={() => setIsAudioOn(!isAudioOn)}
                >
                  {isAudioOn ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
                </Button>
                <Button
                  variant={isVideoOn ? "default" : "outline"}
                  size="sm"
                  onClick={() => setIsVideoOn(!isVideoOn)}
                >
                  {isVideoOn ? <Video className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
                </Button>
                <Button
                  variant={isScreenSharing ? "default" : "outline"}
                  size="sm"
                  onClick={() => setIsScreenSharing(!isScreenSharing)}
                >
                  <ScreenShare className="w-4 h-4" />
                </Button>
              </div>
              
              <div className="text-sm text-gray-600">
                Daily Standup • 3 participants • 15 min remaining
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <Settings className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="sm">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
        {[
          { key: 'chat', label: 'Chat', icon: <MessageCircle className="w-4 h-4" /> },
          { key: 'meetings', label: 'Meetings', icon: <Video className="w-4 h-4" /> },
          { key: 'presence', label: 'Presence', icon: <Users className="w-4 h-4" /> }
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === tab.key
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Content */}
      {activeTab === 'chat' && renderChat()}
      {activeTab === 'meetings' && renderMeetings()}
      {activeTab === 'presence' && renderPresence()}
    </div>
  )
}
