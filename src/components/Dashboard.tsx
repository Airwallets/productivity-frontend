import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Mail, Send, Clock, CheckCircle } from "lucide-react"

const emailData = [
  { day: "Mon", sent: 12, received: 24 },
  { day: "Tue", sent: 8, received: 19 },
  { day: "Wed", sent: 15, received: 32 },
  { day: "Thu", sent: 20, received: 28 },
  { day: "Fri", sent: 18, received: 35 },
  { day: "Sat", sent: 5, received: 12 },
  { day: "Sun", sent: 3, received: 8 },
]

const stats = [
  {
    title: "Unread Emails",
    value: "6",
    icon: Mail,
    color: "text-red-500",
    bgColor: "bg-red-50",
    change: "+2 from yesterday"
  },
  {
    title: "Emails Sent",
    value: "23",
    icon: Send,
    color: "text-blue-500",
    bgColor: "bg-blue-50",
    change: "+5 from yesterday"
  },
  {
    title: "Emails Received",
    value: "42",
    icon: Mail,
    color: "text-green-500",
    bgColor: "bg-green-50",
    change: "+8 from yesterday"
  },
  {
    title: "Daily Tasks",
    value: "12",
    icon: CheckCircle,
    color: "text-purple-500",
    bgColor: "bg-purple-50",
    change: "3 completed today"
  },
]

export function Dashboard() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1>Dashboard</h1>
        <p className="text-muted-foreground">Daily email summary and insights</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.title}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.title}</p>
                    <p className="text-2xl">{stat.value}</p>
                    <p className="text-xs text-muted-foreground mt-1">{stat.change}</p>
                  </div>
                  <div className={`p-3 rounded-full ${stat.bgColor}`}>
                    <Icon className={`h-5 w-5 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Email Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={emailData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="sent" fill="hsl(var(--chart-1))" name="Sent" />
              <Bar dataKey="received" fill="hsl(var(--chart-2))" name="Received" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <p className="text-sm">Replied to john@company.com</p>
                <span className="text-xs text-muted-foreground">2 mins ago</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <p className="text-sm">New email from sarah@client.com</p>
                <span className="text-xs text-muted-foreground">5 mins ago</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                <p className="text-sm">Task added: Follow up on proposal</p>
                <span className="text-xs text-muted-foreground">10 mins ago</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <p className="text-sm">Sent email to team@company.com</p>
                <span className="text-xs text-muted-foreground">15 mins ago</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Upcoming Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <div className="flex-1">
                  <p className="text-sm">Follow up on Q4 budget proposal</p>
                  <p className="text-xs text-muted-foreground">Due: Today 3:00 PM</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <div className="flex-1">
                  <p className="text-sm">Schedule meeting with client</p>
                  <p className="text-xs text-muted-foreground">Due: Tomorrow</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <div className="flex-1">
                  <p className="text-sm">Prepare monthly report</p>
                  <p className="text-xs text-muted-foreground">Due: Friday</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}