import React, {useState, useEffect} from 'react'
import { getAddressById } from '../../helpers/addressHelper';

export const OrderConfirmation = ({ location }) => {
    
    const { cartItems, dataShippingAddressId,dataBillingAddressId , shipping_method, cartFinalTotal } = location.state;
    const [billingAddress, setBillingAddress] = useState(null);
    const [shippingAddress, setShippingAddress] = useState(null);

    useEffect(() => {
        try{
            getAddressById(dataBillingAddressId)
            .then(response => {
                if (response.ok) {
                    return response.json();
                }
                throw new Error('Network response was not ok');
            })
            .then(data => {
                setBillingAddress(data);
            })
            .catch(error => {
                console.error('There was a problem with the fetch operation:', error);
            });
            getAddressById(dataShippingAddressId)
            .then(response => {
                if (response.ok) {
                    return response.json();
                }
                throw new Error('Network response was not ok');
            })
            .then(data => {
                setShippingAddress(data);
            })
            .catch(error => {
                console.error('There was a problem with the fetch operation:', error);
            });
        }
        catch(err){
            console.error(err);
        }
    }, [dataBillingAddressId, dataShippingAddressId]);
    return (
        <div className="container my-5">
            <div className="row">
                <div className="col-md-8 order-md-1">
                <h4 className="mb-3">Order Summary</h4>
                <div className="mb-3">
                    <h6>Shipping Address:</h6>
                    <p>{shippingAddress.address_line_1}</p>
                    <p>{shippingAddress.address_line_2}</p>
                    <p>{shippingAddress.city}, {dataShippingAddressId.state} {dataShippingAddressId.pincode}</p>
                    <p>{shippingAddress.country}</p>
                </div>
                <div className="mb-3">
                    <h6>Billing Address:</h6>
                    <p>{billingAddress.address_line_1}</p>
                    <p>{billingAddress.address_line_2}</p>
                    <p>{billingAddress.city}, {dataBillingAddressId.state} {dataBillingAddressId.pincode}</p>
                    <p>{billingAddress.country}</p>
                </div>
                <div className="mb-3">
                    <h6>Shipping Method:</h6>
                    <p>{shipping_method}</p>
                </div>
                <div className="mb-3">
                    <h6>Order Total:</h6>
                    <p>{cartFinalTotal}</p>
                </div>
                <h4 className="mb-3">Order Items</h4>
                <ul className="list-group mb-3">
                    {cartItems.map((item) => (
                    <li className="list-group-item d-flex justify-content-between lh-condensed">
                        <div>
                        <h6 className="my-0">{item.product_id.name}</h6>
                        <small className="text-muted">{item.product_id.description}</small>
                        </div>
                        <span className="text-muted">${item.item_total}</span>
                    </li>
                    ))}
                </ul>
                </div>
            </div>
        </div>
    )
}
