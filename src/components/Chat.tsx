import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Badge } from "./ui/badge"
import { Send, Bot, User, Mail, CheckSquare } from "lucide-react"

interface Message {
  id: string
  type: "user" | "assistant"
  content: string
  timestamp: Date
}

interface ChatProps {
  context: { type?: string; id?: string; data?: any }
}

export function Chat({ context }: ChatProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    // Initialize chat with context if provided
    if (context.type && context.id) {
      const welcomeMessage: Message = {
        id: `msg-${Date.now()}`,
        type: "assistant",
        content: getContextualWelcome(context),
        timestamp: new Date()
      }
      setMessages([welcomeMessage])
    } else {
      // General welcome message
      const welcomeMessage: Message = {
        id: `msg-${Date.now()}`,
        type: "assistant",
        content: "Hello! I'm your AI assistant. I can help you with email management, creating invoices, scheduling, and more. What would you like to do today?",
        timestamp: new Date()
      }
      setMessages([welcomeMessage])
    }
  }, [context])

  const getContextualWelcome = (ctx: { type?: string; id?: string; data?: any }) => {
    if (ctx.type === "email") {
      return `I'm here to help you with email "${ctx.data?.subject || ctx.id}". I can help you draft responses, create tasks, schedule meetings, or answer any questions about this email. What would you like to do?`
    } else if (ctx.type === "task") {
      return `I'm here to help you with the task "${ctx.data?.title || ctx.id}". I can help you break it down, set reminders, create related emails, or provide guidance on completing it. How can I assist?`
    }
    return "Hello! I'm your AI assistant ready to help with your email management needs."
  }

  const sendMessage = async () => {
    if (!input.trim()) return

    const userMessage: Message = {
      id: `msg-${Date.now()}`,
      type: "user",
      content: input,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = generateAIResponse(input, context)
      const assistantMessage: Message = {
        id: `msg-${Date.now() + 1}`,
        type: "assistant",
        content: aiResponse,
        timestamp: new Date()
      }
      
      setMessages(prev => [...prev, assistantMessage])
      setIsLoading(false)
    }, 1000 + Math.random() * 1000)
  }

  const generateAIResponse = (userInput: string, ctx: { type?: string; id?: string; data?: any }) => {
    const input = userInput.toLowerCase()
    
    // Context-specific responses
    if (ctx.type === "email" && ctx.data) {
      if (input.includes("summary") || input.includes("summarize")) {
        return `Here's a summary of the email from ${ctx.data.from}: ${ctx.data.summary}`
      }
      if (input.includes("reply") || input.includes("response")) {
        return `I can help you refine the draft response. Here's the current draft:\n\n${ctx.data.draftResponse}\n\nWould you like me to modify the tone, add more details, or change anything specific?`
      }
      if (input.includes("task") || input.includes("todo")) {
        return `I've identified this task from the email: "${ctx.data.task}"\n\nWould you like me to add this to your checklist, break it down into smaller steps, or help you prioritize it?`
      }
    }

    if (ctx.type === "task" && ctx.data) {
      if (input.includes("break down") || input.includes("steps")) {
        return `Here's how I suggest breaking down "${ctx.data.title}":\n\n1. Prepare agenda and materials\n2. Send calendar invites\n3. Gather necessary documents\n4. Conduct the meeting\n5. Follow up with action items\n\nWould you like me to create separate tasks for any of these steps?`
      }
      if (input.includes("schedule") || input.includes("calendar")) {
        return `I can help you schedule this task. Based on the due date of ${ctx.data.dueDate}, I recommend:\n\n- Start working on this by ${new Date(ctx.data.dueDate).toDateString()}\n- Block 2-3 hours in your calendar\n- Set a reminder 24 hours before the due date\n\nWould you like me to create calendar entries?`
      }
    }

    // General responses
    if (input.includes("create invoice") || input.includes("invoice")) {
      return "I can help you create an invoice! I'll need some details:\n\n- Client name and contact info\n- Services or products provided\n- Amount and payment terms\n- Due date\n\nPlease provide these details and I'll draft an invoice for you."
    }

    if (input.includes("schedule") || input.includes("meeting")) {
      return "I can help you schedule a meeting! Please let me know:\n\n- Who should be invited?\n- What's the meeting topic?\n- Preferred date and time?\n- How long should it be?\n- Any specific agenda items?\n\nI'll help you send out calendar invites and prepare an agenda."
    }

    if (input.includes("send email") || input.includes("email")) {
      return "I can help you compose and send an email! Please provide:\n\n- Recipient(s)\n- Subject line\n- Main message or topic\n- Any attachments needed?\n\nI'll draft a professional email for you to review before sending."
    }

    if (input.includes("read") || input.includes("analyze")) {
      return "I can analyze documents, emails, or invoices for you. Please share the content or upload the document, and I'll provide:\n\n- Key information summary\n- Important dates and deadlines\n- Action items\n- Any concerns or red flags"
    }

    // Default responses
    const defaultResponses = [
      "I understand you'd like help with that. Can you provide more specific details about what you need?",
      "I'm here to help! Could you elaborate on what you'd like me to do?",
      "Let me assist you with that. What specific aspect would you like me to focus on?",
      "I can definitely help with email management tasks. What would you like me to prioritize?"
    ]

    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)]
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <div className="p-6 h-full flex flex-col">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1>AI Assistant</h1>
            <p className="text-muted-foreground">
              {context.type ? `Helping with ${context.type}` : "Your email management assistant"}
            </p>
          </div>
          
          {context.type && context.id && (
            <Badge variant="outline" className="flex items-center space-x-1">
              {context.type === "email" && <Mail className="h-3 w-3" />}
              {context.type === "task" && <CheckSquare className="h-3 w-3" />}
              <span>{context.type}: {context.id}</span>
            </Badge>
          )}
        </div>
      </div>

      <Card className="flex-1 flex flex-col">
        <CardHeader>
          <CardTitle>Chat</CardTitle>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col">
          <div className="flex-1 space-y-4 overflow-y-auto mb-4 max-h-[500px]">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex items-start space-x-3 ${
                  message.type === "user" ? "flex-row-reverse space-x-reverse" : ""
                }`}
              >
                <div className={`p-2 rounded-full ${
                  message.type === "user" 
                    ? "bg-primary text-primary-foreground" 
                    : "bg-muted"
                }`}>
                  {message.type === "user" ? (
                    <User className="h-4 w-4" />
                  ) : (
                    <Bot className="h-4 w-4" />
                  )}
                </div>
                
                <div className={`flex-1 max-w-[80%] ${
                  message.type === "user" ? "text-right" : ""
                }`}>
                  <div className={`p-3 rounded-lg ${
                    message.type === "user" 
                      ? "bg-primary text-primary-foreground ml-auto" 
                      : "bg-muted"
                  }`}>
                    <p className="whitespace-pre-wrap text-sm">{message.content}</p>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {message.timestamp.toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex items-start space-x-3">
                <div className="p-2 rounded-full bg-muted">
                  <Bot className="h-4 w-4" />
                </div>
                <div className="bg-muted p-3 rounded-lg">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          <div className="flex items-center space-x-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              disabled={isLoading}
              className="flex-1"
            />
            <Button 
              onClick={sendMessage} 
              disabled={!input.trim() || isLoading}
              size="icon"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="mt-4 text-center">
        <p className="text-xs text-muted-foreground">
          AI can make mistakes. Verify important information.
        </p>
      </div>
    </div>
  )
}