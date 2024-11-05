"use client"
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardTitle } from '@/components/ui/card';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"
import { Input } from '@/components/ui/input';
  import { Switch } from "@/components/ui/switch"
  import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
  } from "@/components/ui/sheet"
  
import Image from 'next/image';
import PocketBase from 'pocketbase';
import { useEffect, useState } from 'react';

const pb = new PocketBase('http://172.16.15.139:8080');

export default function Home(){
    const [gry,setgry] = useState(null)
    

useEffect(()=>{



    const getData = async ()=>{
        try{
            const records = await pb.collection('gry').getFullList({
                sort: '-created',
            });
        console.log(records)
        setgry(records)
        }catch(err){

        }finally{

        }
        
    }

getData()
},[])







    return(
        <div>

{            
            gry &&
            <div className='flex flex-wrap w-full justify-center gap-5'>
            {gry.map((gra)=>(
                    <Card key={gra.id} className="w-[500px] h-[500px]">
                <CardTitle><Image
                    src={pb.files.getUrl(gra, gra.zdj)}
                    alt={gra.zdj}
                    height={500}
                    width={500}
                    className='rounded-mb'
                    /> </CardTitle>
                <CardContent>{gra.nazwa} <br/>{gra.cena}</CardContent>
                <CardDescription>
                {gra.opis}
                </CardDescription>
               
               
                <CardFooter>
                <DropdownMenu>
  <DropdownMenuTrigger>...</DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuSeparator />
    <DropdownMenuItem>edycja</DropdownMenuItem>
    <DropdownMenuItem>usun</DropdownMenuItem>
   
  </DropdownMenuContent>
</DropdownMenu>

<Switch/>
                   </CardFooter>
            </Card>
                
            ))}

            
            <Sheet>
            
  <SheetTrigger>
    <Card className="flex items-center justify-center w-[500px] h-[500px]">
<h1>+</h1>
    </Card>

  </SheetTrigger>
  <SheetContent>
    <SheetHeader>
      <SheetTitle>dodawanie</SheetTitle>
      <SheetDescription>
        
      </SheetDescription>
    </SheetHeader>
  </SheetContent>

</Sheet>
            </div>
            }

        </div>
    )
}