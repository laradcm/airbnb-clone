'use client'

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { IconType } from "react-icons";
import qs from "query-string"

interface CategoryBoxProps{
    // key: string,
    label: string;
    // description: string,
    icon: IconType;
    selected?: boolean;

}

const CategoryBox: React.FC<CategoryBoxProps> = ({
    icon: Icon,
    label,
    selected
}) => {
    const router = useRouter();
    const params = useSearchParams();

    const handleClick = useCallback(() => {

        let currentQuery = {}; //init

        if(params){
            currentQuery = qs.parse(params.toString());//parse it so it becomes an object
        }

        const updatedQuery: any = { //spread query and add a category
            ...currentQuery,
            category: label
        }

        if(params?.get('category') === label){//if already selected than clear category
            delete updatedQuery.category;
        }

        const url = qs.stringifyUrl({//build url based on updated query
            url:'/',
            query: updatedQuery
        },{ skipNull: true });

        router.push(url);//add url to router

    }, [label, params, router]);
    
    return ( 
        <div
        onClick={handleClick}
        className={`
            flex
            flex-col
            items-center
            justify-center
            gap-2
            p-3
            border-b-2
            hover:text-neutral-800
            transition
            cursor-pointer
            ${selected ? 'border-b-neutral-800' : 'transparent'}
            ${selected ? 'text-neutral-800': 'text-neutral-500'}
            `}
            >
        <Icon size={26} />
        <div className=" font-nedium text-sm " >
            {label}
        </div>
        </div>
     );
}
 
export default CategoryBox;