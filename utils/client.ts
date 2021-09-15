// import Router from 'next/router'
// import configEnv from 'settings'
// import NProgress from 'nprogress'
// import { loadProgressBar } from 'axios-progress-bar'
import axios, { AxiosRequestConfig } from "axios";
// import { notification, message } from "antd";

const isServer = typeof window === "undefined";

const makeErrorMessage = (response: any) => {
  if (typeof response.data === "string" && response.data) return response.data;
  if (response.data && response.data.message) return response.data.message;
  return response.statusText || "Unknown Error";
};

export const onClientStart = () => {
  if (!isServer) {
    // message.config({
    //   top: 100,
    //   duration: 3,
    //   maxCount: 1,
    // });
    // notification.config({
    //   placement: "topRight",
    // });
    axios.interceptors.request.use(
      (config: AxiosRequestConfig) => {
        const token = localStorage.getItem("token");
        if (token) config.headers.Authorization = 'Bearer ' + token;
        // console.log('token',token)
        // console.log('c',config.headers)
        return config;
      },
      (e) => Promise.reject(e)
    );
    // loadProgressBar()
    axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response) {
          if (error.response.status === 401) {
            // const shouldLogout = [configEnv.api + 'customers/allinone',  'customers/allinone'].includes(error.response.config.url)
            const shouldLogout =
              error.response.data?.message === "This account no longer exists";
            if (shouldLogout) {
              window.localStorage.removeItem("token");
              axios.defaults.headers.common["Authorization"] = undefined;
              window.location.reload();
            }
          } else {
            // notification.error({
            //   message: makeErrorMessage(error.response),
            // });
          }
          return Promise.reject(error.response);
        }
      }
    );
    // Router.events.on('routeChangeStart', () => NProgress.start())
    // Router.events.on('routeChangeComplete', () => NProgress.done())
    // Router.events.on('routeChangeError', () => NProgress.done())
  }
};
