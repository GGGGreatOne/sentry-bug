import { Provider } from 'react-redux'
import store from '../state'

export default function StateProvider({ children }: { children: React.ReactNode }) {
  return <Provider store={store}>{children}</Provider>
}
