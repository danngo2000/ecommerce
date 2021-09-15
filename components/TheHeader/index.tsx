import React, { useState, FC } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import TrendingUpRoundedIcon from "@material-ui/icons/TrendingUpRounded";
import { Button } from "@material-ui/core";
import { useDispatch } from "react-redux";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import { useAppSelector } from "utils/redux";

import { auth } from "utils/firebase/utils";
import Logo from "../Header/Logo";
import SearchInput from "./SearchInput";
import TheMainMenu from "../Header/TheMainMenu";
import MiniCart from "components/Cart/MiniCart";
import CartNotifier from "components/Cart/CartNotifier";
import { UserIcon } from "../Icons/index";
import { AuthActions } from "../../store/reducers/authV1";

const Header: FC<any> = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [showSearch, setShowSearch] = useState(false);
  const handleShowSearch = () => {
    setShowSearch(!showSearch);
  };

  const handleSignOut = () => {
    dispatch(
      AuthActions.LOGOUT_REQUEST({
        cb: (res) => {
          if (res && res.isSuccess) router.push("/");
        },
      })
    );
    auth.signOut();
    // window.location.reload();
  };
  const { isGuest } = useAppSelector((state) => state.authv1);
  const { customerData } = useAppSelector((state) => state.customer);

  return (
    <div className="header">
      <div className="header-box">
        <div className="header-wrap">
          <div className="top-menu hideOnMobile">
            <div className="container top-bar-messenge">
              <span className="top-bar-text">
                Crazy deal! 40% discount for all products this week
              </span>
              <ul className="top-secondary-menu">
                
                {!isGuest ? (
                  <>
                    <li>
                      <a>Welcome, {customerData?.first_name} {customerData?.last_name}</a>
                    </li>
                    <li>
                      <Link href="/">
                        <a>Help Center</a>
                      </Link>
                    </li>
                    <li>
                      <Link href="/customer/orders">
                        <a>My Order</a>
                      </Link>
                    </li>
                    <li>
                      <a onClick={handleSignOut}>LogOut</a>
                    </li>
                  </>
                ) : (
                  <>
                  <li>
                    <Link href="/">
                      <a>Help Center</a>
                    </Link>
                  </li>
                    <li>
                      <Link href="/customer/register">
                        <a>Register</a>
                      </Link>
                    </li>
                    <li>
                      <Link href="/customer/login">
                        <a>Login</a>
                      </Link>
                    </li>
                  </>
                )}
              </ul>
            </div>
          </div>
          <div className="container">
            <div className="header-main">
              <div className="row">
                <div className="col-1 logo-box">
                  <Logo />
                </div>
                <div className="col-2 search-box">
                  <div className="search-bar">
                    <SearchInput />
                  </div>
                </div>
                <div className="col-3 user-nav">
                  <Link href="/customer/dashboard">
                    <a className="my-accoun-link">
                      <Button>
                        <UserIcon />
                      </Button>
                    </a>
                  </Link>
                  <Link href="/customer/mywishlist">
                    <a className="wishlist-link">
                      <Button>
                        <svg
                          data-icon="heart"
                          width="24"
                          height="24"
                          viewBox="0 0 20 20"
                        >
                          <path
                            d="M20 6.25C20 3.35 17.65 1 14.75 1c-1.02 0-1.95.31-2.75.82v-.04c-.09.06-.17.12-.26.19-.04.03-.09.06-.14.1-.68.51-1.24 1.18-1.6 1.96-.4-.86-1.04-1.57-1.8-2.1-.04-.02-.07-.05-.1-.08a7 7 0 0 0-.6-.33c-.13-.04-.23-.1-.35-.15-.05-.02-.1-.05-.15-.07v.02C6.45 1.13 5.87 1 5.25 1A5.25 5.25 0 0 0 0 6.25c0 .09.01.17.01.25H0c0 .06.01.12.02.18s.01.12.02.18C.13 7.89.44 9 1.07 10.17 2.23 12.33 4.1 14.11 7 16.53v.01c.9.75 1.89 1.55 3 2.46.71-.58 1.38-1.12 2-1.63 3.48-2.86 5.64-4.78 6.93-7.18.63-1.17.94-2.27 1.03-3.3.01-.07.01-.14.02-.21 0-.06.01-.11.02-.17h-.01c0-.09.01-.17.01-.26z"
                            fillRule="evenodd"
                          ></path>
                        </svg>
                      </Button>
                    </a>
                  </Link>
                  <button
                    onClick={handleShowSearch}
                    type="button"
                    className="search-mobile"
                  >
                    <svg
                      className="search-icon"
                      stroke="currentColor"
                      fill="currentColor"
                      strokeWidth="0"
                      viewBox="0 0 512 512"
                      height="1em"
                      width="1em"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M443.5 420.2L336.7 312.4c20.9-26.2 33.5-59.4 33.5-95.5 0-84.5-68.5-153-153.1-153S64 132.5 64 217s68.5 153 153.1 153c36.6 0 70.1-12.8 96.5-34.2l106.1 107.1c3.2 3.4 7.6 5.1 11.9 5.1 4.1 0 8.2-1.5 11.3-4.5 6.6-6.3 6.8-16.7.6-23.3zm-226.4-83.1c-32.1 0-62.3-12.5-85-35.2-22.7-22.7-35.2-52.9-35.2-84.9 0-32.1 12.5-62.3 35.2-84.9 22.7-22.7 52.9-35.2 85-35.2s62.3 12.5 85 35.2c22.7 22.7 35.2 52.9 35.2 84.9 0 32.1-12.5 62.3-35.2 84.9-22.7 22.7-52.9 35.2-85 35.2z"></path>
                    </svg>
                  </button>
                  <MiniCart />
                  <CartNotifier />
                  <div
                    className={`search-mobile-wrap ${
                      showSearch ? "active" : ""
                    }`}
                  >
                    <div className="header-search-mobile">
                      <Button onClick={handleShowSearch}>
                        <ArrowBackIcon />
                      </Button>
                      <div className="input-group">
                        <input
                          className="search-bar-input"
                          type="text"
                          placeholder="Search"
                        />
                      </div>
                    </div>
                    <div className="search-body">
                      <div className="keywords lso-keywords">
                        <h5 className="heading">
                          <TrendingUpRoundedIcon />
                          Trending Searches
                        </h5>
                        <div className="lso-keyword">
                          <Link href="/s/test">
                            <a>
                              <div className="keyword">Conditioner</div>
                            </a>
                          </Link>
                        </div>
                        <div className="lso-keyword">
                          <Link href="/s/test">
                            <a>
                              <div className="keyword">Huggies</div>
                            </a>
                          </Link>
                        </div>
                        <div className="lso-keyword">
                          <Link href="/s/test">
                            <a>
                              <div className="keyword">LEVI'S SHORT</div>
                            </a>
                          </Link>
                        </div>
                        <div className="lso-keyword">
                          <Link href="/s/test">
                            <a>
                              <div className="keyword">Man Watch</div>
                            </a>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="main-menu">
          <div className="container">
            <TheMainMenu />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
