import React, { useEffect, useState } from "react"
import LoginForm from "components/Customer/LoginForm"
import Layout from "components/Layout"

const Login = () => {

  return (
    <Layout page='login-page'>
      <LoginForm />
    </Layout>
  )
}

export default Login
