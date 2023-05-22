'use client';

import { useMemo, useState } from "react";
import { FieldValues, useForm } from "react-hook-form";
import useRentModal from "@/app/hooks/useRentModal";
import Modal from "./Modal";
import Heading from "../Heading";
import CountrySelect from "../inputs/CountrySelect";
import CategoryInput from "../inputs/CategoryInput";
import { categories } from "../navbar/Categories";
import dynamic from "next/dynamic";

enum STEPS {
    CATEGORY = 0,
    LOCATION = 1,
    INFO = 2,
    IMAGES = 3,
    DESCRIPTION = 4,
    PRICE = 5
}

const RentModal = () => {
    const rentModal = useRentModal();
    const [step, setStep] = useState(STEPS.CATEGORY);

    const {
        register,
        handleSubmit, 
        setValue, 
        watch,
        formState:{
            errors,
        },
        reset
    } = useForm<FieldValues>({
        defaultValues : {
            category: '',
            location: null,
            guestCount: 1,
            roomCount: 1,
            bathroomCount: 1,
            imageSrc: '',
            price: 1,
            title: '',
            description: ''
        }
    });

    const category = watch('category');
    const location = watch('location');

    //workaround for leaflet, cant import Map normally, need to use useMemo
    //the dynamic keyword is another kind of import
    const Map = useMemo(() => dynamic(() => import("../Map"),{
        ssr: false
    }), [location]);//there is a warning, but it is necessary to add it because the Map component will react according to location
    

    const setCustomValue = ( id:string, value:any ) => {
        setValue(id, value, {
            shouldDirty: true,
            shouldTouch: true,
            shouldValidate: true
        })
    }

    const onBack = () => {
        setStep((value) => --value);
    };

    const onNext = () => {
        setStep((value) => ++value);
    }

    const actionLabel = useMemo(() => {
        if(step === STEPS.PRICE){ //if on last step (PRICE) then label the main button create
            return 'Create';
        }

        return 'Next';//if not the last step then label the button next
    },[step]);

    const secondaryActionLabel = useMemo(() => {
        if(step === STEPS.CATEGORY){//if first step then there is no back button
            return undefined;
        }

        return 'Back';//if not the first step then create and label the back button

    },[step]);

    let bodyContent = (//by default loads the category step
        <div className=" flex flex-col gap-8">
            <Heading
                title="Which of these best describes your place?"
                subtitle="Pick a category"
            />
            <div
                className="
                grid
                grid-cols-1
                md:grid-cols-2
                gap-3
                max-h-[50vh]
                overflow-y-auto
                "
            >
            {categories.map((item) => (
                <div key={item.label} className="col-span-1">
                    <CategoryInput
                        onClick={(category)=> setCustomValue('category', category)}
                        selected={category === item.label}
                        label={item.label}
                        icon={item.icon}
                    
                    
                    />

                </div>
            ))}
            </div>
        </div>
    )
    
    if(step === STEPS.LOCATION){
        bodyContent = (
            <div className="flex flex-col gap-8">
                <Heading
                    title="Where is your place located?"
                    subtitle="Help guests find you"
                />
                <CountrySelect
                    value={location}
                    onChange={(value) => setCustomValue('location', value)}

                />
                <Map 
                    center={location?.latlng}
                />
            </div>
        )
    }

    return ( 
    
    <Modal
        isOpen={rentModal.isOpen}
        onClose={rentModal.onClose}
        onSubmit={onNext}
        actionLabel={actionLabel}
        secondaryActionLabel={secondaryActionLabel}
        secondaryAction={step === STEPS.CATEGORY? undefined : onBack}//equivalent of the behavior of a second submit
        title = 'Airbnb your home!' 
        body={bodyContent}    
    
    /> );
}
 
export default RentModal;