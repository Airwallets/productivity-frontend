import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { Badge } from "./ui/badge"
import { Calendar } from "./ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog"
import { CalendarIcon, Mail, Send, Plus, MessageSquare } from "lucide-react"
import { format } from "date-fns"

interface Email {
  id: string
  from: string
  subject: string
  preview: string
  status: "unread" | "read" | "replied"
  timestamp: string
  fullContent: string
  summary: string
  draftResponse: string
  task: string
}

const mockEmails: Email[] = [
  {
    id: "email-1",
    from: "john@company.com",
    subject: "Q4 Budget Proposal Review",
    preview: "Hi, I've reviewed the Q4 budget proposal and have some questions...",
    status: "unread",
    timestamp: "2024-01-15 10:30 AM",
    fullContent: "Hi there,\n\nI've reviewed the Q4 budget proposal and have some questions about the marketing allocation. The proposed 15% increase seems significant compared to last quarter's performance. Could we schedule a meeting to discuss this in detail?\n\nAlso, I noticed the IT infrastructure budget has been reduced by 8%. Given our recent expansion, I'm concerned this might impact our operational efficiency.\n\nLet me know your thoughts.\n\nBest regards,\nJohn",
    summary: "John has questions about Q4 budget proposal, specifically marketing allocation increase and IT infrastructure budget reduction. Wants to schedule a meeting to discuss.",
    draftResponse: "Hi John,\n\nThank you for reviewing the Q4 budget proposal. I'd be happy to discuss your concerns about the marketing allocation and IT infrastructure budget.\n\nRegarding the marketing increase, it's based on our aggressive growth targets for Q4. However, I understand your concerns and would welcome a discussion.\n\nLet's schedule a meeting this week. Are you available Tuesday or Wednesday afternoon?\n\nBest regards",
    task: "Schedule meeting with John to discuss Q4 budget concerns"
  },
  {
    id: "email-2",
    from: "sarah@client.com",
    subject: "Project Timeline Update",
    preview: "The project timeline needs to be adjusted due to some dependencies...",
    status: "read",
    timestamp: "2024-01-15 09:15 AM",
    fullContent: "Hello,\n\nI hope this email finds you well. I'm writing to inform you that we need to make some adjustments to our project timeline.\n\nDue to some unexpected dependencies and resource constraints on our end, we'll need to push back the delivery date by approximately 2 weeks. This will ensure we maintain the quality standards we've committed to.\n\nI apologize for any inconvenience this may cause and would like to schedule a call to discuss the revised timeline in detail.\n\nThank you for your understanding.\n\nBest,\nSarah",
    summary: "Sarah is requesting a 2-week delay in project timeline due to dependencies and resource constraints. Wants to schedule a call to discuss revised timeline.",
    draftResponse: "Hi Sarah,\n\nThank you for the update on the project timeline. While I understand that dependencies can cause delays, I'd like to discuss the impact this might have on our other commitments.\n\nCould we schedule a call for tomorrow to review the revised timeline and see if there are any ways to minimize the delay?\n\nI appreciate your transparency in communicating this early.\n\nRegards",
    task: "Schedule call with Sarah to discuss revised project timeline"
  },
  {
    id: "email-3",
    from: "team@company.com",
    subject: "Weekly Team Meeting Notes",
    preview: "Please find attached the notes from this week's team meeting...",
    status: "replied",
    timestamp: "2024-01-15 08:45 AM",
    fullContent: "Team,\n\nPlease find attached the notes from this week's team meeting. Key points covered:\n\n1. Q4 goals review - we're on track for 90% completion\n2. New client onboarding process updates\n3. Holiday schedule planning\n4. Resource allocation for upcoming projects\n\nAction items:\n- Marketing team to prepare Q4 campaign review\n- HR to finalize holiday policy updates\n- IT to assess infrastructure needs for new projects\n\nNext meeting: January 22nd, 2024 at 10:00 AM\n\nThanks,\nTeam Lead",
    summary: "Weekly team meeting notes covering Q4 goals (90% completion), client onboarding updates, holiday planning, and resource allocation. Includes action items for different teams.",
    draftResponse: "Thanks for sharing the meeting notes. I'll review the action items and ensure my team follows up on the infrastructure assessment.\n\nRegards",
    task: "Review action items from team meeting and coordinate with IT team"
  }
]

