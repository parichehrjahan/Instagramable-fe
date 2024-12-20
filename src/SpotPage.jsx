import { useParams } from 'react-router'

const SpotPage = () => {
  const { id } = useParams()
  return <div>SpotPage {id}</div>
}

export default SpotPage
