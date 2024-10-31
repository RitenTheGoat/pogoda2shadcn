"use client"
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Timer } from 'lucide-react';
import Image from 'next/image';
import PocketBase from 'pocketbase';
import { useEffect, useState } from 'react';
import Delitem from '@/components/pocketbase/delitem';
import EditItem from '@/components/pocketbase/edititem';

const pb = new PocketBase('http://172.16.15.139:8080');

export default function Home(){
    const [samochody,setsamochody] = useState(null)
    const [dane,setdane] = useState({marka: null, model: null, czas_parkowania: null})
    const [zdj,setzdj] = useState(null)

useEffect(()=>{



    const getData = async ()=>{
        try{
            const records = await pb.collection('samochody').getFullList({
                sort: '-created',
            });
        console.log(records)
        setsamochody(records)
        }catch(err){

        }finally{

        }
        
    }

getData()
},[])

const handleInpuChange = (id, e) => {
    setdane((prev) => ({
        ...prev,
        [id]: e.target.value
    }));
    console.log(dane)
}


const handleSubmit =async ()=>{
    const formData = new FormData()

    formData.append("marka",dane.marka)
    formData.append("model",dane.model)
    formData.append("czas_parkowania",dane.czas_parkowania)
    formData.append("zdjecie",zdj)

    try{
        const record = await pb.collection('samochody').create(formData);
        setsamochody((prev)=>([
            ...prev,
            record
        ]))
    }catch(err){

    }

}

const handleZdj = (e)=>{
    console.log(e)
    setzdj(e.target.files[0])
}

const deleted = (id)=>{
    setsamochody((prev)=>
    prev.filter((el)=>{
        return el.id != id
    })
    )
}

const updated = (item)=>{
 console.log(item)
 var index = null
 var tmpsamochody = [...samochody]
 for(let i in samochody){
    if(samochody[i].id == item.id){
        index = i
    }
    tmpsamochody[index] = item
    setsamochody(tmpsamochody)
    console.log("index: " + index)
 }
}





    return(
        <div>

{            

            samochody &&
            <div className='flex flex-wrap w-full justify-center gap-5'>
            {samochody.map((samochod)=>(
                    <Card key={samochod.id} className="w-[300px] h-[300px]">
                <CardTitle>{samochod.marka}</CardTitle>
                <CardDescription>{samochod.model}</CardDescription>
                <CardContent className="p-0 m-0">
                    <Image
                    src={pb.files.getUrl(samochod, samochod.zdjecie)}
                    alt={samochod.zdjecie}
                    height={500}
                    width={500}
                    className='rounded-mb'
                    />
                </CardContent>
                <CardFooter>
                    <div>

                        <div className='w-full flex justify-between'>
                        <Delitem id={samochod.id} ondeleted={deleted}/>
                        <EditItem item={samochod} onupdated={updated}/>
                        </div>



                        <div className='flex justify-end w-[100%]'>
                        <Timer/>
                        <p>czas parkowania</p>
                        {samochod.czas_parkowania}
                         </div>

                    </div>
                    
                   
                   </CardFooter>
            </Card>
                
            ))}
            </div>
            }
<div className='mt-5 flex flex-col w-full items-center flex-wrap gap-5'>
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <Label htmlFor="marka">marka</Label>
      <Input onChange={(e)=> {handleInpuChange("marka",e)}} type="text" id="marka" placeholder="marka" />
    </div>

    <div className="grid w-full max-w-sm items-center gap-1.5">
      <Label htmlFor="model">model</Label>
      <Input onChange={(e)=> {handleInpuChange("model",e)}} type="text" id="model" placeholder="model" />
    </div>

    <div className="grid w-full max-w-sm items-center gap-1.5">
      <Label htmlFor="czas_parkowania">czas parkowania</Label>
      <Input onChange={(e)=> {handleInpuChange("czas_parkowania",e)}} type="text" id="czas_parkowania" placeholder="czas_parkowania" />
    </div>

    <div className="grid w-full max-w-sm items-center gap-1.5">
      <Label htmlFor="zdjecie">zdjecie</Label>
      <Input onChange={(e)=> {handleZdj(e)}} type="file" id="zdjecie" placeholder="zdjecie" />
    </div>
    <div>
        <Button onClick= {handleSubmit} className="w-full">Dodaj</Button>
    </div>
    
</div>
            {/*samochody &&
            <Card className="w-[300px] h-[300px]">
                <CardTitle>{samochody[0].marka}</CardTitle>
                <CardDescription>{samochody[0].model}</CardDescription>
                <CardContent className="p-0 m-0">
                    <Image
                    src={pb.files.getUrl(samochody[0], samochody[0].zdjecie)}
                    alt={samochody[0].zdjecie}
                    height={500}
                    width={500}
                    className='rounded-mb'
                    />
                </CardContent>
                <CardFooter>
                    <div className='flex justify-end w-[100%]'>
                        <Timer/>
                        <p>czas parkowania</p>
                        {samochody[0].czas_parkowania}
                    </div>
                   </CardFooter>
            </Card>
                
            */}
        </div>
    )
}