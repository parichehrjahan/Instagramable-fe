export const optimizeImage = async (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = (event) => {
      const img = new Image()
      img.src = event.target.result
      img.onload = () => {
        const canvas = document.createElement('canvas')
        canvas.width = img.width
        canvas.height = img.height
        const ctx = canvas.getContext('2d')
        ctx.drawImage(img, 0, 0, img.width, img.height)

        // Convert to WebP with 0.8 quality (good balance between quality and size)
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error('Canvas to Blob conversion failed'))
              return
            }
            // Convert blob to File object with .webp extension
            const optimizedFile = new File(
              [blob],
              `${file.name.split('.')[0]}.webp`,
              {
                type: 'image/webp',
              }
            )
            resolve(optimizedFile)
          },
          'image/webp',
          0.8
        )
      }
      img.onerror = (error) => reject(error)
    }
    reader.onerror = (error) => reject(error)
  })
}
