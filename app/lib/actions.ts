'use client'

import { collection, addDoc } from "firebase/firestore";
import { db } from "@/app/lib/firebase";

export async function createShipment() {
  try {
    await addDoc(collection(db, "shipments"), {
      trackingCode: "OMA" + Math.floor(Math.random() * 1000000),
      status: "Pending",
      location: "Lagos",
      createdAt: new Date()
    });

    alert("Shipment created!");
  } catch (error) {
    console.error(error);
    alert("Error creating shipment");
  }
}