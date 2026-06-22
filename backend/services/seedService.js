import User from '../models/User.js';
import Seller from '../models/Seller.js';
import Category from '../models/Category.js';
import Product from '../models/Product.js';
import Review from '../models/Review.js';
import Order from '../models/Order.js';
import Payment from '../models/Payment.js';
import Coupon from '../models/Coupon.js';
import Banner from '../models/Banner.js';
import Blog from '../models/Blog.js';
import Notification from '../models/Notification.js';
import Settings from '../models/Settings.js';
import { ORDER_STATUSES } from '../models/Order.js';
import bcrypt from 'bcrypt';

const CITIES = [
  { city: 'Mumbai', state: 'Maharashtra', postalCode: '400001' },
  { city: 'Delhi', state: 'Delhi', postalCode: '110001' },
  { city: 'Bangalore', state: 'Karnataka', postalCode: '560001' },
  { city: 'Chennai', state: 'Tamil Nadu', postalCode: '600001' },
  { city: 'Hyderabad', state: 'Telangana', postalCode: '500001' },
  { city: 'Pune', state: 'Maharashtra', postalCode: '411001' },
  { city: 'Kolkata', state: 'West Bengal', postalCode: '700001' },
  { city: 'Ahmedabad', state: 'Gujarat', postalCode: '380001' },
];

const CATEGORIES = [
  { name: 'Electronics', subCategories: ['TV', 'Audio', 'Cameras', 'Wearables'] },
  { name: 'Fashion', subCategories: ['Men', 'Women', 'Kids', 'Accessories'] },
  { name: 'Mobile', subCategories: ['Smartphones', 'Cases', 'Chargers', 'Earbuds'] },
  { name: 'Laptop', subCategories: ['Gaming', 'Business', 'Accessories', 'Monitors'] },
  { name: 'Home Appliances', subCategories: ['Kitchen', 'Cleaning', 'Climate', 'Lighting'] },
  { name: 'Grocery', subCategories: ['Snacks', 'Beverages', 'Staples', 'Organic'] },
  { name: 'Beauty', subCategories: ['Skincare', 'Makeup', 'Haircare', 'Fragrance'] },
  { name: 'Sports', subCategories: ['Fitness', 'Outdoor', 'Team Sports', 'Cycling'] },
  { name: 'Books', subCategories: ['Fiction', 'Non-Fiction', 'Academic', 'Comics'] },
  { name: 'Furniture', subCategories: ['Living Room', 'Bedroom', 'Office', 'Outdoor'] },
];

const BRANDS = ['Samsung', 'Apple', 'Sony', 'Nike', 'Adidas', 'LG', 'HP', 'Dell', 'Philips', 'Bosch', 'Puma', 'Levi\'s', 'OnePlus', 'Xiaomi', 'Boat'];
const SHOP_NAMES = ['Tech Haven', 'Style Studio', 'Mobile Mart', 'Laptop World', 'Home Comfort', 'Fresh Basket', 'Glow Beauty', 'Fit Zone', 'Book Nook', 'FurniCraft', 'Gadget Galaxy', 'Urban Wear', 'Smart Store', 'Elite Electronics', 'Prime Deals', 'Value Shop', 'Mega Mart', 'Quick Buy', 'Best Choice', 'Top Seller'];
const PAYMENT_METHODS = ['razorpay', 'stripe', 'cod'];
const REVIEW_COMMENTS = ['Great product!', 'Good value for money', 'Fast delivery', 'Exactly as described', 'Average quality', 'Highly recommended', 'Could be better', 'Love it!', 'Works perfectly', 'Nice packaging'];

const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const pick = (arr) => arr[rand(0, arr.length - 1)];
const img = (id) => `https://picsum.photos/seed/${id}/600/600`;
const slugify = (str) =>
  str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

const clearAll = async () => {
  await Promise.all([
    User.deleteMany({}),
    Seller.deleteMany({}),
    Category.deleteMany({}),
    Product.deleteMany({}),
    Review.deleteMany({}),
    Order.deleteMany({}),
    Payment.deleteMany({}),
    Coupon.deleteMany({}),
    Banner.deleteMany({}),
    Blog.deleteMany({}),
    Notification.deleteMany({}),
    Settings.deleteMany({}),
  ]);
};

const seedCategories = async () => {
  const categories = await Category.insertMany(
    CATEGORIES.map((cat, i) => ({
      name: cat.name,
      slug: slugify(cat.name),
      description: `Shop the best ${cat.name.toLowerCase()} products`,
      image: img(`cat-${i}`),
      sortOrder: i,
      subCategories: cat.subCategories.map((sub) => ({ name: sub, slug: slugify(sub) })),
    }))
  );
  return categories;
};

