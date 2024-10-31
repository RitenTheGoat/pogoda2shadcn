import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
  } from "@/components/ui/alert-dialog";
  import { Button } from "@/components/ui/button";
  import { Trash2 } from "lucide-react";
  import PocketBase from 'pocketbase';
  
  export default function AlertDialogDemo({ id, ondeleted }) {
    const pb = new PocketBase('http://172.16.15.139:8080');
  
    const del = async () => {
      console.log(id);
      try {
        await pb.collection('samochody').delete(id);
        ondeleted(id);
      } catch (err) {
        console.error("Failed to delete:", err);
      }
    };
  
    return (
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="outline">
            <Trash2 />
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this item from the server.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={del}>Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  }
  