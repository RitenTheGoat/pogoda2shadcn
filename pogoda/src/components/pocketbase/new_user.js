import { useState,useEffect } from "react";
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import PocketBase from 'pocketbase';





const pb = new PocketBase('http://172.16.15.139:8080');

export default function New_user({setOpen}){
    const [user,setuser] = useState(null)
    const [pass1,setpass1] = useState(null)
    const [pass2,setpass2] = useState(null)
    const [zdj,setzdj] = useState(null)
    const [error,seterror] = useState(false)

   
  const handleUser = (e)=>{
    setuser(e.target.value)
  }

  const handlePass1 = (e)=>{
    setpass1(e.target.value)
  }
  const handlePass2 = (e)=>{
    setpass2(e.target.value)
  }

  const handleButton = async (e)=>{
    console.log(user)
    console.log(pass1)
    console.log(pass2)

    const formData= new FormData()

    formData.append("username",user)
    formData.append("password",pass1)
    formData.append("passwordConfirm",pass2)
    if(zdj){
        formData.append("avatar",zdj)
    }


    try{
      const record = await pb.collection('users').create(formData);
        setOpen()
        
    }catch(err){
      seterror(true)
    }
    

  }
  const handleZdj = (e)=>{
    console.log(e)
    setzdj(e.target.files[0])
}
    return(
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
              password
            </Label>
            <Input
              id="username"
              defaultValue=""
              className="col-span-3"
              type="password"
              onChange={(e)=>{
                handlePass1(e)
              }}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="text-right">
              confirm password
            </Label>
            <Input
              id="username"
              defaultValue=""
              className="col-span-3"
              type="password"
              onChange={(e)=>{
                handlePass2(e)
              }}
            />
            <Label htmlFor="zdjecie">zdjecie</Label>
            <Input onChange={(e)=> {handleZdj(e)}} type="file" id="zdjecie" placeholder="zdjecie" />
          </div>
          <Button onClick={handleButton}>New user</Button>
        </div>
    )
}