const seedUsers = async () => {
  const admin = await User.create({
    name: 'Super Admin',
    email: 'admin@eshoponline.com',
    password: 'admin123',
    role: 'admin',
    isEmailVerified: true,
  });

  const salt = await bcrypt.genSalt(10);
  const buyerPassword = await bcrypt.hash('customer123', salt);
  const sellerPassword = await bcrypt.hash('seller123', salt);

  const buyers = [];
  for (let i = 1; i <= 100; i++) {
    const loc = pick(CITIES);
    buyers.push({
      name: `Customer ${i}`,
      email: `customer${i}@eshoponline.com`,
      password: buyerPassword,
      role: 'buyer',
      isEmailVerified: true,
      phone: `98${String(i).padStart(8, '0')}`,
      addresses: [{
        fullName: `Customer ${i}`,
        phone: `98${String(i).padStart(8, '0')}`,
        addressLine1: `${rand(1, 999)} Market Street`,
        city: loc.city,
        state: loc.state,
        postalCode: loc.postalCode,
        country: 'India',
        isDefault: true,
      }],
    });
  }
  const buyerUsers = await User.insertMany(buyers);

  const sellerUsers = [];
  for (let i = 1; i <= 20; i++) {
    sellerUsers.push({
      name: `Seller ${i}`,
      email: `seller${i}@eshoponline.com`,
      password: sellerPassword,
      role: 'seller',
      isEmailVerified: true,
      phone: `97${String(i).padStart(8, '0')}`,
    });
  }
  const sellers = await User.insertMany(sellerUsers);

  return { admin, buyerUsers, sellerUsers: sellers };
};

const seedSellers = async (sellerUsers) => {
  const sellers = await Seller.insertMany(
    sellerUsers.map((user, i) => {
      const loc = pick(CITIES);
      const shopName = SHOP_NAMES[i] || `Shop ${i + 1}`;
      return {
        user: user._id,
        shopName,
        slug: slugify(shopName),
        description: `Welcome to ${SHOP_NAMES[i] || `Shop ${i + 1}`} — quality products at great prices`,
        email: user.email,
        phone: user.phone,
        logo: img(`shop-logo-${i}`),
        banner: img(`shop-banner-${i}`),
        status: i < 18 ? 'approved' : 'pending',
        isVerified: i < 18,
        isActive: true,
        rating: +(3 + Math.random() * 2).toFixed(1),
        address: {
          street: `${rand(1, 500)} Commerce Road`,
          city: loc.city,
          state: loc.state,
          postalCode: loc.postalCode,
          country: 'India',
        },
      };
    })
  );
  return sellers;
};

const seedProducts = async (categories, sellers) => {
  const approvedSellers = sellers.filter((s) => s.status === 'approved');
  const products = [];
  for (let i = 1; i <= 500; i++) {
    const cat = pick(categories);
    const sub = pick(cat.subCategories);
    const seller = pick(approvedSellers);
    const price = rand(199, 99999);
    const discount = rand(0, 40);
    const qty = rand(0, 200);
    const name = `${pick(BRANDS)} ${cat.name} Product ${i}`;
    const sku = `SKU${String(i).padStart(6, '0')}`;
    products.push({
      name,
      slug: slugify(`${name}-${sku}`),
      sku,
      description: `High quality ${cat.name.toLowerCase()} product with excellent features. Perfect for everyday use with reliable performance and great durability.`,
      shortDescription: `Premium ${cat.name} item`,
      category: cat._id,
      subCategory: sub.name,
      brand: pick(BRANDS),
      images: [img(`prod-${i}-1`), img(`prod-${i}-2`), img(`prod-${i}-3`)],
      price,
      discount,
      quantity: qty,
      weight: rand(100, 5000) / 100,
      deliveryCharge: rand(0, 1) ? 0 : rand(49, 199),
      tax: rand(5, 18),
      rating: +(2 + Math.random() * 3).toFixed(1),
      numReviews: 0,
      seller: seller._id,
      tags: [cat.name.toLowerCase(), sub.name.toLowerCase()],
      isFeatured: i <= 20,
      isActive: true,
      totalSold: rand(0, 500),
    });
  }
  return Product.insertMany(products);
};

