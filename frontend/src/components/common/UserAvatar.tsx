import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "@/types";

interface UserAvatarProps {
  user: User;
  className?: string;
}

const getInitials = (name: string) => {
  const names = name.trim().split(" ");
  return names.length >= 2
    ? names[0][0] + names[names.length - 1][0]
    : names[0][0] + names[0][1];
};

const UserAvatar = ({ user, className }: UserAvatarProps) => {
  return (
    <Avatar className={className}>
      {user.avatar && <AvatarImage src={user.avatar} alt={user.name} />}
      <AvatarFallback className="bg-bluedollar text-white">
        {getInitials(user.name).toLocaleUpperCase()}
      </AvatarFallback>
    </Avatar>
  );
};

export default UserAvatar;
