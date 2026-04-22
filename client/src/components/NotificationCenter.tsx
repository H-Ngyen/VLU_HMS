import React from "react";
import { Bell, Check, Info, AlertTriangle, AlertCircle } from "lucide-react";
import { useNotifications } from "@/contexts/NotificationContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";
import { useNavigate } from "react-router-dom";

export const NotificationCenter: React.FC = () => {
  const { notifications, unreadCount, markAsRead, markAllAsRead, fetchNotifications } = useNotifications();
  const navigate = useNavigate();

  const handleOpenChange = (open: boolean) => {
      if (open) {
          fetchNotifications();
      }
  };

  const getIcon = (type: number) => {
    switch (type) {
      case 1: return <Info className="h-4 w-4 text-blue-500" />;
      case 2: return <Check className="h-4 w-4 text-green-500" />;
      case 3: return <AlertTriangle className="h-4 w-4 text-orange-500" />;
      case 4: return <AlertCircle className="h-4 w-4 text-red-500" />;
      default: return <Bell className="h-4 w-4 text-gray-500" />;
    }
  };

  const handleNotificationClick = async (n: any) => {
    if (!n.isRead) {
      await markAsRead(n.id);
    }
    
    // Logic to navigate if content contains record info or similar
    // For now, let's just mark as read.
    // In the future, we could have a 'targetUrl' in the notification DTO.
    if (n.notification.appContent.includes("/record/edit/")) {
        const match = n.notification.appContent.match(/\/record\/edit\/[^\s]+/);
        if (match) {
            navigate(match[0]);
        }
    }
  };

  return (
    <DropdownMenu onOpenChange={handleOpenChange}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-[10px]"
            >
              {unreadCount > 99 ? "99+" : unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 p-0">
        <div className="flex items-center justify-between p-4 border-b">
          <DropdownMenuLabel className="p-0 font-bold">Thông báo</DropdownMenuLabel>
          {unreadCount > 0 && (
            <Button 
                variant="ghost" 
                size="sm" 
                className="h-auto p-0 text-xs text-vlu-red hover:bg-transparent"
                onClick={(e) => {
                    e.preventDefault();
                    markAllAsRead();
                }}
            >
              Đánh dấu tất cả đã đọc
            </Button>
          )}
        </div>
        <ScrollArea className="h-[400px]">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 px-4 text-center">
              <Bell className="h-10 w-10 text-gray-200 mb-2" />
              <p className="text-sm text-gray-500">Chưa có thông báo nào</p>
            </div>
          ) : (
            notifications.map((n) => (
              <DropdownMenuItem
                key={n.id}
                className={cn(
                  "flex flex-col items-start gap-1 p-4 cursor-pointer focus:bg-gray-50",
                  !n.isRead && "bg-vlu-red/5"
                )}
                onClick={() => handleNotificationClick(n)}
              >
                <div className="flex w-full items-start gap-2">
                  <div className="mt-1 shrink-0">{getIcon(n.notification?.type || 0)}</div>
                  <div className="flex-1 space-y-1">
                    <p className={cn("text-sm font-medium leading-none", !n.isRead && "font-bold text-gray-900")}>
                      {n.notification?.appTitle || "Thông báo"}
                    </p>
                    <p className="text-xs text-gray-500 line-clamp-2">
                      {n.notification?.appContent || "Không có nội dung"}
                    </p>
                    <p className="text-[10px] text-gray-400">
                      {n.notification?.createdAt ? formatDistanceToNow(new Date(n.notification.createdAt), {
                        addSuffix: true,
                        locale: vi,
                      }) : "Vừa xong"}
                    </p>
                  </div>
                  {!n.isRead && (
                    <div className="h-2 w-2 rounded-full bg-vlu-red shrink-0 mt-1" />
                  )}
                </div>
              </DropdownMenuItem>
            ))
          )}
        </ScrollArea>
        <DropdownMenuSeparator className="m-0" />
        <div className="p-2">
            <Button variant="ghost" className="w-full text-xs text-gray-500 h-8" disabled>
                Xem tất cả thông báo
            </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
