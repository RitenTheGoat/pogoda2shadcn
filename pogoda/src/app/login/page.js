import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"
  
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
  } from "@/components/ui/avatar"
  import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"
  
  export default function AvatarDemo() {
    return (
    




<DropdownMenu>
  <DropdownMenuTrigger>  <Avatar>
        <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar></DropdownMenuTrigger>
  <DropdownMenuContent className="flex flex-col start-">
    <DropdownMenuLabel>My Account</DropdownMenuLabel>
    <DropdownMenuSeparator />
    <DropdownMenuItem asChild>
        <Dialog >
  <DialogTrigger >login</DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle></DialogTitle>
      <DialogDescription>
        login
      </DialogDescription>
    </DialogHeader>
  </DialogContent>
</Dialog>
    </DropdownMenuItem>
    <DropdownMenuItem asChild>
        <Dialog >
  <DialogTrigger >logout</DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle></DialogTitle>
      <DialogDescription>
        logout
      </DialogDescription>
    </DialogHeader>
  </DialogContent>
</Dialog></DropdownMenuItem>
    <DropdownMenuItem asChild><Dialog >
  <DialogTrigger >ustawienia</DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle></DialogTitle>
      <DialogDescription>
        ustawienia
      </DialogDescription>
    </DialogHeader>
  </DialogContent>
</Dialog></DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>

    )
  }
  