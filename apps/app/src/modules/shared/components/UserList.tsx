import { Card, CardContent, CardHeader } from "@/shadcn/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/shadcn/custom/avatar";
import { Badge } from "@/shadcn/ui/badge";
import type { User } from "@shared-types/db";

export const UserList = ({ userList }: { userList: User[] }) => {
  return (
    <div className="grid gap-4 grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
      {userList.map((user) => (
        <Card key={user.id} className="shadow-sm border">
          <CardHeader className="flex items-center gap-4">
            <Avatar>
              <AvatarImage src={user.image ?? ""} alt={user.name} />
              <AvatarFallback>{user.name?.[0] ?? "?"}</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-lg font-semibold">{user.name}</h3>
              <p className="text-sm text-muted-foreground">{user.email}</p>
            </div>
            {user.banned && (
              <Badge variant="destructive" className="ml-auto">
                Заблокирован
              </Badge>
            )}
            {!user.banned && (
              <Badge variant="outline" className="ml-auto">
                Активен
              </Badge>
            )}
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            <div className="flex gap-2">
              <span>Роль: {user.role ?? "—"}</span>
              <span>Аноним: {user.isAnonymous ? "Да" : "Нет"}</span>
              {user.banReason && <span>Причина блокировки: {user.banReason}</span>}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
