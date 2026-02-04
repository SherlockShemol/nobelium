import { useRouter } from 'next/router'
import useAckee from 'use-ackee'

interface AckeeProps {
  ackeeServerUrl: string
  ackeeDomainId: string
}

const Ackee = ({ ackeeServerUrl, ackeeDomainId }: AckeeProps) => {
  const router = useRouter()
  useAckee(
    router.asPath,
    { server: ackeeServerUrl, domainId: ackeeDomainId },
    { detailed: false, ignoreLocalhost: true }
  )
  return null
}

export default Ackee
