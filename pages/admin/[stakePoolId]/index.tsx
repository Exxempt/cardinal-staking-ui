import { Tooltip } from '@mui/material'
import { FooterSlim } from 'common/FooterSlim'
import { HeaderSlim } from 'common/HeaderSlim'
import { ShortPubKeyUrl } from 'common/Pubkeys'
import { getMintDecimalAmountFromNatural } from 'common/units'
import { pubKeyUrl, shortPubKey } from 'common/utils'
import { AuthorizeMints } from 'components/AuthorizeMints'
import { CloseRewardDistributor } from 'components/CloseRewardDistributor'
import { MintMultiplierLookup } from 'components/MintMultiplierLookup'
import { MintMultipliers } from 'components/MintMultipliers'
import { ReclaimFunds } from 'components/ReclaimFunds'
import { StakePoolForm } from 'components/StakePoolForm'
import { TransferFunds } from 'components/TransferFunds'
import { useHandleUpdatePool } from 'handlers/useHandleUpdatePool'
import { useRewardDistributorData } from 'hooks/useRewardDistributorData'
import { useRewardMintInfo } from 'hooks/useRewardMintInfo'
import { useStakePoolData } from 'hooks/useStakePoolData'
import { useStakePoolMetadata } from 'hooks/useStakePoolMetadata'
import Head from 'next/head'
import { useEnvironmentCtx } from 'providers/EnvironmentProvider'

