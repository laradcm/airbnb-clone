import prisma from "@/app/libs/prismadb";

interface IParams {
    listingId?: string;
    userId?: string;
    authorId?: string;
}

export default async function getReservations( params : IParams){

    try {
        const { listingId, userId, authorId } = params;

        const query: any = {};
    
        if(listingId) { //get reservations made for one listing
            query.listingId = listingId;
        }
    
        if(userId) { //get owner user reservations
            query.userId = userId;
        }
    
        if(authorId) { //get reservation from other users for the owner's listings
            query.listing = {userId: authorId};
        }
    
        const reservations = await prisma.reservation.findMany({
            where: query,
            include: {
                listing: true,
            },
            orderBy: {
                createdAt: 'desc'
            }
        });
    
        const safeReservations = reservations.map((reservation) => ({
            ...reservation,
            createdAt: reservation.createdAt.toISOString(),
            startDate: reservation.startDate.toISOString(),
            endDate: reservation.endDate.toISOString(),
            listing: {
                ...reservation.listing,
                createdAt: reservation.listing.createdAt.toISOString()
            }
    
        }));
    
        return safeReservations;

    } catch (error: any) {
        throw new Error(error);        
    }



}