import React from "react"
import SwipeableViews from "react-swipeable-views"
import { withStyles, Theme, createStyles } from "@material-ui/core/styles"
import Tabs from "@material-ui/core/Tabs"
import Tab from "@material-ui/core/Tab"
import Link from "next/link"
import { Button } from "@material-ui/core"
import ArrowBackIcon from "@material-ui/icons/ArrowBack"
import { useRouter } from "next/router"
import Image from "next/image"
import { imageLoader } from "utils"

interface TabPanelProps {
  children?: React.ReactNode
  index: any
  value: any
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props

  return (
    <div role='tabpanel' hidden={value !== index} {...other}>
      {value === index && <>{children}</>}
    </div>
  )
}

const AntTabs = withStyles({
  indicator: {
    backgroundColor: "#106ba3"
  }
})(Tabs)

const AntTab = withStyles((theme: Theme) =>
  createStyles({
    root: {
      textTransform: "none",
      color: "#106ba3",
      minWidth: 72,
      marginRight: theme.spacing(4),
      fontFamily: ["Sofia Pro", "Roboto", "sans-serif"].join(","),
      "&:hover": {
        color: "#106ba3",
        opacity: 1
      },
      "&$selected": {
        color: "#106ba3",
        fontWeight: theme.typography.fontWeightMedium
      },
      "&:focus": {
        color: "#106ba3"
      }
    },
    selected: {}
  })
)((props: any) => <Tab disableRipple {...props} />)

const MyReviews = () => {
  const [value, setValue] = React.useState(0)

  const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setValue(newValue)
  }

  const handleChangeIndex = (index: number) => {
    setValue(index)
  }

  const router = useRouter()

  return (
    <div className='my-account-content myreview-page'>
      <div className='my-account-title'>
        <div className='title'>
          <Button
            className='back-icon'
            onClick={() => router.push("/customer")}
          >
            <ArrowBackIcon />
          </Button>
          <h1>My Reviews</h1>
        </div>
      </div>
      <div className='review-wrap'>
        <AntTabs value={value} onChange={handleChange}>
          <AntTab label='To Be Reviewed (0)' />
          <AntTab label='History (0)' />
        </AntTabs>
        <SwipeableViews index={value} onChangeIndex={handleChangeIndex}>
          <TabPanel value={value} index={0}>
            <div className='order-list mt-2'>
              <div className='content-box'>
                <div className='box-header'>
                  <label>Order ID:</label>
                  <Link href='/customer/orders/123213214'>
                    <a>#201641</a>
                  </Link>
                  <div className='created'>
                    Place on&nbsp;
                    <time>Wednesday, June 30, 2021 11:54 AM</time>
                  </div>
                  <div className='actions'>
                    <Link href='/customer/orders/12321321'>
                      <a>Manage</a>
                    </Link>
                  </div>
                </div>
                <div className='content-body'>
                  <div className='order-item'>
                    <div className='column column-item-thumbnail'>
                      <Image
                        loader={imageLoader}
                        src='/images/media/default.png'
                        width={97}
                        height={130}
                        objectFit='contain'
                        alt=''
                      />
                    </div>
                    <div className='column column-item-name'>
                      Xe đẩy Cybex Eezy S, đảo chiều nhanh gọn, màu xanh denim
                    </div>
                    <div className='column column-status'>
                      <Button>Review</Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabPanel>
          <TabPanel value={value} index={1}>
            <div className='order-list mt-2'>
              <div className='content-box'>
                <div className='box-header'>
                  <label>Order ID:</label>
                  <Link href='/customer/orders/123213214'>
                    <a>#201641</a>
                  </Link>
                  <div className='created'>
                    Place on&nbsp;
                    <time>Wednesday, June 30, 2021 11:54 AM</time>
                  </div>
                  <div className='actions'>
                    <Link href='/customer/orders/12321321'>
                      <a>Manage</a>
                    </Link>
                  </div>
                </div>
                <div className='content-body'>
                  <div className='order-item'>
                    <div className='column column-item-thumbnail'>
                      <Image
                        loader={imageLoader}
                        src='/images/media/default.png'
                        width={97.5}
                        height={130}
                        objectFit='contain'
                        alt=''
                      />
                    </div>
                    <div className='column column-item-name'>
                      Xe đẩy Cybex Eezy S, đảo chiều nhanh gọn, màu xanh denim
                    </div>
                    <div className='column column-status'>
                      <Button>Review</Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabPanel>
        </SwipeableViews>
      </div>
    </div>
  )
}

export default MyReviews
