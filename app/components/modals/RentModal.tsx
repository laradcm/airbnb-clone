'use client';

import { useMemo, useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import useRentModal from "@/app/hooks/useRentModal";
import Modal from "./Modal";
import Heading from "../Heading";
import CountrySelect from "../inputs/CountrySelect";
import CategoryInput from "../inputs/CategoryInput";
import Counter from "../inputs/Counter";
import Input from "../inputs/Input";
import ImageUpload from "../inputs/ImageUpload";
import { categories } from "../navbar/Categories";
import dynamic from "next/dynamic";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

enum STEPS {
    CATEGORY = 0,
    LOCATION = 1,
    INFO = 2,
    IMAGES = 3,
    DESCRIPTION = 4,
    PRICE = 5
}

const RentModal = () => {
    const router = useRouter();
    const rentModal = useRentModal();
    const [step, setStep] = useState(STEPS.CATEGORY);
    const [isLoading, setIsLoading ] = useState(false);

    const {
        register,
        handleSubmit, 
        setValue, 
        watch,
        formState:{
            errors,
        },
        reset
    } = useForm<FieldValues>({ //form fields and defaults
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
    const guestCount = watch('guestCount');
    const roomCount = watch('roomCount');
    const bathroomCount = watch('bathroomCount');
    const imageSrc = watch('imageSrc');

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

    const onSubmit: SubmitHandler<FieldValues> = (data) => {
        if (step !== STEPS.PRICE) {
            return onNext();
        }

        setIsLoading(true);
        axios.post('/api/listings', data)
            .then(() => { 
                toast.success('Listing Created!');
                router.refresh();
                reset(); // from useForm - resets the field values if sucessfully submitted
                setStep(STEPS.CATEGORY); //moves to step 1 which is category
                rentModal.onClose();

            })
            .catch(() => { 
                toast.error('Something went wrong.');
            })
            .finally(() => { 
                setIsLoading(false);
            })

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

        return 'Back';//if not the first step then generate and label the back button

    },[step]);

    let bodyContent = (//by default loads the category step //step === STEP.CATEGORY
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

    if (step === STEPS.INFO){
        bodyContent = (
            <div className="flex flex-col gap-8">
                <Heading
                    title="Share some basics about your place"
                    subtitle="What amenities do you have?"              
                />
                <Counter 
                    title="Guests"
                    subtitle="How many guests do you allow?"
                    value={guestCount}
                    onChange={(value) =>  setCustomValue('guestCount', value)}
                />
                <hr />
                <Counter 
                    title="Rooms"
                    subtitle="How many rooms do you have?"
                    value={roomCount}
                    onChange={(value) =>  setCustomValue('roomCount', value)}
                />
                <hr />
                <Counter 
                    title="Bathrooms"
                    subtitle="How many bathrooms do you have?"
                    value={bathroomCount}
                    onChange={(value) =>  setCustomValue('bathroomCount', value)}
                />
            </div>
        )
    }

    if(step === STEPS.IMAGES){
        bodyContent = (
            <div className="flex flex-col gap-8">
                <Heading
                    title="Add a photo of your place"
                    subtitle="Show guests what your place looks like!"
                />
                <ImageUpload
                    value={imageSrc}
                    onChange={(value) => setCustomValue('imageSrc', value)}
                />
            </div>
        )
    }

    if(step === STEPS.DESCRIPTION){
        bodyContent = (
            <div className="flex flex-col gap-8">
                <Heading
                    title="How would you describe your place"
                    subtitle="Short and sweet works best!"
                />
                <Input
                    id="title"
                    label="Title"
                    disabled={isLoading}
                    register={register}
                    errors={errors}
                    required
                />

                <hr />

                <Input
                    id="description"
                    label="Description"
                    disabled={isLoading}
                    register={register}
                    errors={errors}
                    required
                />

            </div>
        )
    }

    if(step === STEPS.PRICE){
        bodyContent = (
            <div className=" flex flex-col gap-8">
                <Heading
                    title="Now, set your price"
                    subtitle="How much do you charge per night"
                />

                <Input 
                    id="price"
                    label="Price"
                    formatPrice
                    type="number"
                    disabled={isLoading}
                    register={register}
                    errors={errors}
                    required
                 />
            </div>
        )
    }

    return ( 
    
    <Modal
        isOpen={rentModal.isOpen}
        onClose={rentModal.onClose}
        onSubmit={handleSubmit(onSubmit)}
        actionLabel={actionLabel}
        secondaryActionLabel={secondaryActionLabel}
        secondaryAction={step === STEPS.CATEGORY? undefined : onBack}//equivalent of the behavior of a second submit
        title = 'Airbnb your home!' 
        body={bodyContent}    
    
    /> );
}
 
export default RentModal;