import React from 'react';
import { client } from '../../lib/client';
import { Product, FooterBanner } from '../../components';

import Link from 'next/link';

const all = ({ products, footerBannerData }) => {
    return (
        <>
            <div className="flex flex-col justify-center bg-base-100 md:w-10/12 xl:w-9/12 mx-auto px-[20px] mb-10">
                <div className="text-xs breadcrumbs flex lg:mt-3 lg:text-sm">
                            <ul className="mx-auto flex-wrap justify-center">
                                <li><Link href="/">Home</Link></li>
                                <li><Link href="/">Products</Link></li>
                                <li>All Products</li>
                            </ul>
                </div>

                <div className="flex flex-wrap gap-y-8 justify-between mt-3 lg:mt-10">
                    {products?.map((product, index) => {
                        return (
                    
                            <div className="w-[48%] lg:w-[30%] xl:w-[23%]" key={index}>
                                <Product key={product._id} product={product} dimensions={500} />
                            </div>
                    
                        )})}
                </div>
            </div>

            <FooterBanner footerBanner={footerBannerData.length && footerBannerData[0]} />
        </>
    )
}

export const getServerSideProps = async () => {
    const query = '*[_type == "product"]';
    const products = await client.fetch(query);

    const footerBannerQuery = '*[_type == "footerBanner"]';
    const footerBannerData = await client.fetch(footerBannerQuery);


    return {
        props: {
            products,
            footerBannerData
        }
    }
}

export default all
