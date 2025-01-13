import SpotCard from '@/components/SpotCard'

const SpotGrid = ({ spots, savedSpotIds, onSaveToggle }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
      {spots.map((spot) => (
        <SpotCard
          key={spot.id}
          spot={spot}
          savedSpotIds={savedSpotIds}
          onSaveToggle={onSaveToggle}
        />
      ))}
    </div>
  )
}

export default SpotGrid
