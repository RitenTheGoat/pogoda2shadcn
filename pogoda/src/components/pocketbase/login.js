import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useEffect, useState } from "react"
import PocketBase from 'pocketbase';

const pb = new PocketBase('http://172.16.15.139:8080');


export default function Login_form_dialog({onlogin}) {
  const [user,setuser] = useState(null)
  const [pass,setpass] = useState(null)
  const [error,seterror] = useState(false)
	const [open, setOpen] = useState(false);
  useEffect(()=>{seterror(false)},[open])



  const handleUser = (e)=>{
    setuser(e.target.value)
  }

  const handlePass = (e)=>{
    setpass(e.target.value)
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
      seterror(true)
    }
    
  onlogin()
  }


  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        Edit Profile
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
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
              onChange={(e)=>{
                handlePass(e)
              }}
            />
          </div>
        </div>
        <DialogFooter >
<div className="flex flex-col w-full">
        {error && <p className="mt-1">nie udało sie zalogowac</p>}

          <Button onClick={handleButton}>Save changes</Button>
</div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