const seedCoupons = async (categories) => {
  const coupons = [];
  const now = new Date();
  for (let i = 1; i <= 50; i++) {
    coupons.push({
      code: `SAVE${String(i).padStart(2, '0')}${rand(10, 99)}`,
      description: `Discount coupon ${i}`,
      discountType: i % 3 === 0 ? 'fixed' : 'percentage',
      discountValue: i % 3 === 0 ? rand(50, 500) : rand(5, 30),
      minOrderAmount: rand(500, 2000),
      maxDiscount: rand(100, 1000),
      usageLimit: rand(50, 500),
      startDate: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000),
      endDate: new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000),
      isActive: true,
      applicableCategories: i % 2 === 0 ? [pick(categories)._id] : [],
    });
  }
  return Coupon.insertMany(coupons);
};

const seedReviews = async (products, buyerUsers) => {
  const reviews = [];
  const usedPairs = new Set();
  let attempts = 0;
  while (reviews.length < 2000 && attempts < 10000) {
    attempts++;
    const product = pick(products);
    const user = pick(buyerUsers);
    const key = `${product._id}-${user._id}`;
    if (usedPairs.has(key)) continue;
    usedPairs.add(key);
    reviews.push({
      product: product._id,
      user: user._id,
      rating: rand(1, 5),
      title: pick(['Excellent', 'Good', 'Okay', 'Great buy', 'Recommended']),
      comment: pick(REVIEW_COMMENTS),
      isVerifiedPurchase: Math.random() > 0.3,
      isApproved: true,
      helpfulCount: rand(0, 50),
    });
  }
  const inserted = await Review.insertMany(reviews);

  const ratingMap = {};
  inserted.forEach((r) => {
    const pid = r.product.toString();
    if (!ratingMap[pid]) ratingMap[pid] = { sum: 0, count: 0 };
    ratingMap[pid].sum += r.rating;
    ratingMap[pid].count += 1;
  });
  const bulkOps = Object.entries(ratingMap).map(([pid, { sum, count }]) => ({
    updateOne: {
      filter: { _id: pid },
      update: { rating: +(sum / count).toFixed(1), numReviews: count },
    },
  }));
  if (bulkOps.length) await Product.bulkWrite(bulkOps);

  return inserted;
};

const seedOrders = async (products, buyerUsers, sellers, coupons) => {
  const orders = [];
  const payments = [];
  const approvedSellers = sellers.filter((s) => s.status === 'approved');

  for (let i = 1; i <= 1000; i++) {
    const buyer = pick(buyerUsers);
    const addr = buyer.addresses?.[0] || pick(CITIES);
    const itemCount = rand(1, 4);
    const items = [];
    let itemsPrice = 0;

    for (let j = 0; j < itemCount; j++) {
      const product = pick(products);
      const qty = rand(1, 3);
      const price = product.price;
      const discount = product.discount || 0;
      const lineTotal = Math.round(price - (price * discount) / 100) * qty;
      itemsPrice += lineTotal;
      items.push({
        product: product._id,
        name: product.name,
        sku: product.sku,
        image: product.images?.[0] || '',
        price,
        discount,
        quantity: qty,
        seller: product.seller,
        status: pick(ORDER_STATUSES),
      });
    }

    const taxPrice = Math.round(itemsPrice * 0.05);
    const deliveryCharge = rand(0, 1) ? 0 : rand(49, 149);
    const discountAmount = Math.random() > 0.7 ? rand(50, 300) : 0;
    const totalPrice = itemsPrice + taxPrice + deliveryCharge - discountAmount;
    const status = pick(ORDER_STATUSES);
    const paymentMethod = pick(PAYMENT_METHODS);
    const isPaid = paymentMethod !== 'cod' && !['cancelled', 'pending'].includes(status);
    const createdAt = new Date(Date.now() - rand(0, 180) * 24 * 60 * 60 * 1000);

    const order = {
      orderNumber: `ESO${String(i).padStart(6, '0')}${rand(1000, 9999)}`,
      user: buyer._id,
      items,
      shippingAddress: {
        fullName: buyer.name,
        phone: buyer.phone || '9876543210',
        addressLine1: addr.addressLine1 || `${rand(1, 999)} Main St`,
        city: addr.city,
        state: addr.state,
        postalCode: addr.postalCode,
        country: 'India',
      },
      paymentMethod,
      paymentStatus: isPaid ? 'paid' : status === 'refunded' ? 'refunded' : paymentMethod === 'cod' && status === 'delivered' ? 'paid' : 'pending',
      status,
      statusHistory: [{ status, note: 'Order created', updatedAt: createdAt }],
      itemsPrice,
      taxPrice,
      deliveryCharge,
      discountAmount,
      coupon: Math.random() > 0.8 ? pick(coupons)._id : undefined,
      totalPrice,
      isPaid,
      paidAt: isPaid ? createdAt : undefined,
      isDelivered: status === 'delivered',
      deliveredAt: status === 'delivered' ? new Date(createdAt.getTime() + rand(2, 10) * 24 * 60 * 60 * 1000) : undefined,
      trackingNumber: status !== 'pending' ? `TRK${rand(100000, 999999)}` : undefined,
      createdAt,
      updatedAt: createdAt,
    };
    orders.push(order);
  }

  const insertedOrders = await Order.insertMany(orders);

  insertedOrders.forEach((order) => {
    if (order.paymentMethod !== 'cod' || order.isPaid) {
      payments.push({
        order: order._id,
        user: order.user,
        amount: order.totalPrice,
        currency: 'INR',
        method: order.paymentMethod,
        status: order.paymentStatus === 'paid' ? 'completed' : order.paymentStatus === 'refunded' ? 'refunded' : 'pending',
        transactionId: `TXN${rand(100000000, 999999999)}`,
        createdAt: order.createdAt,
      });
    }
  });
  await Payment.insertMany(payments);

  return insertedOrders;
};

