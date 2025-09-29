import { useState } from "react"
import { Sidebar } from "./components/Sidebar"
import { Dashboard } from "./components/Dashboard"
import { EmailPage } from "./components/EmailPage"
import { Checklist } from "./components/Checklist"
import { Chat } from "./components/Chat"

export default function App() {
  const [activeTab, setActiveTab] = useState("dashboard")
  const [chatContext, setChatContext] = useState<{ type?: string; id?: string; data?: any }>({})

  const openChat = (context: { type?: string; id?: string; data?: any } = {}) => {
    setChatContext(context)
    setActiveTab("chat")
  }

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <Dashboard />
      case "email":
        return <EmailPage onOpenChat={openChat} />
      case "checklist":
        return <Checklist onOpenChat={openChat} />
      case "chat":
        return <Chat context={chatContext} />
      default:
        return <Dashboard />
    }
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
      <main className="flex-1 overflow-hidden">
        <div style={{overflowY: "scroll", height: "100vh"}}>
          {renderContent()}
        </div>
      </main>
    </div>
  )
}