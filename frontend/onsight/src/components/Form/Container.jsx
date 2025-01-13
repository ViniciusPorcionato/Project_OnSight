import React from 'react'
import { FormProvider } from 'react-hook-form'

export default function Container({ formMethods, children, onSubmit, ...rest }) {
    return (
      <FormProvider { ...formMethods }>
        <form onSubmit={formMethods.handleSubmit(onSubmit)} {...rest} >
            {children}
        </form>
      </FormProvider>
    )
}
