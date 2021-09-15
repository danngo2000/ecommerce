import RegisterForm from "components/Customer/RegisterForm"
import Layout from "components/Layout"
import React ,{ useEffect } from "react"
import { useRouter } from "next/dist/client/router"
import { useSelector } from "react-redux"
import { RootState } from "store"

const Register = () => {
  const Router = useRouter()
  const data: any = useSelector<RootState>(state => state.auth)
  useEffect(() => {
    if (!data.isGuest) {
      Router.push("/")
    }
  })
  return (
    <Layout page='register-page'>
      <RegisterForm />
    </Layout>
  )
}

export default Register