function Home() {
  const { environment } = useEnvironmentCtx()
  const stakePool = useStakePoolData()
  const rewardDistributor = useRewardDistributorData()
  const rewardMintInfo = useRewardMintInfo()
  const { data: stakePoolMetadata } = useStakePoolMetadata()
  const handleUpdatePool = useHandleUpdatePool()

  return (
    <div>
      <Head>
        <title>
          {`${
            stakePoolMetadata ? stakePoolMetadata.displayName : 'Cardinal'
          } Staking UI`}
        </title>
        <meta name="description" content="Generated by Cardinal Staking UI" />
        <link
          rel="icon"
          href={stakePoolMetadata ? stakePoolMetadata.imageUrl : `/favicon.ico`}
        />
        <script
          defer
          data-domain="stake.cardinal.so"
          src="https://plausible.io/js/plausible.js"
        />
      </Head>

      <HeaderSlim />
      <div className="container mx-auto w-full bg-[#1a1b20]">
        <div className="my-2 h-full min-h-[55vh] rounded-md bg-white bg-opacity-5 p-10 text-gray-200">
          {!stakePool.isFetched || !rewardDistributor.isFetched ? (
            <div className="h-[40vh] w-full animate-pulse rounded-md bg-white bg-opacity-10"></div>
          ) : stakePool.data ? (
            <div className="grid h-full grid-cols-2 gap-4 ">
              <div>
                <p className="text-lg font-bold">Update Staking Pool</p>
                <p className="mt-1 mb-2 text-sm">
                  All parameters for staking pool are optional and pre-filled
                  with existing values for ease of use.
                </p>
                <StakePoolForm
                  type="update"
                  handleSubmit={(d) => handleUpdatePool.mutate({ values: d })}
                  stakePoolData={stakePool.data}
                  rewardDistributorData={rewardDistributor.data}
                />
                <div className="mt-2 italic">
                  NOTE: Changing <strong>rewardAmount</strong>/
                  <strong>rewardDurationSeconds</strong> will affect the
                  distribution for currently staked and not-yet claimed rewards
                  to this new rate.
                  <br></br>
                  Changing <strong>multiplierDecimals</strong> will apply these
                  decimals to all existing multipliers.<br></br>
                  Changing <strong>defaultMultiplier</strong> will only apply to
                  new reward entries being created.
                </div>
              </div>
              <div>
                <p className="text-lg font-bold">Current Staking Pool</p>
                <p className="mt-1 mb-5 text-sm">
                  The parameters currently in place for the stake pool
                </p>
                {stakePool.isFetched ? (
                  <>
                    {/* <span className="flex w-full flex-wrap md:mb-0">
                      <div className="inline-block text-sm font-bold uppercase tracking-wide text-gray-200">
                        Overlay Text:
                      </div>
                      <div className="inline-block pl-2">
                        {stakePool.data?.parsed?.overlayText || '[None]'}
                      </div>
                    </span> */}
                    <span className="mt-3 flex w-full flex-wrap md:mb-0">
                      <div className="inline-block text-sm font-bold uppercase tracking-wide text-gray-200">
                        Collection Addresses:
                      </div>
                      <label className="inline-block pl-2">
                        {stakePool.data?.parsed?.allowedCollections &&
                        stakePool.data?.parsed.allowedCollections.length !== 0
                          ? stakePool.data?.parsed.allowedCollections.map(
                              (collection) => (
                                <ShortPubKeyUrl
                                  key={collection.toString()}
                                  pubkey={collection}
                                  cluster={environment.label}
                                  className="pr-2 text-sm text-white"
                                />
                              )
                            )
                          : '[None]'}
                      </label>
                    </span>
                    <span className="mt-3 flex w-full flex-wrap md:mb-0">
                      <div className="inline-block text-sm font-bold uppercase tracking-wide text-gray-200">
                        Creator Addresses:
                      </div>
                      <label className="inline-block pl-2 text-white">
                        {stakePool.data?.parsed?.allowedCreators &&
                        stakePool.data?.parsed.allowedCreators.length !== 0
                          ? stakePool.data?.parsed.allowedCreators.map(
                              (creator) => (
                                <ShortPubKeyUrl
                                  key={creator.toString()}
                                  pubkey={creator}
                                  cluster={environment.label}
                                  className="pr-2 text-sm font-bold underline underline-offset-2"
                                />
                              )
                            )
                          : '[None]'}
                      </label>
                    </span>
                    <span className="mt-3 flex w-full flex-wrap md:mb-0">
                      <label className="inline-block text-sm font-bold uppercase tracking-wide text-gray-200">
                        Requires Authorization:{' '}
                        {(stakePool.data?.parsed?.requiresAuthorization
                          ? 'True'
                          : 'False') || '[None]'}
                      </label>
                    </span>
                    <span className="mt-3 flex w-full flex-wrap md:mb-0">
                      <label className="inline-block text-sm font-bold uppercase tracking-wide text-gray-200">
                        Cooldown Period Seconds:{' '}
                        {stakePool.data?.parsed?.cooldownSeconds || '[None]'}
                      </label>
                    </span>
                    <span className="mt-3 flex w-full flex-wrap md:mb-0">
                      <label className="inline-block text-sm font-bold uppercase tracking-wide text-gray-200">
                        Minimum Stake Seconds:{' '}
                        {stakePool.data?.parsed?.minStakeSeconds || '[None]'}
                      </label>
                    </span>
                    <span className="mt-3 flex w-full flex-wrap md:mb-0">
                      <label className="inline-block text-sm font-bold uppercase tracking-wide text-gray-200">
                        End Date:{' '}
                        {stakePool.data?.parsed?.endDate
                          ? new Date(
                              stakePool.data?.parsed.endDate?.toNumber() * 1000
                            ).toDateString()
                          : '[None]'}
                      </label>
                    </span>
                    {rewardDistributor.data && (
                      <>
                        <span className="mt-3 flex w-full flex-wrap md:mb-0">
                          <Tooltip
                            title={'Use to add more funds to reward ditributor'}
                            placement="right"
                          >
                            <label className="inline-block text-sm font-bold uppercase tracking-wide text-gray-200">
                              Reward Distributor:{' '}
                              <a
                                target={'_blank'}
                                className="underline underline-offset-2"
                                href={pubKeyUrl(
                                  rewardDistributor.data.pubkey,
                                  environment.label
                                )}
                                rel="noreferrer"
                              >
                                {shortPubKey(rewardDistributor.data.pubkey)}
                              </a>{' '}
                            </label>
                          </Tooltip>
                        </span>
                        <span className="mt-3 flex w-full flex-wrap md:mb-0">
                          <label className="inline-block text-sm font-bold uppercase tracking-wide text-gray-200">
                            Reward Duration Seconds:{' '}
                            {rewardDistributor.data.parsed?.rewardDurationSeconds.toString() ||
                              '[None]'}
                          </label>
                        </span>
                        <span className="mt-3 flex w-full flex-wrap md:mb-0">
                          <label className="inline-block text-sm font-bold uppercase tracking-wide text-gray-200">
                            Reward Amount:{' '}
                            {rewardDistributor.data.parsed?.rewardAmount &&
                            rewardMintInfo.data
                              ? getMintDecimalAmountFromNatural(
                                  rewardMintInfo.data?.mintInfo,
                                  rewardDistributor.data.parsed.rewardAmount
                                ).toNumber()
                              : '[None]'}
                          </label>
                        </span>
                        <span className="mt-3 flex w-full flex-wrap md:mb-0">
                          <label className="inline-block text-sm font-bold uppercase tracking-wide text-gray-200">
                            Maximum reward seconds:{' '}
                            {rewardDistributor.data.parsed?.maxRewardSecondsReceived?.toString() ||
                              '[None]'}
                          </label>
                        </span>
                        <span className="mt-3 flex w-full flex-wrap md:mb-0">
                          <label className="inline-block text-sm font-bold uppercase tracking-wide text-gray-200">
                            Default Multiplier:{' '}
                            {rewardDistributor.data.parsed?.defaultMultiplier.toNumber() ||
                              '[None]'}
                          </label>
                        </span>
                        <span className="mt-3 flex w-full flex-wrap md:mb-0">
                          <label className="inline-block text-sm font-bold uppercase tracking-wide text-gray-200">
                            Multiplier Decimals:{' '}
                            {rewardDistributor.data.parsed
                              ?.multiplierDecimals || '[None]'}
                          </label>
                        </span>
                      </>
                    )}
                  </>
                ) : (
                  <div className="relative flex h-8 w-full items-center justify-center">
                    <span className="text-gray-500"></span>
                    <div className="absolute w-full animate-pulse items-center justify-center rounded-lg bg-white bg-opacity-10 p-5"></div>
                  </div>
                )}
                {rewardDistributor.data && rewardMintInfo.data && (
                  <div className="mt-10">
                    <CloseRewardDistributor />
                    <ReclaimFunds />
                    <TransferFunds />
                    <MintMultiplierLookup />
                    <MintMultipliers />
                  </div>
                )}
                {stakePool.data?.parsed?.requiresAuthorization && (
                  <AuthorizeMints />
                )}
              </div>
            </div>
          ) : (
            <div className="w-full text-center text-gray-500">
              No stake pool found
            </div>
          )}
        </div>
      </div>
      <FooterSlim />
    </div>
  )
}

export default Home