const seedExtras = async (admin) => {
  await Banner.insertMany([
    { title: 'Summer Sale', subtitle: 'Up to 50% off', image: img('banner-1'), link: '/categories', position: 'hero', isActive: true, sortOrder: 1 },
    { title: 'New Arrivals', subtitle: 'Latest gadgets', image: img('banner-2'), link: '/categories', position: 'hero', isActive: true, sortOrder: 2 },
    { title: 'Free Delivery', subtitle: 'On orders above ₹999', image: img('banner-3'), link: '/categories', position: 'sidebar', isActive: true, sortOrder: 3 },
  ]);

  await Blog.insertMany([
    { title: 'Welcome to E-Shop Online', slug: 'welcome-to-eshop-online', content: 'Your trusted multi-vendor marketplace.', excerpt: 'Discover amazing deals', author: admin._id, isPublished: true, tags: ['welcome'] },
    { title: 'Shopping Tips 2026', slug: 'shopping-tips-2026', content: 'Best practices for online shopping.', excerpt: 'Smart shopping guide', author: admin._id, isPublished: true, tags: ['tips'] },
  ]);

  await Settings.create({
    siteName: 'E-Shop Online',
    siteTagline: 'Your Trusted Multi-Vendor Marketplace',
    contactEmail: 'support@eshoponline.com',
    contactPhone: '1800-123-4567',
    currency: 'INR',
    currencySymbol: '₹',
    taxRate: 5,
    freeDeliveryThreshold: 999,
    maintenanceMode: false,
    socialLinks: { facebook: '#', twitter: '#', instagram: '#', youtube: '#' },
    seo: { title: 'E-Shop Online', description: 'Multi-vendor e-commerce marketplace', keywords: 'ecommerce, marketplace, online shopping' },
  });

  const sampleBuyers = await User.find({ role: 'buyer' }).limit(10).select('_id');
  await Notification.insertMany(
    sampleBuyers.map((u) => ({
      user: u._id,
      title: 'Welcome to E-Shop Online!',
      message: 'Start shopping and discover amazing deals from top sellers.',
      type: 'system',
    }))
  );
};

const seedAll = async () => {
  console.log('Clearing existing data...');
  await clearAll();

  console.log('Seeding categories...');
  const categories = await seedCategories();

  console.log('Seeding users (1 admin, 100 buyers, 20 sellers)...');
  const { admin, buyerUsers, sellerUsers } = await seedUsers();

  console.log('Seeding sellers...');
  const sellers = await seedSellers(sellerUsers);

  console.log('Seeding 500 products...');
  const products = await seedProducts(categories, sellers);

  console.log('Seeding 50 coupons...');
  const coupons = await seedCoupons(categories);

  console.log('Seeding 2000 reviews...');
  await seedReviews(products, buyerUsers);

  console.log('Seeding 1000 orders with payments...');
  await seedOrders(products, buyerUsers, sellers, coupons);

  console.log('Seeding banners, blogs, settings...');
  await seedExtras(admin);

  console.log('\n✅ Seed complete!');
  console.log('Admin: admin@eshoponline.com / admin123');
  console.log('Buyer: customer1@eshoponline.com / customer123');
  console.log('Seller: seller1@eshoponline.com / seller123');
};

export default seedAll;
