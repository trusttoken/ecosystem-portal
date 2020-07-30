import React, { useContext } from 'react'

import { DataContext } from '@/providers/data'
import BorderedCard from '@/components/BorderedCard'
import GrantDetail from '@/components/GrantDetail'

const GrantDetailCard = () => {
  const data = useContext(DataContext)

  return (
    <BorderedCard>
      {data.grants.length > 0 ? (
        <GrantDetail grants={data.grants} />
      ) : (
        <div className="empty">You don&apos;t have any token grants</div>
      )}
    </BorderedCard>
  )
}

export default GrantDetailCard
