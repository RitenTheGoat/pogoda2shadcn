import {
    Avatar,
    AvatarFallback,
    AvatarImage,
  } from "@/components/ui/avatar";
  import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu";
  import PocketBase from "pocketbase";
  import { useEffect } from "react";
  import Login_form_dialog from "./login";
  
  const pb = new PocketBase("http://172.16.15.139:8080");
  
  export default function User_avatar({ onlogin, user, setuser }) {
    useEffect(() => {
      setuser(pb.authStore.model);
    }, []);
  
    const logout = () => {
      pb.authStore.clear();
      console.log(pb.authStore);
      setuser(null);
    };
  
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Avatar className="w-200 h-40">
            <AvatarImage
              src={user && pb.files.getUrl(user, user.avatar)}
              alt="@shadcn"
            />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>
            {user ? user.username : "Guest"}
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          {user ? (
            <DropdownMenuItem onClick={logout}>Log out</DropdownMenuItem>
          ) : (
            // Replace login with onlogin
            <DropdownMenuItem asChild>
              <Login_form_dialog onlogin={onlogin} />
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }
  