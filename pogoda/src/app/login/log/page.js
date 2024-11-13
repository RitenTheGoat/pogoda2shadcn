"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import PocketBase from "pocketbase";
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

const pb = new PocketBase("http://172.16.15.139:8080");

export default function LogPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [samochody, setsamochody] = useState([]);
  const [editData, setEditData] = useState({ id: null, marka: "", model: "" });

  const getData = async () => {
    try {
      const records = await pb.collection("samochody").getFullList({
        sort: "-created",
      });
      setsamochody(records);
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  };

  useEffect(() => {
    if (!pb.authStore.isValid) {
      router.push("/login");
    } else {
      setUsername(pb.authStore.model.username);
      getData();
    }
  }, []);

  const handleDelete = async (id) => {
    try {
      await pb.collection("samochody").delete(id);
      setsamochody((prev) => prev.filter((car) => car.id !== id));
    } catch (err) {
      console.error("Error deleting record:", err);
    }
  };

  const handleEditClick = (car) => {
    setEditData({ id: car.id, marka: car.marka, model: car.model });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async () => {
    try {
      const updatedRecord = await pb.collection("samochody").update(editData.id, {
        marka: editData.marka,
        model: editData.model,
      });
      setsamochody((prev) =>
        prev.map((car) => (car.id === updatedRecord.id ? updatedRecord : car))
      );
      setEditData({ id: null, marka: "", model: "" });
    } catch (err) {
      console.error("Error updating record:", err);
    }
  };

  return (
    <div>
      <h1>Welcome, {username}</h1>
      {samochody.length > 0 ? (
        <div className="flex flex-wrap gap-4">
          {samochody.map((car) => (
            <div key={car.id} className="border p-4 rounded-md shadow-md w-64">
              <h2 className="text-lg font-bold">{car.marka}</h2>
              <p>Model: {car.model}</p>
{car.creator === username ? (
              <div className="mt-4 flex justify-between">
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline" onClick={() => handleEditClick(car)}>
                      Edit
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Edit Car</AlertDialogTitle>
                      <AlertDialogDescription>
                        Modify the car details below and click "Save Changes" to update the record.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <div className="mt-2">
                      <label>Marka:</label>
                      <input
                        type="text"
                        name="marka"
                        value={editData.marka}
                        onChange={handleInputChange}
                        className="border rounded px-2 py-1 w-full"
                      />
                    </div>
                    <div className="mt-2">
                      <label>Model:</label>
                      <input
                        type="text"
                        name="model"
                        value={editData.model}
                        onChange={handleInputChange}
                        className="border rounded px-2 py-1 w-full"
                      />
                    </div>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={handleUpdate}>Save Changes</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
                <Button variant="destructive" onClick={() => handleDelete(car.id)}>
                  Delete
                </Button>
              </div>
):(
  <h1></h1>
)
}
            </div>
          ))}
        </div>
      ) : (
        <p>Nie ma nic.</p>
      )}
    </div>
  );
}
