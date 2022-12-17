import { RewardDistributorKind } from '@cardinal/staking/dist/cjs/programs/rewardDistributor'
import { AsyncButton } from 'common/Button'
import { FormFieldTitleInput } from 'common/FormFieldInput'
import { notify } from 'common/Notification'
import { tryFormatInput, tryParseInput } from 'common/units'
import { useHandleReclaimFunds } from 'handlers/useHandleReclaimFunds'
import {
  isRewardDistributorV2,
  useRewardDistributorData,
} from 'hooks/useRewardDistributorData'
import { useRewardDistributorTokenAccount } from 'hooks/useRewardDistributorTokenAccount'
import { useRewardMintInfo } from 'hooks/useRewardMintInfo'
import { useState } from 'react'

export const ReclaimFunds = () => {
  const [reclaimAmount, setReclaimAmount] = useState<string>()
  const rewardMintInfo = useRewardMintInfo()
  const rewardDistributor = useRewardDistributorData()
  const rewardDistributorTokenAccount = useRewardDistributorTokenAccount()
  const handleReclaimFunds = useHandleReclaimFunds()
  if (
    !rewardDistributor.data ||
    (rewardDistributor.data.parsed?.kind !== RewardDistributorKind.Treasury &&
      !isRewardDistributorV2(rewardDistributor.data.parsed))
  ) {
    return <></>
  }
  return (
    <div className="w-full">
      <FormFieldTitleInput
        title={'Reclaim funds'}
        description={'Reclaim funds from this reward distributor'}
      />
      <div className="mb-5 flex flex-row">
        <div
          className={`flex flex-grow appearance-none justify-between rounded border border-gray-500 bg-gray-700 py-3 px-4 leading-tight text-gray-200 placeholder-gray-500 focus:bg-gray-800`}
        >
          <input
            className={`mr-5 w-full bg-transparent focus:outline-none`}
            type="text"
            placeholder={'1000000'}
            value={tryFormatInput(
              reclaimAmount,
              rewardMintInfo.data?.mintInfo.decimals || 0,
              '0'
            )}
            onChange={(e) => {
              const value = Number(e.target.value)
              if (Number.isNaN(value)) {
                notify({
                  message: `Invalid reclaim amount`,
                  type: 'error',
                })
                return
              }
              setReclaimAmount(
                tryParseInput(
                  e.target.value,
                  rewardMintInfo.data?.mintInfo.decimals || 0,
                  reclaimAmount ?? ''
                )
              )
            }}
          />
          {rewardDistributorTokenAccount.data && (
            <div
              className="flex h-full cursor-pointer items-center justify-center"
              onClick={async () => {
                setReclaimAmount(
                  rewardDistributorTokenAccount.data?.amount.toString()
                )
              }}
            >
              Max
            </div>
          )}
        </div>
        <AsyncButton
          className="ml-4 rounded-md px-3 py-1"
          loading={handleReclaimFunds.isLoading}
          inlineLoader
          onClick={() =>
            handleReclaimFunds.mutate({
              reclaimAmount: reclaimAmount,
            })
          }
        >
          Reclaim Funds
        </AsyncButton>
      </div>
    </div>
  )
}
