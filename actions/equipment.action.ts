"use server";

import { EquipmentFormData } from "@/components/forms/EquipmentForm";
import { RequestEquipmentsFormData } from "@/components/forms/EquipmentRequestForm";
import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";
import { createActivityLog } from "./log.action";

export async function getEquipments() {
  try {
    const equipments = await prisma.equipment.findMany();
    return equipments;
  } catch (error) {
    return [];
  }
}

export async function getAvailableEquipments() {
  try {
    const equipments = await prisma.equipment.findMany({
      include: {
        requests: {
          where: { status: "Not Returned" },
        },
      },
    });

    return equipments
      .map(
        ({
          id,
          name,
          brand,
          price,
          quantity,
          dateBought,
          isAvailable,
          imageUrl,
          dateAdded,
          requests,
        }) => {
          const totalBorrowed = requests.reduce(
            (acc, { quantity }) => acc + quantity,
            0
          );
          const modifiedQuantity = Math.max(quantity - totalBorrowed, 0); // Ensure quantity is not negative

          return {
            id,
            name,
            brand,
            price,
            quantity: modifiedQuantity,
            dateBought,
            isAvailable,
            imageUrl,
            dateAdded,
          };
        }
      )
      .filter((equipment) => equipment.quantity > 0); // Only return available equipments
  } catch (error) {
    console.error("Error fetching available equipments:", error);
    return [];
  }
}

export async function deleteEquipment(id: string) {
  try {
    await prisma.equipment.delete({ where: { id } });
  } catch (error) {
    console.log(error);
  } finally {
    await createActivityLog("Deleted an Equipment", "Equipments");
  }
}

export async function getEquipment(id: string) {
  try {
    const equipment = await prisma.equipment.findUnique({ where: { id } });
    return equipment;
  } catch (error) {
    return null;
  }
}

export async function updateEquipment(data: EquipmentFormData) {
  try {
    await prisma.equipment.update({
      where: {
        id: data.id,
      },
      data: {
        name: data.name,
        brand: data.brand,
        isAvailable: data.isAvailable,
        dateBought: data.dateBought,
        price: Number(data.price),
        quantity: Number(data.quantity),
        imageUrl: data.imageUrl,
      },
    });
  } catch (e) {
    console.log(e);
  } finally {
    await createActivityLog("Updated an Equipment", "Equipments");
  }
}

export async function createEquipment(data: EquipmentFormData) {
  try {
    await prisma.equipment.create({
      data: {
        name: data.name,
        brand: data.brand,
        isAvailable: data.isAvailable,
        price: Number(data.price),
        quantity: Number(data.quantity),
        dateBought: data.dateBought,
        imageUrl: data.imageUrl,
      },
    });
  } catch (e) {
    console.log(e);
  } finally {
    await createActivityLog("Created an Equipment", "Equipments");
  }
}

export async function getEquipmentRequest(eventId: string) {
  try {
    return await prisma.equipmentRequest.findFirst({
      where: { eventId },
      include: {
        equipments: {
          include: {
            equipment: true,
          },
        },
      },
    });
  } catch (error) {
    console.log(error);
  }
}

export async function createEquipmentRequest(data: RequestEquipmentsFormData) {
  const { requestor, items } = data;

  try {
    // Create the equipment request and associated requested equipments
    const equipmentRequest = await prisma.equipmentRequest.create({
      data: {
        eventId: data.eventId,
        requestor,
        dateRequested: new Date(data.dateRequested), // Set the current date as dateRequested
        dateToBeReturned: new Date(data.dateToBeReturned), // Set this to the desired return date
        status: "Pending", // Set the initial status (can be "Pending", "Approved", etc.)
        equipments: {
          create: items.map((item) => ({
            equipmentId: item.equipmentId,
            quantity: item.quantity,
            status: "Not Returned", // Initial status for each requested equipment
          })),
        },
      },
    });
    revalidatePath("/");
    return equipmentRequest;
    // Return the created equipment request for further processing or confirmation
  } catch (error) {
    console.error("Error creating equipment request:", error);
    throw new Error("Failed to create equipment request");
  } finally {
    await createActivityLog("Created a Equipment Request", "Equipments");
  }
}

export async function updateEquipmentRequest(
  requestId: string,
  data: RequestEquipmentsFormData
) {
  try {
    // Update the equipment request and associated requested equipments
    const updatedEquipmentRequest = await prisma.equipmentRequest.update({
      where: { id: requestId },
      data: {
        requestor: data.requestor ?? undefined, // Update if provided
        dateRequested: data.dateRequested
          ? new Date(data.dateRequested)
          : undefined, // Update if provided
        dateToBeReturned: data.dateToBeReturned
          ? new Date(data.dateToBeReturned)
          : undefined, // Update if provided
        equipments: data.items
          ? {
              deleteMany: {}, // Remove existing items first
              create: data.items.map((item) => ({
                equipmentId: item.equipmentId,
                quantity: item.quantity,
                status: item.status ?? "Not Returned", // Default status if not provided
              })),
            }
          : undefined,
      },
    });
    revalidatePath("/");
    return updatedEquipmentRequest; // Return the updated equipment request for further processing or confirmation
  } catch (error) {
    console.error("Error updating equipment request:", error);
    throw new Error("Failed to update equipment request");
  } finally {
    await createActivityLog("Updated a Equipment Request", "Equipments");
  }
}

export async function getRequestedEquipment(id: string) {
  try {
    const equipment = await prisma.equipment.findUnique({
      where: { id },
      include: {
        requests: {
          where: { status: "Not Returned" },
          select: { quantity: true }, // Select only the quantity of "Not Returned" requests
        },
      },
    });

    if (!equipment) return null;

    // Calculate the remaining quantity
    const totalRequested = equipment.requests.reduce(
      (sum, request) => sum + request.quantity,
      0
    );
    const remainingQuantity = equipment.quantity - totalRequested;
    return {
      id: equipment.id,
      name: equipment.name,
      imageUrl: equipment.imageUrl,
      quantity: remainingQuantity, // Computed quantity
    };
  } catch (error) {
    console.error(error);
    throw new Error("Failed to fetch requested equipment");
  }
}

export async function getAllBorrowHistory() {
  try {
    return await prisma.requestedEquipment.findMany({
      include: {
        equipment: {
          select: {
            name: true, // Equipment Name
          },
        },
        request: {
          select: {
            dateRequested: true, // Borrowed Date
            status: true, // Request status (RequestedEquipment status)
            requestor: true, // Borrower (add a `borrower` field to EquipmentRequest if not present)
            event: {
              select: {
                id: true,
                summary: true, // Event summary
                colorId: true,
              },
            },
          },
        },
      },
    });
  } catch (error) {}
}
