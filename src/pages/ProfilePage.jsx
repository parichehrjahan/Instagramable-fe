import { useUser } from '@/contexts/UserContext'
import { useState } from 'react'
import { EditProfileDialog } from '@/components/EditProfileDialog'

function ProfilePage() {
  const { user, updateUser } = useUser()
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [posts, setPosts] = useState([]) // You'll need to fetch actual posts

  const handleEditProfile = (updatedData) => {
    // Here you would typically make an API call to update the user data
    updateUser(updatedData)
  }

  return (
    <div className="max-w-[935px] mx-auto px-4">
      {/* Profile Header */}
      <header className="flex gap-8 sm:gap-28 py-11">
        {/* Profile Picture */}
        <div className="flex-none">
          <div className="w-[77px] h-[77px] sm:w-[150px] sm:h-[150px] rounded-full border-[1px] p-[2px] cursor-pointer">
            <img
              src={user?.profileImage || 'https://github.com/shadcn.png'}
              alt="profile"
              className="rounded-full w-full h-full object-cover"
            />
          </div>
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
