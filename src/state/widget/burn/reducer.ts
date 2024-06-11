import { createReducer } from '@reduxjs/toolkit'
import { Field, typeInput, selectCurrency } from './actions'

export interface BurnState {
  readonly independentField: Field
  readonly typedValue: string
  readonly [Field.CURRENCY_A]: {
    readonly currencyId: string | undefined
  }
  readonly [Field.CURRENCY_B]: {
    readonly currencyId: string | undefined
  }
}

const initialState: BurnState = {
  independentField: Field.LIQUIDITY,
  typedValue: '0',
  [Field.CURRENCY_A]: {
    currencyId: ''
  },
  [Field.CURRENCY_B]: {
    currencyId: ''
  }
}

export default createReducer<BurnState>(initialState, builder =>
  builder
    .addCase(typeInput, (state, { payload: { field, typedValue } }) => {
      return {
        ...state,
        independentField: field,
        typedValue
      }
    })
    .addCase(selectCurrency, (state, { payload: { currencyId, field } }) => {
      const otherField = field === Field.CURRENCY_A ? Field.CURRENCY_B : Field.CURRENCY_A
      if (currencyId === state[otherField].currencyId) {
        // the case where we have to swap the order
        return {
          ...state,
          independentField: state.independentField === Field.CURRENCY_A ? Field.CURRENCY_B : Field.CURRENCY_A,
          [field]: { currencyId: currencyId },
          ...(field === Field.CURRENCY_A || field === Field.CURRENCY_B
            ? { [otherField]: { currencyId: state[field].currencyId } }
            : {})
        }
      } else {
        return {
          ...state,
          [field]: { currencyId: currencyId }
        }
      }
    })
)
