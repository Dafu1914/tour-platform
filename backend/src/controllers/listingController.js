const Listing = require('../models/Listing');

// Create a new listing
exports.createListing = async (req, res) => {
  try {
    const { 
      title, description, category, destination, region,
      price, pricePer, duration, durationUnit,
      maxGuests, inclusions, exclusions, amenities,
      images, coverImage, bookingType, cancellationPolicy
    } = req.body;

    // Create listing
    const listing = await Listing.create({
      user: req.user._id,
      title,
      description,
      category,
      destination,
      region,
      price,
      pricePer: pricePer || 'person',
      duration,
      durationUnit: durationUnit || 'days',
      maxGuests,
      inclusions: inclusions || [],
      exclusions: exclusions || [],
      amenities: amenities || [],
      images: images || [],
      coverImage: coverImage || '',
      bookingType: bookingType || 'request',
      cancellationPolicy: cancellationPolicy || 'moderate',
      status: 'pending', // Admin approval needed
    });

    res.status(201).json({
      success: true,
      data: listing,
    });
  } catch (error) {
    console.error('Create listing error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error', 
      error: error.message 
    });
  }
};

// Get all listings (with filters)
exports.getAllListings = async (req, res) => {
  try {
    const { 
      destination, category, minPrice, maxPrice, 
      region, sort, page = 1, limit = 10 
    } = req.query;

    // Build filter object
    const filter = { status: 'active' };
    
    if (destination) {
      filter.destination = { $regex: destination, $options: 'i' };
    }
    if (category) {
      filter.category = category;
    }
    if (region) {
      filter.region = { $regex: region, $options: 'i' };
    }
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    // Sort options
    let sortOption = {};
    if (sort === 'price-asc') sortOption.price = 1;
    else if (sort === 'price-desc') sortOption.price = -1;
    else if (sort === 'rating') sortOption.rating = -1;
    else sortOption.createdAt = -1; // newest first

    // Pagination
    const skip = (page - 1) * limit;

    const listings = await Listing.find(filter)
      .sort(sortOption)
      .skip(skip)
      .limit(Number(limit))
      .populate('user', 'fullName email profileImage');

    const total = await Listing.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: listings,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Get listings error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error', 
      error: error.message 
    });
  }
};

// Get single listing by ID
exports.getListingById = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id)
      .populate('user', 'fullName email phone profileImage role');

    if (!listing) {
      return res.status(404).json({ 
        success: false,
        message: 'Listing not found' 
      });
    }

    // Increment views
    listing.views += 1;
    await listing.save();

    res.status(200).json({
      success: true,
      data: listing,
    });
  } catch (error) {
    console.error('Get listing error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error', 
      error: error.message 
    });
  }
};

// Get current user's listings
exports.getMyListings = async (req, res) => {
  try {
    const listings = await Listing.find({ user: req.user._id })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: listings,
    });
  } catch (error) {
    console.error('Get my listings error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error', 
      error: error.message 
    });
  }
};

// Update listing
exports.updateListing = async (req, res) => {
  try {
    let listing = await Listing.findById(req.params.id);

    if (!listing) {
      return res.status(404).json({ 
        success: false,
        message: 'Listing not found' 
      });
    }

    // Check if user owns the listing
    if (listing.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ 
        success: false,
        message: 'Not authorized to update this listing' 
      });
    }

    // Update listing
    listing = await Listing.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      data: listing,
    });
  } catch (error) {
    console.error('Update listing error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error', 
      error: error.message 
    });
  }
};

// Delete listing
exports.deleteListing = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return res.status(404).json({ 
        success: false,
        message: 'Listing not found' 
      });
    }

    // Check if user owns the listing
    if (listing.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ 
        success: false,
        message: 'Not authorized to delete this listing' 
      });
    }

    await listing.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Listing deleted successfully',
    });
  } catch (error) {
    console.error('Delete listing error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error', 
      error: error.message 
    });
  }
};

// Update listing status (admin only)
exports.updateListingStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return res.status(404).json({ 
        success: false,
        message: 'Listing not found' 
      });
    }

    // Only admin can change status
    if (req.user.role !== 'admin' && req.user.role !== 'super_admin') {
      return res.status(403).json({ 
        success: false,
        message: 'Not authorized to change listing status' 
      });
    }

    listing.status = status;
    await listing.save();

    res.status(200).json({
      success: true,
      data: listing,
    });
  } catch (error) {
    console.error('Update listing status error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error', 
      error: error.message 
    });
  }
};