"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import PocketBase from "pocketbase";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

// http://172.16.15.139/
const pb = new PocketBase("http://172.16.15.139:8080");

export default function AvatarDemo() {
  const router = useRouter();
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [zdj, setZdj] = useState(null);

  const handleUser = (e) => {
    setUser(e.target.value);
  };

  const handlePass = (e) => {
    setPass(e.target.value);
  };

  const handleButton = async () => {
    try {
      const authData = await pb.collection("users").authWithPassword(user, pass);
      if (authData) {
        console.log("Login successful:", pb.authStore.isValid);
        setZdj(pb.authStore.baseModel.avatar); // Assuming avatar is stored here
      }
    } catch (err) {
      console.error("Error during login:", err);
    }
  };

  const logout = async () => {
    pb.authStore.clear();
    setZdj(null);
    console.log("Logged out:", pb.authStore.isValid);
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("avatar", file);

    try {
      const updatedUser = await pb.collection("users").update(pb.authStore.model.id, formData);
      setZdj(updatedUser.avatar);
      console.log("Avatar updated successfully");
    } catch (error) {
      console.error("Error updating avatar:", error);
    }
  };

  const navigateToLog = () => {
    if (pb.authStore.isValid) {
      router.push("/login/log");
    } else {
      alert("You must be logged in to access this page.");
    }
  };

  return (
    <div className="w-full flex flex-row-reverse items-start">
    <DropdownMenu >
      <DropdownMenuTrigger>
        <Avatar>
          {zdj ? (
            <AvatarImage
              src={pb.files.getUrl(pb.authStore.model, zdj)}
              alt="User Avatar"
            />
          ) : (
            <AvatarFallback>CN</AvatarFallback>
          )}
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="flex flex-col start-">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />

        <DropdownMenuItem asChild>
          <Dialog>
            <DialogTrigger>Login</DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Login</DialogTitle>
                <DialogDescription>
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={user}
                    onChange={handleUser}
                    className="col-span-3"
                  />
                  <Label htmlFor="username">Password</Label>
                  <Input
                    id="username"
                    type="password"
                    value={pass}
                    onChange={handlePass}
                    className="col-span-3"
                  />
                  <Button onClick={handleButton}>Save changes</Button>
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <Dialog>
            <DialogTrigger>Settings</DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Change Avatar</DialogTitle>
                <DialogDescription>
                  <Input
                    type="file"
                    onChange={handleAvatarChange}
                  />
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <Button onClick={logout}>Logout</Button>
        </DropdownMenuItem>

        {/* Navigate to Log Page Button */}
        <DropdownMenuItem asChild>
          <Button onClick={navigateToLog}>Go to Log Page</Button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
    </div>
  );
}
