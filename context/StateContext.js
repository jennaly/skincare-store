import React, { createContext, useContext, useState } from 'react';
import { toast } from 'react-hot-toast';

const Context = createContext();

export const StateContext = ({ children }) => {
    const [showCart, setShowCart] = useState(false);
    const [cartItems, setCartItems] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const [totalQuantities, setTotalQuantities] = useState(0);

    let foundProduct;

    const onAdd = (product, quantity) => {
        const checkProductInCart = cartItems.find(item => item._id === product._id);

        setTotalPrice(prevTotalPrice => prevTotalPrice + product.price * quantity);
        setTotalQuantities(prevTotalQuantities => prevTotalQuantities + quantity);

        if (checkProductInCart) {
          
            const updatedCartItems = cartItems.map(cartProduct => {
                if (cartProduct._id === product._id) return {
                    ...cartProduct,
                    quantity: cartProduct.quantity + quantity,
                }
            })

            setCartItems(updatedCartItems);
           
        } else {
            product.quantity = quantity;
            setCartItems([...cartItems, {...product}]);
        }

        toast.success(`${quantity} ${product.name} added to the cart.`)
    }

    const onRemove = (product) => {
        foundProduct = cartItems.find(item => item._id === product._id);

        const remainingCartItems = cartItems.filter(item => item._id !== foundProduct._id);

        setCartItems(remainingCartItems);
        setTotalPrice(prevTotalPrice => prevTotalPrice - foundProduct.quantity * foundProduct.price);
        setTotalQuantities(prevTotalQuantities => prevTotalQuantities - foundProduct.quantity);

        
    }
    const toggleCartItemQuantity = (id, value) => {
        foundProduct = cartItems.find(item => item._id === id);

        const incCartItemQty = cartItems.map(item => {
            if (item._id === foundProduct._id) {
                return {
                    ...item,
                    quantity: item.quantity + 1,
                }
            } else {
                return {
                    ...item,
                }
            }
        })

        const decCartItemQty = cartItems.map(item => {
            if (item._id === foundProduct._id) {
                return {
                    ...item,
                    quantity: item.quantity - 1,
                }
            } else {
                return {
                    ...item,
                }
            }
        })

        if (value === 'inc') {
            setCartItems(incCartItemQty);
            setTotalPrice(prevTotalPrice => prevTotalPrice + foundProduct.price);
            setTotalQuantities(prevTotalQuantities => prevTotalQuantities + 1);

        } else if (value === 'dec') {
            if (foundProduct.quantity > 1) {
                setCartItems(decCartItemQty);
                setTotalPrice(prevTotalPrice => prevTotalPrice - foundProduct.price);
                setTotalQuantities(prevTotalQuantities => prevTotalQuantities - 1);
            }
        }
    }


    return (
        <Context.Provider
            value={{
                showCart,
                setShowCart,
                cartItems,
                totalPrice,
                totalQuantities,
                onAdd,
                onRemove,
                toggleCartItemQuantity,
                setCartItems,
                setTotalPrice,
                setTotalQuantities,
            }}
        >
            {children}
        </Context.Provider>
    )
}

export const useStateContext = () => useContext(Context);