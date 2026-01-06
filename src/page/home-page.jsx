import React from 'react'
import CategoryPage from './category'
import Productpage from './product'
import ProductCategoryWise from './productCatgory_wise'

const HomePage = () => {
  return (
    <div>
      <CategoryPage/>
      <Productpage/>
      <ProductCategoryWise/>
    </div>
  )
}

export default HomePage
