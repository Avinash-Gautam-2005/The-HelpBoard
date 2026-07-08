"use client"

import type React from "react"

import { useEffect, useState, useRef } from "react"
import { useParams } from "next/navigation"
import { useChatStore } from "../../../store/chatStore"
import { useAuthStore } from "../../../store/authStore"
import ProtectedRoute from "../../../components/ProtectedRoute"
import ChatBubble from "../../../components/ChatBubble"
import Loader from "../../../components/Loader"
import { createStompClient } from "../../../lib/stompClient"
import { api } from "../../../lib/api"
import type { Client } from "@stomp/stompjs"
import toast from "react-hot-toast"

export default function ChatPage() {
  const params = useParams()
  const requestId = Number(params.requestId)
  const { user, token } = useAuthStore()
  const { messages, loadMessages, addMessage, clearMessages } = useChatStore()
  const [isLoading, setIsLoading] = useState(true)
  const [messageInput, setMessageInput] = useState("")
  const [stompClient, setStompClient] = useState<Client | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [requestDetail, setRequestDetail] = useState<any>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const initChat = async () => {
      try {
        const reqResponse = await api.get(`/requests/${requestId}`)
        setRequestDetail(reqResponse.data)

        await loadMessages(requestId)

        if (token && reqResponse.data.status === "APPROVED") {
          const client = createStompClient(token)

          client.onConnect = () => {
            console.log("[v0] STOMP connected")
            setIsConnected(true)

            client.subscribe(`/topic/requests/${requestId}`, (message) => {
              const receivedMessage = JSON.parse(message.body)
              console.log("[v0] Received message:", receivedMessage)
              // Map backend field names to frontend field names
              const mappedMessage = {
                id: receivedMessage.messageId,
                requestId: receivedMessage.requestId,
                senderId: receivedMessage.senderId,
                senderName: receivedMessage.senderName,
                content: receivedMessage.messageText,
                timestamp: receivedMessage.timestamp,
              }
              addMessage(mappedMessage)
            })
          }

          client.onDisconnect = () => {
            console.log("[v0] STOMP disconnected")
            setIsConnected(false)
          }

          client.onStompError = (frame) => {
            console.error("[v0] STOMP error:", frame)
            setIsConnected(false)
            toast.error("Connection error. Please refresh the page.")
          }

          client.onWebSocketClose = () => {
            console.log("[v0] WebSocket closed")
            setIsConnected(false)
          }

          client.activate()
          setStompClient(client)
        }
      } catch (error) {
        console.error("Failed to initialize chat:", error)
        toast.error("Failed to load chat")
      } finally {
        setIsLoading(false)
      }
    }

    initChat()

    return () => {
      if (stompClient) {
        stompClient.deactivate()
        setIsConnected(false)
      }
      clearMessages()
    }
  }, [requestId, token])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSendMessage = () => {
    if (!messageInput.trim() || !stompClient || !isConnected) {
      console.warn("Cannot send message:", { 
        hasInput: !!messageInput.trim(), 
        hasClient: !!stompClient, 
        isConnected: isConnected 
      })
      return
    }

    try {
      const messagePayload = { messageText: messageInput.trim() }
      console.log("[v0] Sending message:", messagePayload)
      console.log("[v0] Destination:", `/app/requests/${requestId}/send`)
      
      stompClient.publish({
        destination: `/app/requests/${requestId}/send`,
        body: JSON.stringify(messagePayload),
      })
      setMessageInput("")
      console.log("[v0] Message sent successfully")
    } catch (error) {
      console.error("[v0] Failed to send message:", error)
      toast.error("Failed to send message")
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  if (isLoading) {
    return (
      <ProtectedRoute>
        <Loader />
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="card h-[calc(100vh-12rem)] flex flex-col">
          <div className="border-b pb-4 mb-4">
            <h1 className="text-2xl font-bold text-gray-900">Chat - Request #{requestId}</h1>
            <p className="text-sm text-gray-500">
              {requestDetail?.status === "APPROVED"
                ? (isConnected ? "🟢 Connected" : "🔴 Disconnected")
                : `🔒 Chat Locked (Request is ${requestDetail?.status || 'PENDING'})`
              }
            </p>
          </div>

          <div className="flex-1 overflow-y-auto mb-4 space-y-2">
            {requestDetail && requestDetail.status !== "APPROVED" && (
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <span className="text-yellow-700">⚠️</span>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-yellow-700">
                      {requestDetail.status === "PENDING"
                        ? "This request is pending approval. Chat will become available once the item owner approves the request."
                        : requestDetail.status === "REJECTED"
                        ? "This request has been rejected. Chat is disabled."
                        : `This request is ${requestDetail.status}. Chat is disabled.`}
                    </p>
                  </div>
                </div>
              </div>
            )}
            {messages.length === 0 ? (
              <p className="text-center text-gray-500 py-8">No messages yet. Start the conversation!</p>
            ) : (
              messages.map((message) => (
                <ChatBubble
                  key={message.id}
                  content={message.content}
                  senderName={message.senderName}
                  timestamp={message.timestamp}
                  isOwnMessage={message.senderId === user?.id}
                />
              ))
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              className="input-field flex-1"
              disabled={!isConnected || requestDetail?.status !== "APPROVED"}
            />
            <button
              onClick={handleSendMessage}
              disabled={!messageInput.trim() || !stompClient?.connected || requestDetail?.status !== "APPROVED"}
              className="btn-primary px-6"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}
