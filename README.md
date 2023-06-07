



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



 