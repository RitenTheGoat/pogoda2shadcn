import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Pencil } from "lucide-react"
import { useState } from "react"
import PocketBase from 'pocketbase';
import Image from 'next/image';


export default function DialogDemo({item, onupdated}) {
    const [dane,setdane] = useState({marka: item.marka, model: item.model, czas_parkowania: item.czas_parkowania})
    const [zdj,setzdj] = useState(null)

    const pb = new PocketBase('http://172.16.15.139:8080');

    const handleInpuChange = (id, e) => {
        setdane((prev) => ({
            ...prev,
            [id]: e.target.value
        }));
        console.log(dane)
    }
    
    const handleZdj = (e)=>{
     console.log(e)
     setzdj(e.target.files[0])
    }


    const update = async ()=>{
        const formData = new FormData()

    formData.append("marka",dane.marka)
    formData.append("model",dane.model)
    formData.append("czas_parkowania",dane.czas_parkowania)
    if(zdj){
    formData.append("zdjecie",zdj)
    }
        const record = await pb.collection('samochody').update(item.id, formData);

        onupdated(record)
    }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline"><Pencil/></Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle><Pencil/></DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
   
          <div className="grid w-full max-w-sm items-center gap-1.5">
      <Label htmlFor="marka">marka</Label>
      <Input defaultValue={item.marka} onChange={(e)=> {handleInpuChange("marka",e)}} type="text" id="marka" placeholder="marka" />
    </div>

    <div className="grid w-full max-w-sm items-center gap-1.5">
      <Label htmlFor="model">model</Label>
      <Input defaultValue={item.model} onChange={(e)=> {handleInpuChange("model",e)}} type="text" id="model" placeholder="model" />
    </div>

    <div className="grid w-full max-w-sm items-center gap-1.5">
      <Label htmlFor="czas_parkowania">czas parkowania</Label>
      <Input defaultValue={item.czas_parkowania} onChange={(e)=> {handleInpuChange("czas_parkowania",e)}} type="text" id="czas_parkowania" placeholder="czas_parkowania" />
    </div>

<div>
<Image
     src={pb.files.getUrl(item, item.zdjecie)}
     alt={item.zdjecie}
     height={500}
     width={500}
     className='rounded-mb'
    />
</div>


    <div className="grid w-full max-w-sm items-center gap-1.5">
      <Label htmlFor="zdjecie">zdjecie</Label>
      <Input  onChange={(e)=> {handleZdj(e)}} type="file" id="zdjecie" placeholder="zdjecie" />
    </div>
          
        <DialogFooter>
        <DialogClose asChild>

          <Button onClick={update}>Save changes</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
