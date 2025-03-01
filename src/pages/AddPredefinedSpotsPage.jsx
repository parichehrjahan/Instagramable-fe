import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { predefinedSpots } from '@/data/predefinedSpots'
import { getCategories } from '@/services/api'
import { useQuery as useAntQuery } from '@tanstack/react-query'
import {
  Card as AntCard,
  Select,
  Typography,
  Divider,
  Row,
  Col,
  List,
  Alert,
  Progress,
} from 'antd'
import {
  PlusOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons'
import { addSpotsForCity } from '@/utils/addSpotsScript'

const { Title, Text } = Typography
const { Option } = Select

const AddPredefinedSpotsPage = () => {
  const navigate = useNavigate()
  const [selectedCity, setSelectedCity] = useState('San Francisco')
  const [isAdding, setIsAdding] = useState(false)
  const [progress, setProgress] = useState(0)
  const [results, setResults] = useState(null)

  const { data: categories } = useAntQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
  })

  const getCategoryIds = (categoryNames) => {
    if (!categories) return []
    return categoryNames
      .map((name) => {
        const category = categories.find((c) => c.name === name)
        return category ? category.id : null
      })
      .filter((id) => id !== null)
  }

  const handleAddSpots = async () => {
    if (!selectedCity) return

    setIsAdding(true)
    setProgress(0)
    setResults(null)

    try {
      // Get the spots for the selected city
      const citySpots = predefinedSpots[selectedCity]

      // Add category IDs to each spot
      const spotsWithCategoryIds = citySpots.map((spot) => ({
        ...spot,
        categoryIds: getCategoryIds(spot.categoryNames || []),
      }))

      // Update the predefined spots with the category IDs
      predefinedSpots[selectedCity] = spotsWithCategoryIds

      // Add the spots
      const results = await addSpotsForCity(selectedCity)
      setResults(results)

      // Set progress to 100% when done
      setProgress(100)
    } catch (error) {
      console.error('Error adding spots:', error)
      setResults({
        success: [],
        failed: [{ name: 'Error', error: error.message }],
      })
    } finally {
      setIsAdding(false)
    }
  }

  const cities = Object.keys(predefinedSpots)

  return (
    <div className="container mx-auto p-4">
      <Title level={2}>Add Predefined Spots</Title>
      <Text>
        Add curated collections of Instagram-worthy spots for various cities.
      </Text>

      <Divider />

      <AntCard title="San Francisco Explorer" className="mb-6">
        <Text>
          Use our specialized San Francisco Explorer to search and add spots
          from Google Places API.
        </Text>
        <div className="mt-4">
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => navigate('/add-sf-spots')}
          >
            Open SF Explorer
          </Button>
        </div>
      </AntCard>

      <AntCard title="Add Predefined Spots" className="mb-6">
        <div className="mb-4">
          <Text>
            Select a city to add its predefined Instagram-worthy spots:
          </Text>
          <div className="flex flex-col sm:flex-row gap-4 mt-2">
            <Select
              value={selectedCity}
              onChange={setSelectedCity}
              style={{ width: 200 }}
              disabled={isAdding}
            >
              {cities.map((city) => (
                <Option key={city} value={city}>
                  {city}
                </Option>
              ))}
            </Select>
            <Button
              type="primary"
              onClick={handleAddSpots}
              loading={isAdding}
              disabled={!selectedCity}
            >
              Add Spots
            </Button>
          </div>
        </div>

        {isAdding && (
          <div className="mb-4">
            <Text>Adding spots for {selectedCity}...</Text>
            <Progress percent={progress} status="active" />
          </div>
        )}

        {results && (
          <div className="mt-4">
            <Alert
              message={`Added ${results.success.length} spots successfully. Failed to add ${results.failed.length} spots.`}
              type={results.failed.length === 0 ? 'success' : 'warning'}
              showIcon
              icon={
                results.failed.length === 0 ? (
                  <CheckCircleOutlined />
                ) : (
                  <ExclamationCircleOutlined />
                )
              }
            />

            {results.success.length > 0 && (
              <div className="mt-4">
                <Title level={4}>Successfully Added:</Title>
                <List
                  size="small"
                  bordered
                  dataSource={results.success}
                  renderItem={(item) => (
                    <List.Item>
                      <CheckCircleOutlined className="text-green-500 mr-2" />{' '}
                      {item.name}
                    </List.Item>
                  )}
                />
              </div>
            )}

            {results.failed.length > 0 && (
              <div className="mt-4">
                <Title level={4}>Failed to Add:</Title>
                <List
                  size="small"
                  bordered
                  dataSource={results.failed}
                  renderItem={(item) => (
                    <List.Item>
                      <ExclamationCircleOutlined className="text-red-500 mr-2" />{' '}
                      {item.name}: {item.error}
                    </List.Item>
                  )}
                />
              </div>
            )}
          </div>
        )}
      </AntCard>

      <Divider />

      <Title level={3}>Available Predefined Spots</Title>
      <Row gutter={[16, 16]}>
        {cities.map((city) => {
          const citySpots = predefinedSpots[city]
          return (
            <Col xs={24} sm={12} md={8} lg={6} key={city}>
              <AntCard
                title={city}
                extra={<Text type="secondary">{citySpots.length} spots</Text>}
                hoverable
              >
                <div className="mb-2">
                  {citySpots.slice(0, 3).map((spot, index) => (
                    <div key={index} className="mb-1 truncate">
                      • {spot.name}
                    </div>
                  ))}
                  {citySpots.length > 3 && (
                    <div>• And {citySpots.length - 3} more...</div>
                  )}
                </div>
                <div className="mt-3">
                  <Button
                    type="primary"
                    size="small"
                    onClick={() => {
                      setSelectedCity(city)
                      window.scrollTo({ top: 0, behavior: 'smooth' })
                    }}
                  >
                    Select
                  </Button>
                </div>
              </AntCard>
            </Col>
          )
        })}
      </Row>
    </div>
  )
}

export default AddPredefinedSpotsPage
