import Sidebar from './components/Sidebar'
import Spots from './components/spots'

const App = () => {
  return (
    <>
      <Sidebar />
      <div className="ml-64">
        <Spots />
        <Spots />
        <Spots />
      </div>
    </>
  )
}

export default App
