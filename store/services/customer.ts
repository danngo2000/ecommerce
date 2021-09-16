import restful from '../../utils/restful'

export interface Payload{
    req?:any,
    ID?:string
}

const { POST } = restful

// /api/orders/customer/updateStatus
async function receivedOrderByCustomer(payload: Payload) {
    try {
        return await POST('/orders/customer/updateStatus', payload)
    } catch (err) {
        return err
    }
}
// /api/orders/customer/return-all
async function refundOrderByCustomer(payload: Payload) {
    try {
        return await POST('/orders/customer/return-all', payload)
    } catch (err) {
        return err
    }
}

// /api/orders/customer/return-all
async function cancelOrderByCustomer(payload: Payload) {
    try {
        return await POST('/orders/customer/cancel', payload)
    } catch (err) {
        return err
    }
}


export {
    receivedOrderByCustomer,
    refundOrderByCustomer,
    cancelOrderByCustomer
}