const catchAsyncErrors = require('../backend/middleware/catchAsyncErrors')
const Product = require('../backend/models/productModel')
const ApiFeatures = require('../backend/utils/apiFeatures')
const ErrorHandler = require('../backend/utils/errorHandler')


// create product by admin

exports.createProduct = catchAsyncErrors(async (req, res, next) => {
    req.body.user = req.user.id
    const product = await Product.create(req.body)
    res.status(200).json({ success: true, product })
})


// get all products
exports.getAllProducts = catchAsyncErrors(async (req, res) => {
    const resultPerPage = 5
    const productCount = await Product.countDocuments()
    const apiFeature = new ApiFeatures(Product.find(), req.query)
        .search()
        .filter()
        .pagination(resultPerPage)
    const products = await apiFeature.query;
    res.status(200).json({ success: true, products,productCount })
})
// get product details

exports.getProductDetails = catchAsyncErrors(async (req, res, next) => {
    const product = await Product.findById(req.params.id)
    if (!product) {
        return next(new ErrorHandler("Product not found", 404))
    }
    res.status(200).json({ success: true, product,productCount })
})

// update product by 
exports.updateProduct = catchAsyncErrors(async (req, res) => {
    let product = await Product.findById(req.params.id)
    if (!product) {
        return next(new ErrorHandler("Product not found", 404))
    }
    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    })
    res.status(200).json({ success: true, product })
})


// delete product
exports.deleteProduct = catchAsyncErrors(async (req, res) => {
    const product = await Product.findByIdAndDelete(req.params.id)
    if (!product) {
        return next(new ErrorHandler("Product not found", 404))
    }
    res.status(200).json({ success: true, message: "Product deleted successfully" })
})

// create/update review
exports.createProductReview = catchAsyncErrors(async (req, res, next) => {
    const {rating,comment,productId}= req.body
    const review = {
        user : req.user._id,
        name : req.user.name,
        rating : Number(rating),
        comment
    }
    const product = await Product.findById(productId)
    const isReviewed = product.reviews.find(r => r.user.toString() === req.user._id.toString())
    console.log(isReviewed)
    if(isReviewed){
        product.reviews.forEach(r=>{
            if(r.user.toString() === req.user._id.toString()){
                r.comment = comment
                r.rating = rating
            }
        })

    }
    else{
        product.reviews.push(review)
        product.noOfReviews = product.reviews.length
    }
        let avg=0
        product.reviews.forEach(r=>{
            avg += r.rating 
        })
        
        product.ratings  = avg/product.reviews.length
        await product.save({validateBeforeSave:false})
        res.status(200).json({ success: true})
        
    
})


// get all reviews of a product
exports.getProductReview = catchAsyncErrors(async (req, res, next) => {
    const product= await Product.findById(req.query.id)

    if (!product) {
        return next(new ErrorHandler("Product not found", 404))
    }
    res.status(200).json({ 
        success: true, 
        reviews: product.reviews
    })
})
// get all reviews of a product
exports.deleteReview = catchAsyncErrors(async (req, res, next) => {
    const product= await Product.findById(req.query.productId)

    if (!product) {
        return next(new ErrorHandler("Product not found", 404))
    }
    const reviews = product.reviews.filter(rev=> rev._id.toString() !== req.query.id.toString())

    let avg=0
    reviews.forEach(r=>{
            avg += r.rating 
        })
        
    ratings  = avg/product.reviews.length
    const noOfReviews=reviews.length
    await Product.findByIdAndUpdate(req.query.productId,{
        reviews,
        ratings,
        noOfReviews
    },{
        new:true,
        runValidators:true,
        useFindAndModify:false
    })

    res.status(200).json({ 
        success: true
    })
})