import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Loader2, Check, AlertCircle } from 'lucide-react'
import { Progress } from '@/components/ui/progress'
import { addPredefinedSpots } from '@/lib/utils'
import { predefinedSpots } from '@/data/predefinedSpots'
import { useQuery } from '@tanstack/react-query'
import { getCategories } from '@/services/api'

const AddPredefinedSpotsPage = () => {
  const navigate = useNavigate()
  const [selectedCity, setSelectedCity] = useState(null)
  const [isAdding, setIsAdding] = useState(false)
  const [progress, setProgress] = useState(0)
  const [results, setResults] = useState([])

  // Fetch categories to map them to the spots
  const { data: categoriesData } = useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
  })

  const categories = categoriesData?.data || []

  // Get category IDs by name
  const getCategoryIds = (categoryNames) => {
    if (!categories.length) return []
    return categoryNames
      .map((name) => {
        const category = categories.find(
          (c) => c.name.toLowerCase() === name.toLowerCase()
        )
        return category?.id
      })
      .filter(Boolean)
  }

  const handleAddSpots = async (city) => {
    setSelectedCity(city)
    setIsAdding(true)
    setProgress(0)
    setResults([])

    try {
      // Map category names to IDs
      const spotsWithCategoryIds = predefinedSpots[city].map((spot) => ({
        ...spot,
        categories: getCategoryIds(spot.categoryNames || []),
      }))

      const results = await addPredefinedSpots(
        spotsWithCategoryIds,
        (completed, total) => {
          setProgress(Math.floor((completed / total) * 100))
        }
      )

      setResults(results)
    } catch (error) {
      console.error('Error adding predefined spots:', error)
    } finally {
      setIsAdding(false)
    }
  }

  return (
    <div className="container mx-auto py-8 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Add Predefined Spots</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-6 text-muted-foreground">
            Add curated collections of Instagram-worthy spots for different
            cities.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {Object.keys(predefinedSpots).map((city) => (
              <Card
                key={city}
                className={`cursor-pointer hover:shadow-md transition-shadow ${
                  selectedCity === city ? 'ring-2 ring-primary' : ''
                }`}
                onClick={() => !isAdding && setSelectedCity(city)}
              >
                <CardContent className="p-4">
                  <h3 className="font-semibold text-lg mb-2">{city}</h3>
                  <p className="text-sm text-muted-foreground">
                    {predefinedSpots[city].length} spots
                  </p>
                  <Button
                    className="w-full mt-4"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleAddSpots(city)
                    }}
                    disabled={isAdding}
                  >
                    {isAdding && selectedCity === city ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Adding...
                      </>
                    ) : (
                      'Add Spots'
                    )}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {isAdding && (
            <div className="mb-6">
              <p className="mb-2">Adding spots for {selectedCity}...</p>
              <Progress value={progress} className="h-2 mb-4" />
            </div>
          )}

          {results.length > 0 && (
            <div className="border rounded-lg p-4">
              <h3 className="font-semibold mb-2">Results</h3>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {results.map((result, index) => (
                  <div
                    key={index}
                    className={`flex items-center p-2 rounded-md ${
                      result.success ? 'bg-green-50' : 'bg-red-50'
                    }`}
                  >
                    {result.success ? (
                      <Check className="h-5 w-5 text-green-500 mr-2" />
                    ) : (
                      <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
                    )}
                    <span>{result.name}</span>
                    {result.success ? (
                      <Button
                        variant="link"
                        size="sm"
                        className="ml-auto"
                        onClick={() => navigate(`/spot/${result.id}`)}
                      >
                        View
                      </Button>
                    ) : (
                      <span className="ml-auto text-xs text-red-500">
                        {result.error}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mt-6 flex justify-end">
            <Button variant="outline" onClick={() => navigate('/')}>
              Back to Home
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default AddPredefinedSpotsPage
