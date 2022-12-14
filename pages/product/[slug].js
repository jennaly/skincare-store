import React, { useState, useEffect } from 'react';
import { AiOutlineMinus, AiOutlinePlus } from 'react-icons/ai'

import { client, urlFor } from '../../lib/client';
import { Product, FooterBanner } from '../../components';
import { useStateContext } from '../../context/StateContext';
import { useRouter } from 'next/router';
import Link from 'next/link';

const ProductDetails = ({ product, productsFromSameLine, footerBannerData }) => {

    const router = useRouter(); 

    const { image, name, description, price, ingredients, instruction } = product;
    const { onAdd, setShowCart } = useStateContext();
    const [productImageIndex, setProductImageIndex] = useState(0);
    const [qty, setQty] = useState(1);

    const handleBuyNow = () => {
        onAdd(product, qty)
        setShowCart(true);
    }

    const decQty = () => {
        setQty(prevQty => {
            if (prevQty - 1 < 1) return 1;

            return prevQty - 1;
        });
    }

    const incQty = () => {
        setQty(prevQty => {
            return prevQty + 1;
        })
    }

    
    const resetProductLocalState = () => {
        setProductImageIndex(0);
        setQty(1);
    }

    
    useEffect(() => {
        const handleRouteChange = () => {
            resetProductLocalState();
        }
        router.events.on("routeChangeComplete", handleRouteChange);

        return () => {
            router.events.off("routeChangeComplete", () => {
                console.log("stopped");
            })
        }
    }, [router.events]);


    return (
        <div>
            <div className="bg-base-100 px-5px">
                <div className="text-xs breadcrumbs flex lg:mt-3 lg:text-sm">
                        <ul className="mx-auto flex-wrap justify-center">
                            <li><Link href="/">Home</Link></li>
                            <li><Link href="/product/all">Products</Link></li>
                            <li>{name}</li>
                        </ul>
                </div>
                
                <div className="flex flex-col lg:flex-row gap-10 mt-3 lg:mt-10 w-11/12 lg:w-10/12 mx-auto justify-center">
                    <div className="md:max-w-lg md:mx-auto lg:mx-0 lg:max-w-xl">
                        <img src={urlFor(image && image[productImageIndex])} className="shadow-2xl w-full product-image" />
                        <div className="small-images-container flex justify-between gap-6 w-full">
                            {image?.map((item, i) => (
                                <div className="shadow-xl mt-4" key={i}>
                                    <img
                                        key={i} 
                                        src={urlFor(item)}
                                        className={i === productImageIndex ? 'small-image selected-image' : 'small-image'}
                                        onMouseEnter={() => setProductImageIndex(i)}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                    
                    <div className="flex flex-col max-w-lg mx-auto lg:mx-0 my-auto gap-4">
                        <h1 className="text-4xl font-bold">{name}</h1>
                        <h2 className="">${price.toFixed(2)}</h2>
                        <p className="">{description}</p>
                        <div className="quantity flex flex-row w-full items-center justify-between gap-4">
                            <h3>Quantity</h3>
                            <p className="flex product-quantity-selector rounded-md items-center w-full p-2 justify-between bg-base-200">
                                <button className="w-1/6 " onClick={decQty}><AiOutlineMinus className="product-quantity"/></button>
                                <span className="num inline-block p-2 px-4 w-4/6 text-center ">{qty}</span>
                                <button className="w-1/6" onClick={incQty}><AiOutlinePlus className="product-quantity"/></button>
                            </p>
                        </div>
                        <div className="buttons flex justify-between gap-4">
                            <button type="button" className="add-to-cart btn bg-green-700 hover:bg-green-600 border-none" onClick={() => onAdd(product, qty)}>Add to Cart</button>
                            <button type="button" className="buy-now btn btn-secondary bg-base-200 hover:bg-base-100 border border-green-700 hover:border-green-600 text-black" onClick={ handleBuyNow }>Buy Now</button>
                        </div>

                        <div tabIndex={0} className="collapse collapse-arrow border border-base-300 bg-base-100 rounded-md">
                            <div className="collapse-title text-xl font-medium">
                                Ingredients
                            </div>
                            <div className="collapse-content"> 
                                <p>{ingredients}</p>
                            </div>
                        </div>

                        <div tabIndex={0} className="collapse collapse-arrow border border-base-300 bg-base-100 rounded-md">
                            <div className="collapse-title text-xl font-medium">
                                Instruction
                            </div>
                            <div className="collapse-content"> 
                                <p>{instruction}</p>
                            </div>
                        </div>
                    </div>
                </div>


                <div className="flex flex-col mx-auto bg-base-100 gap-2 m-10 w-11/12 xl:w-10/12 justify-center">
    
                    <h3 className="text-3xl font-bold text-center">Explore the {product.productLine} Collection</h3>

                    <div className="flex flex-col lg:flex-row justify-center mx-auto">
                    {productsFromSameLine.map((product, index) => {
                        return (
                        <div className="card" key={index}>
                            <div className="card-body">
                                <Product key={product._id} product={product} dimensions={235}/>
                            </div>
                        </div>
                        )})}
                    </div>
                </div>
            
            </div>
            
            <FooterBanner footerBanner={footerBannerData.length && footerBannerData[0]} />
          
        </div> 
    )
}

export const getStaticPaths = async () => {
    const query = `*[_type == "product"] {
        slug {
            current
        }
    }`;

    const products = await client.fetch(query);

    const paths = products.map(product => ({
        params: {
            slug: product.slug.current,
        }
    }));

    return {
        paths,
        fallback: 'blocking',
    }
}


export const getStaticProps = async ({ params: { slug }}) => {
    const query = `*[_type == "product" && slug.current == '${slug}'][0]`;
    const productsQuery = '*[_type == "product"]';

    const product = await client.fetch(query);
    const products = await client.fetch(productsQuery);
    const productsFromSameLine = products.filter(e => e.productLine === product.productLine && e._id !== product._id);
    
    const footerBannerQuery = '*[_type == "footerBanner"]';
    const footerBannerData = await client.fetch(footerBannerQuery);

    return {
        props: {
          product,
          productsFromSameLine,
          footerBannerData
        }
    }
}


export default ProductDetails
