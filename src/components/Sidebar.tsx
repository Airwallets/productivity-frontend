import { BarChart3, Mail, CheckSquare, MessageSquare } from "lucide-react"
import { Button } from "./ui/button"
import { useEffect, useState } from "react"

interface SidebarProps {
  activeTab: string
  onTabChange: (tab: string) => void
}

interface User {
  name: string,
  email: string
}

const menuItems = [
  { id: "dashboard", label: "Dashboard", icon: BarChart3 },
  { id: "email", label: "Email", icon: Mail },
  { id: "checklist", label: "Checklist", icon: CheckSquare },
  { id: "chat", label: "Chat", icon: MessageSquare },
]

export function Sidebar({ activeTab, onTabChange }: SidebarProps) {
  useEffect(() => {
    fetch("http://localhost:3000/users/me", { method: "GET", credentials: "include"}).then(async response => {
      if (!response.ok) {
        window.location.href = "http://localhost:3000/oauth/login"      
        return
      }      
      var responseJson = await response.json()
      setUser(responseJson)
    }).catch(() => {
      console.log("ERROR")
    })
  }, [])

  const [user, setUser] = useState<User>({name: "Login", email: ""})

  return (
    <div className="w-64 bg-sidebar border-r border-sidebar-border p-4">
      <div className="mb-8">
        <h1 className="text-sidebar-foreground">{ user?.name }</h1>
        <p className="text-sm text-sidebar-foreground/60">{ user?.email }</p>
      </div>
      
      <nav className="space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon
          return (
            <Button
              key={item.id}
              variant={activeTab === item.id ? "default" : "ghost"}
              className={`w-full justify-start ${
                activeTab === item.id 
                  ? "bg-sidebar-primary text-sidebar-primary-foreground" 
                  : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              }`}
              onClick={() => onTabChange(item.id)}
            >
              <Icon className="mr-3 h-4 w-4" />
              {item.label}
            </Button>
          )
        })}
      </nav>
    </div>
  )
}