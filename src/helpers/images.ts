import supabase from '../utils/supabase'

export async function addImageUrl(values: any) {
  const withImages = []
  for (let i = 0; i <= values.length - 1; i++) {
    if (values[i].image_url) {
      const { data, error } = await supabase.storage
        .from('spaces_icons')
        .download(values[i].image_url)

      if (error) {
        withImages.push(values[i])
      } else {
        withImages.push({
          ...values[i],
          image_url: URL.createObjectURL(data),
        })
      }
    } else {
      withImages.push(values[i])
    }
  }

  return withImages
}

export function imageUpload(e: any) {
  const files: any = Array.from(e)
  if (files) {
    // Check file size (5MB)
    const maxSize = 5 * 1024 * 1024
    if (files[0].size > maxSize) {
      return {
        error: 'File is too large, please select a file smaller than 5MB.',
      }
    } else {
      // Check file type
      const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg']
      if (!allowedTypes.includes(files[0].type)) {
        return {
          error: 'Invalid file type, please select a PNG, JPEG, or JPG image.',
        }
      }
      // const reader = new FileReader()
      // const url: any = (reader.onload = () => {
      //   return reader.result
      // })
      const url = URL.createObjectURL(files[0])
      // reader.readAsDataURL(files[0])
      const data: {
        url: string | ArrayBuffer | null
        image: File
        error: string | null
      } = {
        url,
        image: files[0],
        error: null,
      }
      return data
    }
  } else {
    console.log('files :>> ', files)
  }
}
