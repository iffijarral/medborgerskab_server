const asyncHandler = require('express-async-handler')
const Package = require('../models').Package

// @des Get all packages of type customer
// @route   GET /api/packages
// @access  Private
const getPackages = asyncHandler(async (req, res) => {

    try
    {
      const packages = await Package.findAll()

      res.status(200).json(packages)
    }
    catch (error) {    
      res.status(404)
      throw new Error('An Error occured while fetching data ')
    }
        
})

// @des Get package
// @route   GET /api/packages/:id
// @access  Private
const getPackage = asyncHandler(async (req, res) => {
  const {id} = req.params
  console.log(id)
  try
  {
    const package = await Package.findByPk(id)
    
    if(package)     
      res.status(200).json(package)
    else {
      res.status(404)
      throw new Error('An Error occured while fetching data ')
    }
  }
  catch (error) {   
    console.log(error) 
    res.status(404)
    throw new Error('An Error occured while fetching data ')
  }
      
})

// @des     Create new Package
// @route   POST /api/packages
// @access  Public 
const createPackage = asyncHandler(async (req, res) => {
    const { name, duration, numberoftests, image, price, status } = req.body

    if (!name) {
        res.status(400)
        throw new Error('Please fill all fields')
    }

    // Check if package exists
    const packageExists = await Package.findOne({ where: { name } })

    if (packageExists) {
        res.status(400)
        throw new Error('Package already exists')
    }

    // Create package
    const package = await Package.create({
        name,
        duration,
        numberoftests,
        image,
        price,
        status
    })

    if (package) {
        res.status(201).json({
            id: package.id,
            name: package.name
        })
    } else {
        res.status(400)
        throw new Error('Invalid package data')
    }

})

// @des     Update package
// @route   PUT /api/packages/:id
// @access  Private 
const updatePackage = asyncHandler(async (req, res) => {

    try {
      const package = await Package.findByPk(req.params.id)
        
      if (!package) {
        res.status(400)
        throw new Error('package not found')
      }

      const packageUpdated = await Package.update(req.body, {
        where: {
          id: req.params.id
        }
      });
    
      if (packageUpdated) {
        res.status(200).json({ messege: 'Package updated' })        
      }        
      else {
        res.status(200).json({ messege: 'Package could not updated' })        
      }
        
  
    } catch (error) {    
      res.status(401)
      throw new Error('An Error occured while updating ')
    }
  
  })

// @des Delete package
// @route   Delete /api/packages
// @access  Private
const deletePackage = asyncHandler(async (req, res) => {

    const package = await Package.findByPk(req.params.id)

    if (!package) {
        res.status(400)
        throw new Error('package not found')
    }

    try {
        await Package.destroy({
            where: {
                id: req.params.id
            }
        });

        res.status(200).json({ id: req.params.id, messege: 'package deleted' })

    } catch (error) {
        console.log(error)
        res.status(401)
        throw new Error('Error occured while deleting package ')
    }
})

module.exports = { getPackages, getPackage, createPackage,updatePackage, deletePackage }