import React, { useState, useEffect } from "react";
import { UpOutlined } from '@ant-design/icons'
import { useSelector } from 'react-redux'

const GoTopButton = () => {
  const [visible, setVisible] = useState(false);
  const [isMessButton, setIsMessButton] = useState(false)
  const [isDetailPage, setIsDetailPage] = useState(false)

  const siteName = useSelector(state => state.config['site/name'])
  
  const toggleVisible = () => {
    const scrolled = document.documentElement.scrollTop;
    if (scrolled > window.innerHeight) {
      setVisible(true);
    } else if (scrolled <= window.innerHeight) {
      setVisible(false);
    }
  };

  const detectDetailPage = () => {
    setIsDetailPage(window.location.pathname.split('/')[1]==='p')
  }

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const detectMessButton = () => {
    const goTopButton = document.getElementById("messButton");
    setIsMessButton(document.body.contains(goTopButton))
    if (siteName === 'BolsaDeal') setIsMessButton(true)
  };

  useEffect(() => {
    window.addEventListener("scroll", toggleVisible);
    detectMessButton();
    detectDetailPage();
  }, []);

  return (
    <UpOutlined style={{ fontSize: '30px'}}  onClick={scrollToTop} id="goTopButton" className={`${visible && `show`} ${isMessButton && `changePosition`} ${isDetailPage && `detailPage`}`}/>
  );
};

export default GoTopButton;
