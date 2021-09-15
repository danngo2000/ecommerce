import React, { Component } from 'react'

export default class ShoppingGuide extends Component {
  render() {
    return (
      <div className='shoppingGuide'>
        <b>Quý khách mua hàng xin lưu ý :</b>
        <ul style={{ listStyleType: 'disc' }}>
          <li>
            Sản phẩm được bán và đảm bảo chất lượng bởi Amazon tại Mỹ,
            <strong>&ensp;không có sẵn tại Việt Nam.&ensp;Lati</strong>&ensp;là
            đơn vị trung gian hỗ trợ quý khách mua hàng.
          </li>
          <li>
            Sau khi nhận được đơn đặt hàng và tiền thanh toán của quý khách,
            hàng hóa sẽ được Amazon gửi từ Mỹ về Việt Nam,&ensp;
            <strong> Lati</strong>&ensp;sẽ thực hiện giao hàng miễn phí tới tận
            nhà quý khách sớm nhất có thể.
          </li>
          <li>
            Thời gian chờ hàng thông thường khoảng
            <strong>&ensp;15 đến 30 ngày,&ensp;Lati</strong>&ensp;luôn cố gắng
            giao hàng sớm nhất có thể cho quý khách, tuy nhiên hàng có thể về
            chậm hơn vì nhiều lý do như chậm, lỡ chuyến bay, nhà cung cấp tại Mỹ
            giao hàng chậm, thiên tai, chiến tranh... trong trường hợp này rất
            mong quý khách thông cảm chờ đợi thêm.
          </li>
          <li>
            Trước khi mua hàng quý khách vui lòng xem kỹ hình ảnh, mô tả sản
            phẩm, lựa chọn kỹ các thông số sản phẩm như size, màu.&ensp;
            <strong>Lati</strong>&ensp;chỉ chịu trách nhiệm đổi trả khi hàng về
            không đúng với mô tả trên website khi quý khách mua hàng.
          </li>
          <li>
            Hàng hóa được bảo hành theo chính sách bảo hành của hãng, trong
            trường hợp hãng không có trung tâm bảo hành tại Việt Nam,&ensp;
            <strong>Lati</strong>&ensp;có thể hỗ trợ quý khách gửi hàng về Mỹ
            bảo hành.
          </li>
        </ul>
      </div>
    )
  }
}
