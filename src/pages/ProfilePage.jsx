import { useUser } from '@/contexts/UserContext'
import { useState } from 'react'
import { EditProfileDialog } from '@/components/EditProfileDialog'
import { updateProfileImage } from '@/lib/utils'
import { optimizeImage } from '@/lib/imageUtils'

function ProfilePage() {
  const { user, updateUser } = useUser()
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [posts, setPosts] = useState([]) // You'll need to fetch actual posts
  const [uploading, setUploading] = useState(false)

  const handleEditProfile = (updatedData) => {
    // Here you would typically make an API call to update the user data
    updateUser(updatedData)
  }

  const handleProfileImageUpload = async (file) => {
    try {
      setUploading(true)
      if (!file) return

      // Optimize image before upload
      const optimizedFile = await optimizeImage(file, 800) // Smaller max width for profile pictures

      const publicUrl = await updateProfileImage(optimizedFile, user.id)
      updateUser({ ...user, profileImage: publicUrl })
    } catch (error) {
      console.error('Error uploading image:', error)
      alert('Error uploading image!')
    } finally {
      setUploading(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file && file.type.startsWith('image/')) {
      handleProfileImageUpload(file)
    }
  }

  const handleDragOver = (e) => {
    e.preventDefault()
  }

  const handleFileInputChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      handleProfileImageUpload(file)
    }
  }

  return (
    <div className="max-w-[935px] mx-auto px-4">
      {/* Profile Header */}
      <header className="flex gap-8 sm:gap-28 py-11">
        {/* Profile Picture with drag & drop and file input */}
        <div className="flex-none">
          <label
            className={`w-[77px] h-[77px] sm:w-[150px] sm:h-[150px] rounded-full border-[1px] p-[2px] cursor-pointer relative block
              ${uploading ? 'opacity-50' : ''}`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
          >
            <input
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleFileInputChange}
              disabled={uploading}
            />
            <img
              src={user?.profile_picture || 'https://github.com/shadcn.png'}
              alt="profile"
              className="rounded-full w-full h-full object-cover"
            />
            <div className="absolute inset-0 rounded-full hover:bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
              <span className="text-white text-sm">Change Photo</span>
            </div>
          </label>
        </div>

        {/* Profile Info */}
        <div className="flex-1">
          {/* Username and Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center mb-6">
            <h2 className="text-xl">{user?.username || 'username'}</h2>
            <div className="flex gap-2">
              <button
                onClick={() => setIsEditDialogOpen(true)}
                className="bg-[#efefef] hover:bg-[#dbdbdb] px-4 py-1.5 rounded-lg font-semibold text-sm"
              >
                Edit profile
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="flex gap-10 mb-5">
            <div>
              <span className="font-semibold">{posts.length}</span> posts
            </div>
            <div>
              <span className="font-semibold">
                {user?.followers?.length || 0}
              </span>{' '}
              followers
            </div>
            <div>
              <span className="font-semibold">
                {user?.following?.length || 0}
              </span>{' '}
              following
            </div>
          </div>

          {/* Bio */}
          <div className="text-sm">
            <div className="font-semibold">{user?.fullName}</div>
            <p className="whitespace-pre-line">{user?.bio}</p>
          </div>
        </div>
      </header>

      {/* Posts/Saved/Tagged Navigation */}
      <div className="border-t">
        <nav className="flex justify-center">
          <button className="flex items-center gap-2 px-6 py-4 text-xs font-semibold border-t border-black -mt-[1px]">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-3 h-3"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z"
              />
            </svg>
            POSTS
          </button>
        </nav>
      </div>

      {/* Posts Grid */}
      <div className="grid grid-cols-3 gap-[2px] mt-4">
        {[1, 2, 3, 4, 5, 6].map((_, i) => (
          <div
            key={i}
            className="relative aspect-square bg-gray-100 cursor-pointer group"
          >
            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <div className="flex gap-8 text-white font-semibold">
                <span className="flex items-center gap-2">❤️ 0</span>
                <span className="flex items-center gap-2">💬 0</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add the EditProfileDialog */}
      <EditProfileDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        user={user}
        onSave={handleEditProfile}
      />
    </div>
  )
}

export default ProfilePage
