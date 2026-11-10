import { MotionConfig } from 'framer-motion'
import { Explore } from './shell/Explore'
import { Presentation } from './shell/Presentation'
import { PresenterWindow } from './shell/PresenterPanel'
import { useRoute } from './shell/route'

export default function App() {
  const [route, go] = useRoute()
  return (
    <MotionConfig reducedMotion="user">
      {route.view === 'present' && <Presentation idx={route.idx} step={route.step} go={go} />}
      {route.view === 'explore' && <Explore section={route.section} go={go} />}
      {route.view === 'presenter' && <PresenterWindow />}
    </MotionConfig>
  )
}
