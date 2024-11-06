"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardTitle } from "@/components/ui/card";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

import Image from "next/image";
import PocketBase from "pocketbase";
import { useEffect, useState } from "react";

const pb = new PocketBase("http://172.16.15.139:8080");

export default function Home() {
    const [gry, setGry] = useState([]);
    const [nazwa, setNazwa] = useState("");
    const [cena, setCena] = useState("");
    const [zdj, setZdj] = useState(null);
    const [opis, setOpis] = useState("");
    const [selectedGra, setSelectedGra] = useState(null);

    useEffect(() => {
        const getData = async () => {
            try {
                const records = await pb.collection("gry").getFullList({
                    sort: "-created",
                });
                setGry(records);
            } catch (err) {
                console.error(err);
            }
        };
        getData();
    }, []);

    const handleDelete = async (id) => {
        try {
            await pb.collection("gry").delete(id);
            setGry((prevGry) => prevGry.filter((gra) => gra.id !== id));
        } catch (err) {
            console.error("Error deleting record:", err);
        }
    };

    const handleAdd = async () => {
        try {
            const formData = new FormData();
            formData.append("nazwa", nazwa);
            formData.append("cena", cena);
            if (zdj) formData.append("zdj", zdj);
            formData.append("opis", opis);

            const createdRecord = await pb.collection("gry").create(formData);
            setGry((prevGry) => [createdRecord, ...prevGry]);
            setNazwa("");
            setCena("");
            setZdj(null);
            setOpis("");
        } catch (err) {
            console.error("Error adding record:", err);
        }
    };

    const handleEdit = async () => {
        if (!selectedGra) return;
        try {
            const formData = new FormData();
            formData.append("nazwa", nazwa);
            formData.append("cena", cena);
            if (zdj) formData.append("zdj", zdj);
            formData.append("opis", opis);

            const result = await pb.collection("gry").update(selectedGra.id, formData);
            setGry((prevGry) =>
                prevGry.map((gra) => (gra.id === selectedGra.id ? result : gra))
            );
            setSelectedGra(null);
            setNazwa("");
            setCena("");
            setOpis("");
            setZdj(null);
        } catch (err) {
            console.error("Error updating record:", err);
        }
    };

    const openEditDialog = (gra) => {
        setSelectedGra(gra);
        setNazwa(gra.nazwa);
        setCena(gra.cena);
        setOpis(gra.opis);
        setZdj(null);
    };

    return (
        <div>
            {gry && (
                <div className="flex flex-wrap w-full justify-center gap-5">
                    {gry.map((gra) => (
                        <Card key={gra.id} className="w-[500px] h-[500px]">
                            <CardTitle>
                                <Image
                                    src={pb.files.getUrl(gra, gra.zdj)}
                                    alt={gra.zdj}
                                    height={500}
                                    width={500}
                                    className="rounded-mb"
                                />
                            </CardTitle>
                            <CardContent>
                                {gra.nazwa} <br /> {gra.cena}
                            </CardContent>
                            <CardDescription>{gra.opis}</CardDescription>
                            <CardFooter>
                                <DropdownMenu>
                                    <DropdownMenuTrigger>...</DropdownMenuTrigger>
                                    <DropdownMenuContent>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem onClick={() => handleDelete(gra.id)}>
                                            usuń
                                        </DropdownMenuItem>
                                        <DropdownMenuItem>
                                            <Dialog>
                                                <DialogTrigger onClick={() => openEditDialog(gra)}>
                                                    edytuj
                                                </DialogTrigger>
                                                <DialogContent>
                                                    <DialogHeader>
                                                        <DialogTitle>Edycja gry</DialogTitle>
                                                        <DialogDescription>
                                                            Edytuj dane gry i zapisz zmiany.
                                                        </DialogDescription>
                                                    </DialogHeader>
                                                    <div className="space-y-4 p-4">
                                                        <Input
                                                            placeholder="Nazwa"
                                                            value={nazwa}
                                                            onChange={(e) => setNazwa(e.target.value)}
                                                        />
                                                        <Input
                                                            placeholder="Cena"
                                                            value={cena}
                                                            onChange={(e) => setCena(e.target.value)}
                                                        />
                                                        <Input
                                                            type="file"
                                                            onChange={(e) => setZdj(e.target.files[0])}
                                                        />
                                                        <Input
                                                            placeholder="Opis"
                                                            value={opis}
                                                            onChange={(e) => setOpis(e.target.value)}
                                                        />
                                                    </div>
                                                    <Button onClick={handleEdit}>Zapisz</Button>
                                                </DialogContent>
                                            </Dialog>
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
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
                                <SheetTitle>Dodawanie</SheetTitle>
                                <SheetDescription>Dodaj nową grę do bazy danych</SheetDescription>
                            </SheetHeader>
                            <div className="space-y-4 p-4">
                                <Input
                                    placeholder="Nazwa"
                                    value={nazwa}
                                    onChange={(e) => setNazwa(e.target.value)}
                                />
                                <Input
                                    placeholder="Cena"
                                    value={cena}
                                    onChange={(e) => setCena(e.target.value)}
                                />
                                <Input type="file" onChange={(e) => setZdj(e.target.files[0])} />
                                <Input
                                    placeholder="Opis"
                                    value={opis}
                                    onChange={(e) => setOpis(e.target.value)}
                                />
                            </div>
                            <SheetFooter>
                                <Button onClick={handleAdd}>Dodaj</Button>
                            </SheetFooter>
                        </SheetContent>
                    </Sheet>
                </div>
            )}
        </div>
    );
}