interface EmailPageProps {
  onOpenChat: (context: { type: string; id: string; data: any }) => void
}

export function EmailPage({ onOpenChat }: EmailPageProps) {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null)
  const [emails] = useState<Email[]>(mockEmails)

  const addToChecklist = (task: string, emailId: string) => {
    // In a real app, this would add to a checklist store/database
    console.log("Adding to checklist:", task, "for email:", emailId)
    alert("Task added to checklist!")
  }

  const sendReply = (emailId: string, response: string) => {
    // In a real app, this would send the email
    console.log("Sending reply to:", emailId, "with content:", response)
    alert("Reply sent!")
  }

  const openGmail = (emailId: string) => {
    // In a real app, this would open Gmail
    window.open("https://mail.google.com", "_blank")
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1>Email Management</h1>
          <p className="text-muted-foreground">Manage and respond to your emails with AI assistance</p>
        </div>
        
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-[240px] justify-start">
              <CalendarIcon className="mr-2 h-4 w-4" />
              {format(selectedDate, "PPP")}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(date) => date && setSelectedDate(date)}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Emails for {format(selectedDate, "MMM d, yyyy")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {emails.map((email) => (
                <div
                  key={email.id}
                  className="p-4 border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => setSelectedEmail(email)}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{email.from}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge 
                        variant={email.status === "unread" ? "destructive" : 
                                email.status === "replied" ? "default" : "secondary"}
                      >
                        {email.status}
                      </Badge>
                      <span className="text-xs text-muted-foreground">{email.timestamp}</span>
                    </div>
                  </div>
                  <h3 className="font-medium mb-1">{email.subject}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">{email.preview}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Email Details</CardTitle>
          </CardHeader>
          <CardContent>
            {selectedEmail ? (
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3>Email #{selectedEmail.id}</h3>
                    <Badge 
                      variant={selectedEmail.status === "unread" ? "destructive" : 
                              selectedEmail.status === "replied" ? "default" : "secondary"}
                    >
                      {selectedEmail.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">From: {selectedEmail.from}</p>
                </div>

                <div>
                  <h4>Full Email:</h4>
                  <div className="bg-muted p-3 rounded text-sm whitespace-pre-wrap">
                    {selectedEmail.fullContent}
                  </div>
                </div>

                <div>
                  <h4>AI Summary:</h4>
                  <p className="text-sm text-muted-foreground">{selectedEmail.summary}</p>
                </div>

                <div>
                  <h4>Draft Response:</h4>
                  <div className="bg-muted p-3 rounded text-sm whitespace-pre-wrap">
                    {selectedEmail.draftResponse}
                  </div>
                </div>

                <div>
                  <h4>Generated Task:</h4>
                  <p className="text-sm text-muted-foreground">{selectedEmail.task}</p>
                </div>

                <div className="flex flex-wrap gap-2 pt-4">
                  <Button 
                    onClick={() => sendReply(selectedEmail.id, selectedEmail.draftResponse)}
                    className="flex items-center space-x-2"
                  >
                    <Send className="h-4 w-4" />
                    <span>Send Reply</span>
                  </Button>
                  
                  <Button 
                    variant="outline"
                    onClick={() => addToChecklist(selectedEmail.task, selectedEmail.id)}
                    className="flex items-center space-x-2"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Add to Checklist</span>
                  </Button>
                  
                  <Button 
                    variant="outline"
                    onClick={() => onOpenChat({ 
                      type: "email", 
                      id: selectedEmail.id, 
                      data: selectedEmail 
                    })}
                    className="flex items-center space-x-2"
                  >
                    <MessageSquare className="h-4 w-4" />
                    <span>Chat</span>
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center text-muted-foreground py-8">
                <Mail className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Select an email to view details</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}