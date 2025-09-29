import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { Badge } from "./ui/badge"
import { Checkbox } from "./ui/checkbox"
import { ExternalLink, MessageSquare, Calendar, Clock } from "lucide-react"

interface Task {
  task_id: string
  title: string
  task_description: string
  task_priority: "high" | "medium" | "low"
  due_date: string
  completed: boolean
  email_id?: string
  created_at: string
}

const mockTasks: Task[] = [
  {
    id: "task-1",
    title: "Schedule meeting with John to discuss Q4 budget concerns",
    description: "Follow up on John's questions about marketing allocation and IT infrastructure budget",
    priority: "high",
    dueDate: "2024-01-16",
    completed: false,
    emailId: "email-1",
    createdAt: "2024-01-15"
  },
  {
    id: "task-2",
    title: "Schedule call with Sarah to discuss revised project timeline",
    description: "Client needs to delay project by 2 weeks due to dependencies",
    priority: "high",
    dueDate: "2024-01-16",
    completed: false,
    emailId: "email-2",
    createdAt: "2024-01-15"
  },
  {
    id: "task-3",
    title: "Review action items from team meeting and coordinate with IT team",
    description: "Follow up on infrastructure assessment for new projects",
    priority: "medium",
    dueDate: "2024-01-18",
    completed: true,
    emailId: "email-3",
    createdAt: "2024-01-15"
  },
  {
    id: "task-4",
    title: "Prepare monthly performance report",
    description: "Compile data from all departments for monthly review",
    priority: "medium",
    dueDate: "2024-01-20",
    completed: false,
    createdAt: "2024-01-14"
  },
  {
    id: "task-5",
    title: "Follow up on client contract renewal",
    description: "Contract expires end of month, need to start renewal process",
    priority: "low",
    dueDate: "2024-01-25",
    completed: false,
    createdAt: "2024-01-13"
  }
]

interface ChecklistProps {
  onOpenChat: (context: { type: string; id: string; data: any }) => void
}

export function Checklist({ onOpenChat }: ChecklistProps) {
  const [tasks, setTasks] = useState<Task[]>(mockTasks)

  const toggleTask = (taskId: string) => {
    setTasks(tasks.map(task => 
      task.task_id === taskId ? { ...task, completed: !task.completed } : task
    ))
  }

  const openGmail = (emailId?: string) => {
    if (emailId) {
      // In a real app, this would open Gmail with the specific email
      window.open(`https://mail.google.com`, "_blank")
    } else {
      window.open("https://mail.google.com", "_blank")
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "bg-red-100 text-red-800"
      case "medium": return "bg-yellow-100 text-yellow-800"
      case "low": return "bg-green-100 text-green-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const getDueDateStatus = (dueDate: string) => {
    const today = new Date()
    const due = new Date(dueDate)
    const diffTime = due.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays < 0) return { status: "overdue", color: "text-red-600" }
    if (diffDays === 0) return { status: "due today", color: "text-orange-600" }
    if (diffDays === 1) return { status: "due tomorrow", color: "text-yellow-600" }
    return { status: `due in ${diffDays} days`, color: "text-gray-600" }
  }

  const incompleteTasks = tasks.filter(task => !task.completed)
  const completedTasks = tasks.filter(task => task.completed)

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1>Task Checklist</h1>
        <p className="text-muted-foreground">Manage your email-generated tasks and to-dos</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Tasks</p>
                <p className="text-2xl">{tasks.length}</p>
              </div>
              <Calendar className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending</p>
                <p className="text-2xl">{incompleteTasks.length}</p>
              </div>
              <Clock className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Completed</p>
                <p className="text-2xl">{completedTasks.length}</p>
              </div>
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600">✓</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        {incompleteTasks.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Pending Tasks ({incompleteTasks.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {incompleteTasks.map((task) => {
                  const dueDateInfo = getDueDateStatus(task.due_date)
                  return (
                    <div key={task.task_id} className="border rounded-lg p-4">
                      <div className="flex items-start space-x-3">
                        <Checkbox
                          checked={task.completed}
                          onCheckedChange={() => toggleTask(task.task_id)}
                          className="mt-1"
                        />
                        
                        <div className="flex-1 space-y-2">
                          <div className="flex items-start justify-between">
                            <h3 className="font-medium">{task.title}</h3>
                            <div className="flex items-center space-x-2">
                              <Badge 
                                variant="secondary" 
                                className={getPriorityColor(task.task_priority)}
                              >
                                {task.task_priority}
                              </Badge>
                            </div>
                          </div>
                          
                          <p className="text-sm text-muted-foreground">{task.task_description}</p>
                          
                          <div className="flex items-center justify-between">
                            <span className={`text-xs ${dueDateInfo.color}`}>
                              {dueDateInfo.status}
                            </span>
                            
                            <div className="flex items-center space-x-2">
                              {task.email_id && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => openGmail(task.email_id)}
                                  className="flex items-center space-x-1"
                                >
                                  <ExternalLink className="h-3 w-3" />
                                  <span>Gmail</span>
                                </Button>
                              )}
                              
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => onOpenChat({ 
                                  type: "task", 
                                  id: task.task_id, 
                                  data: task 
                                })}
                                className="flex items-center space-x-1"
                              >
                                <MessageSquare className="h-3 w-3" />
                                <span>Chat</span>
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {completedTasks.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Completed Tasks ({completedTasks.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {completedTasks.map((task) => (
                  <div key={task.task_id} className="border rounded-lg p-4 opacity-75">
                    <div className="flex items-start space-x-3">
                      <Checkbox
                        checked={task.completed}
                        onCheckedChange={() => toggleTask(task.task_id)}
                        className="mt-1"
                      />
                      
                      <div className="flex-1 space-y-2">
                        <div className="flex items-start justify-between">
                          <h3 className="font-medium line-through">{task.title}</h3>
                          <Badge variant="default" className="bg-green-100 text-green-800">
                            completed
                          </Badge>
                        </div>
                        
                        <p className="text-sm text-muted-foreground">{task.task_description}</p>
                        
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500">
                            Completed
                          </span>
                          
                          <div className="flex items-center space-x-2">
                            {task.email_id && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => openGmail(task.email_id)}
                                className="flex items-center space-x-1"
                              >
                                <ExternalLink className="h-3 w-3" />
                                <span>Gmail</span>
                              </Button>
                            )}
                            
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => onOpenChat({ 
                                type: "task", 
                                id: task.task_id, 
                                data: task 
                              })}
                              className="flex items-center space-x-1"
                            >
                              <MessageSquare className="h-3 w-3" />
                              <span>Chat</span>
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}