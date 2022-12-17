import { FormFieldTitleInput } from 'common/FormFieldInput'
import { LoadingSpinner } from 'common/LoadingSpinner'
import { useMintMultiplier } from 'hooks/useMintMultiplier'
import { useState } from 'react'

export const MintMultiplierLookup = () => {
  const [mintLookupId, setMintLookupId] = useState<string>('')
  const mintMultiplier = useMintMultiplier(mintLookupId)

  return (
    <div className="mb-5">
      <FormFieldTitleInput
        title={'Lookup mint multiplier'}
        description={'Remember to account for multiplier decimals'}
      />
      <div className="flex items-center gap-2">
        <input
          className="flex-grow appearance-none flex-col rounded border border-gray-500 bg-gray-700 py-3 px-4 leading-tight text-gray-200 placeholder-gray-500 focus:bg-gray-800 focus:outline-none"
          type="text"
          placeholder={'Enter Mint ID'}
          onChange={(e) => {
            setMintLookupId(e.target.value)
          }}
        />
        <div className="w-1/6">
          <div className="flex items-center justify-center rounded-md border border-gray-500 py-3 px-4 leading-tight">
            {mintMultiplier.isLoading ? (
              <LoadingSpinner height="30" />
            ) : (
              mintMultiplier.data ?? '-'
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
