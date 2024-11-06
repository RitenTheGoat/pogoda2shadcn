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
import { Switch } from "@/components/ui/switch"; // Import the Switch component
import {
    Sheet,
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
import { Plus } from "lucide-react";

const pb = new PocketBase("http://172.16.15.139:8080");

export default function Home() {
    const [gry, setGry] = useState([]);
    const [nazwa, setNazwa] = useState("");
    const [cena, setCena] = useState("");
    const [zdj, setZdj] = useState(null);
    const [opis, setOpis] = useState("");
    const [selectedGra, setSelectedGra] = useState(null);
    const [dialogOpen, setDialogOpen] = useState(false);  // Controlled state for Dialog

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
            setDialogOpen(false);  // Close dialog after edit
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
        setDialogOpen(true);  // Open dialog when edit button is clicked
    };

    const handleSwitchChange = async (gra, checked) => {
        try {
            const updatedGra = await pb.collection("gry").update(gra.id, {
                stan: checked,
            });
            setGry((prevGry) =>
                prevGry.map((g) => (g.id === gra.id ? updatedGra : g))
            );
        } catch (err) {
            console.error("Error updating stan:", err);
        }
    };

    return (
        <div>
            {gry && (
                <div className="flex flex-wrap w-full justify-center gap-5">
                    {gry.map((gra) => (
                        <Card key={gra.id} className="w-[370px] h-[500px] ">
                            <CardTitle>
                              <div className="relative h-[250px] w-[369px]">
                                <Image
                                    src={pb.files.getUrl(gra, gra.zdj)}
                                    alt={gra.zdj}
                                    className="rounded-mb"
                                    layout="fill"

                                />
                                </div>
                            </CardTitle>
                            <CardContent className="flex items-center justify-center  flex-col ">
                                <div><h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">{gra.nazwa}</h3></div> 
                                <div><p className="leading-7 [&:not(:first-child)]:mt-6">{gra.cena}    </p>
                                </div>
                            </CardContent>
                            <CardDescription className="my-7">{gra.opis}</CardDescription>
                            <CardFooter className="flex justify-between items-center">
                                <DropdownMenu>
                                    <DropdownMenuTrigger>...</DropdownMenuTrigger>
                                    <DropdownMenuContent>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem onClick={() => handleDelete(gra.id)}>
                                            usuń
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => openEditDialog(gra)}>
                                            edytuj
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                                <Switch
                                    checked={gra.stan}  // Set the Switch based on the "stan" value
                                    onCheckedChange={(checked) => handleSwitchChange(gra, checked)}  // Update "stan" when toggled
                                />
                            </CardFooter>
                        </Card>
                    ))}

                    <Sheet>
                        <SheetTrigger>
                            <Card className="flex items-center justify-center w-[500px] h-[500px]">
                                <h1><Plus size={150}/></h1>
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
                                    onChange={(e) => setOpis(e.target.value) }
                                />
                            </div>
                            <SheetFooter>
                                <Button onClick={handleAdd}>Dodaj</Button>
                            </SheetFooter>
                        </SheetContent>
                    </Sheet>
                </div>
            )}

            {/* Dialog for editing game */}
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger /> {/* This is now hidden, the dialog is controlled by state */}
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
        </div>
    );
}
