import { NextResponse } from "next/server";

import prisma from "@/app/libs/prismadb";
import getCurrentUser from "@/app/actions/getCurrentUser";

export async function POST ( request: Request ) {

    const currentUser = await getCurrentUser();

    if(!currentUser){
        NextResponse.error();
    }

    const body = await request.json();
    const {
        title, 
        description, 
        imageSrc, 
        category, 
        roomCount,
        bathroomCount,
        guestCount, 
        location, 
        price
    } = body;

    Object.keys(body).forEach((value: any) => { 

        if(!body[value]){
            NextResponse.error();
        }

    });

    const listing = await prisma.listing.create({ 
        data: {
            title, 
            description,
            imageSrc, 
            category, 
            roomCount,
            bathroomCount,
            guestCount, 
            locationValue: location.value, //according to prisma scheme and how we retrieve location
            price: parseInt(price, 10), 
            userId: currentUser.id//review logic
        }
    });


    return NextResponse.json(listing);
}
