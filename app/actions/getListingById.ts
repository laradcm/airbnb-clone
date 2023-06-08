import prisma from "@/app/libs/prismadb";

interface IParams{
    listingId?: string;
}

export default async function getListingById( params: IParams ){

    try{
        const { listingId } = params;

        const listing = await prisma.listing.findUnique({
            where: {
                id: listingId
            },
            include: {
                user: true //you want to bring the user to use on the listing page
            }
        });

        if(!listing){
            return null;
        }


        return{
            ...listing,
            createdAt: listing.createdAt.toISOString(), //sanitation of date type to string
            user: {
                ...listing.user,
                createdAt: listing.user.createdAt.toISOString(),
                updatedAt: listing.user.updatedAt.toISOString(),
                emailVerified: listing.user.emailVerified?.toISOString() || null,
            }

        }; 

    }catch(error: any){
        throw new Error(error);
    }
}
