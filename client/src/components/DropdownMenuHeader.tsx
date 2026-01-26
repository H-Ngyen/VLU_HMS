import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

interface DropdownMenuHeaderProps {
  user: {
    name: string;
    avatar: string;
  };
}

export function DropdownMenuHeader({ user }: DropdownMenuHeaderProps) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-sm font-medium hidden sm:inline-block">{user.name}</span>
      <Avatar className="h-8 w-8">
        <AvatarImage src={user.avatar} alt={user.name} />
        <AvatarFallback className="bg-red-700 text-white font-bold text-xs">
          {user.name.split(" ").pop()?.charAt(0)}
        </AvatarFallback>
      </Avatar>
    </div>
  );
}
