"use client"
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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import PocketBase from 'pocketbase';

const pb = new PocketBase('http://172.16.15.139:8080');
  export default function AvatarDemo() {
    const [user,setuser] = useState(null)
    const [pass,setpass] = useState(null)
    const handleUser = (e)=>{
      setuser(e.target.value)
      console.log(user)
    }
  
    const handlePass = (e)=>{
      setpass(e.target.value)
      console.log(pass)
    }
    const handleButton = async (e)=>{
      console.log(user)
      console.log(pass)
  
      try{
        const authData = await pb.collection('users').authWithPassword(
          user,
          pass,
          
      );
      }catch(err){
      }
      
    }

    const logout = async (e)=>{
      console.log(user)
      console.log(pass)
  
      try{
        pb.authStore.clear();

      }catch(err){
      }
      
    }

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
        <div>
      <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input
              id="name"
              defaultValue=""
              className="col-span-3"
              onChange={(e)=>{
                handleUser(e)
              }}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="text-right">
              Username
            </Label>
            <Input
              id="username"
              defaultValue=""
              className="col-span-3"
              type="password"
              onChange={(e)=>{
                handlePass(e)
              }}
            />
            </div>
            <Button onClick={handleButton}>Save changes</Button>

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
  <Button onClick={logout}>logout</Button>
  <DialogContent>
    <DialogHeader>
      <DialogTitle></DialogTitle>
      <DialogDescription>
      </DialogDescription>
    </DialogHeader>
  </DialogContent>
</Dialog></DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>

    )
  }
  