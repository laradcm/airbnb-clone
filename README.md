



### Cloudinary setup


1. Create the enviroment variable:


 ```js
 
 NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="yourcoudinaryname"

 ```

 your cloudinary name can be found in the dashboard of your cloudinary page


2. Create your default upload:

- Go to your cloudinary settings>upload
- In upload presets click "Add Upload Preset"
- configure it as unsigned and save
- copy the preset name and paste into your CldUploadWidget component as:

```tsx
<CldUploadWidget
    onUpload={handleUpload}
    uploadPreset="uploadPresetNameYouCopied"
    options={{
        maxFiles: 1
    }}
>
```

### Type Sanitation

when you bring in a type that does not work with react (date for example), you will need to sanitize(transform) the type to work with it.

1. from the action where the type is coming (on this app case it is getCurrentUsers and getListings), do the following:

- before the return or on the return statement, rewrite the variable with the properties to convert, ex:
    
```ts
    const safeListings = listings.map((listing) => ({ 
        ...listing,
        createdAt: listing.createdAt.toISOString(),//rewrite the property that needs the type changed
    }));

    return safeListings; //return transformed object
```

2. then from your app/types folder, inside index.ts file, ex:

 ```ts
    import { Listing} from "@prisma/client"; //import the type not sanitized
    
    export type SafeListing = Omit< //rewrite it using Omit and export
        Listing,
        "createdAt"
    > & {
        createdAt: string;
    };
```

3. Lastly, use the sanitized type on your components, ex:

 ```ts
import { SafeListing, SafeUser } from "@/app/types";

interface ListingCardProps {
    data: SafeListing;
    currentUser?: SafeUser | null; 
}
```