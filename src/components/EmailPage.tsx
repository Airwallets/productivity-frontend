import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { Badge } from "./ui/badge"
import { Calendar } from "./ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog"
import { CalendarIcon, Mail, Send, Plus, MessageSquare } from "lucide-react"
import { format } from "date-fns"

interface Email {
  email_id: string
  email_subject: string
  from_sender: string
  email_status: "unread" | "read" | "replied"
  email_timestamp: string
  full_content: string
  summary: string
  draft_subject?: string
  draft_response: string
  task: string
}

interface EmailPageProps {
  onOpenChat: (context: { type: string; id: string; data: any }) => void
}

export function EmailPage({ onOpenChat }: EmailPageProps) {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null)
  const [emails, setEmails] = useState<Email[]>([])

  useEffect(() => {
    fetch("http://localhost:3000/emails", { method: "GET", credentials: "include" }).then(async (response) => {
      var responseBody = await response.json()
      setEmails(responseBody)
    })
  }, [])

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

  const selectEmail = (email: Email) => {
    fetch("http://localhost:3000/emails/gen_ai_summary", { 
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        message: email.full_content
      }),
      credentials: "include"
    }).then(async response => {
      var responseBody = await response.json()
      email.summary = responseBody.summary
    })
    fetch("http://localhost:3000/emails/gen_ai_draft", { 
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        message: email.full_content
      }),
      credentials: "include"
    }).then(async response => {
      var responseBody = await response.json()
      email.draft_subject = responseBody.draft_subject
      email.draft_response = responseBody.draft_body
    })
    setSelectedEmail(email)
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
                  key={email.email_id}
                  className="p-4 border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => selectEmail(email) }
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{email.from_sender}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge 
                        variant={email.email_status === "unread" ? "destructive" : 
                                email.email_status === "replied" ? "default" : "secondary"}
                      >
                        {email.email_status}
                      </Badge>
                      <span className="text-xs text-muted-foreground">{email.email_timestamp}</span>
                    </div>
                  </div>
                  <h3 className="font-medium mb-1">{ email.email_subject }</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">Preview</p>
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
                    <h3>Email #{selectedEmail.email_id}</h3>
                    <Badge 
                      variant={selectedEmail.email_status === "unread" ? "destructive" : 
                              selectedEmail.email_status === "replied" ? "default" : "secondary"}
                    >
                      {selectedEmail.email_status}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">From: {selectedEmail.from_sender}</p>
                </div>

                <div>
                  <h4>Full Email:</h4>
                  <div className="bg-muted p-3 rounded text-sm whitespace-pre-wrap">
                    {selectedEmail.full_content}
                  </div>
                </div>

                <div>
                  <h4>AI Summary:</h4>
                  <p className="text-sm text-muted-foreground">{selectedEmail.summary}</p>
                </div>

                <div>
                  <h4>Draft Response:</h4>
                  <div className="bg-muted p-3 rounded text-sm whitespace-pre-wrap">
                    {selectedEmail.draft_response}
                  </div>
                </div>

                <div>
                  <h4>Generated Task:</h4>
                  <p className="text-sm text-muted-foreground">{selectedEmail.task}</p>
                </div>

                <div className="flex flex-wrap gap-2 pt-4">
                  <Button 
                    onClick={() => sendReply(selectedEmail.email_id, selectedEmail.draft_response)}
                    className="flex items-center space-x-2"
                  >
                    <Send className="h-4 w-4" />
                    <span>Send Reply</span>
                  </Button>
                  
                  <Button 
                    variant="outline"
                    onClick={() => addToChecklist(selectedEmail.task, selectedEmail.email_id)}
                    className="flex items-center space-x-2"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Add to Checklist</span>
                  </Button>
                  
                  <Button 
                    variant="outline"
                    onClick={() => onOpenChat({ 
                      type: "email", 
                      id: selectedEmail.email_id, 
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