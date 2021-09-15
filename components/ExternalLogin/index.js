import React, { useEffect, useState } from 'react'
// import FacebookLogin from 'react-facebook-login'
// import GoogleLogin from 'react-google-login'
// import GoogleButton from './GoogleButton'
import { useDispatch, useSelector } from 'react-redux'
// import { publicKeysSelector } from 'store/config/config.selector'
import { loginRequest } from '../../actions/auth'
// import LoginFBDialog from './LoginFBDialog'
import axios from 'axios'

const isServer = typeof window !== 'object'

const Login = (props) => {
  const publicKeys = useSelector(publicKeysSelector)
  const [isOpenDialog, setIsOpenDialog] = useState(false)
  const { facebookProps, googleProps } = props
  const dispatch = useDispatch()
  const [facebookData, setFacebookData] = useState(null)
  
  useEffect(() => {
    if (publicKeys.facebook) {
      window.fbAsyncInit = function() {
       if (window.FB) {
        window.FB.init({
          appId      : publicKeys.facebook,
          cookie     : true,
          xfbml      : true,
          version    : 'v10.0'
        })
       }
      }
      (function(d, s, id){
          var js, fjs = d.getElementsByTagName(s)[0];
          if (d.getElementById(id)) {return;}
          js = d.createElement(s); js.id = id;
          js.src = "https://connect.facebook.net/en_US/sdk.js";
          fjs.parentNode.insertBefore(js, fjs);
        }(document, 'script', 'facebook-jssdk'));
    }
  }, [])

  const handleLoginFB = (response) => {
    try {
      dispatch(loginRequest({ facebookToken: response.accessToken, email: response.email }))
      if (typeof facebookProps.onResponse === 'function') facebookProps.onResponse(true)
    } catch (error) {
      console.log(error.message)
    }
  }

  const handleFacebookSuccess = async (response) => {
    if (!response.email) {
      let { data: { customer } } = await axios.get(`/customers/checkAccountFacebook?facebookId=${response.id}`)
      if (customer && customer.email) {
        let newData = { ...response, email: customer.email }
        handleLoginFB(newData)
      } else {
        setIsOpenDialog(true)
        setFacebookData(response)
      }
    } else handleLoginFB(response)
  }

  const handleFacebookFailure = (response) => {
    if (typeof facebookProps.onResponse === 'function') facebookProps.onResponse(false)
  }

  const handleGoogleSuccess = async (response) => {
    const { tokenObj, profileObj } = response
    if (tokenObj && profileObj) {
      dispatch(loginRequest({ googleToken: tokenObj.id_token }))
      // const result = await actions.customer.loginGoogle(tokenObj, profileObj)
      // if (result) {
      //   // const { shouldRedirect = false } = googleProps
      //   // if (shouldRedirect) router.back()
      //   if (typeof googleProps.onResponse === 'function') googleProps.onResponse(true)
      // }
    }
    if (typeof googleProps.onResponse === 'function') googleProps.onResponse(false)
  }

  const handleGoogleFailure = async (response) => {
    if (typeof googleProps.onResponse === 'function') googleProps.onResponse(false)
  }

  return (
    <div className='socialButtonsBox'>
      <LoginFBDialog facebookData={facebookData} isOpenDialog={isOpenDialog} setIsOpenDialog={setIsOpenDialog}
      handleFacebookSuccess={handleFacebookSuccess} />
      {
        facebookProps && !isServer && publicKeys.facebook && (
          <FacebookLogin
            appId={publicKeys.facebook}
            fields='name,email,picture'
            cssClass='facebookButton'
            icon={<img src='/static/images/svg/facebookF.svg' />}
            textButton={''}
            callback={handleFacebookSuccess}
            onFailure={handleFacebookFailure}
            {...facebookProps}
          />
        )
      }
      {
        googleProps && !isServer && publicKeys.oauth && (
          <GoogleLogin
            clientId={publicKeys.oauth}
            onSuccess={handleGoogleSuccess}
            onFailure={handleGoogleFailure}
            render={(props) => <GoogleButton {...props} {...googleProps} />}
            {...googleProps}
          />
        )
      }
    </div>
  )
}

export default React.memo(Login)
