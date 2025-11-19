import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from '../config/database.js';
import SubscriptionPlan from '../models/SubscriptionPlan.js';
import RetouchingStyle from '../models/RetouchingStyle.js';
import User from '../models/User.js';
import Blog from '../models/Blog.js';
import Comment from '../models/Comment.js';
import Like from '../models/Like.js';

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

const subscriptionPlans = [
  {
    _id: 'silver-plan',
    name: 'Silver Plan',
    description: 'Entry-level option for freelancers and new photographers',
    monthlyPrice: 97,
    imagesPerMonth: 20,
    features: [
      'Up to 10 Natural, 8 High-End, 2 Magazine',
      'Commercial usage rights',
      'Standard support'
    ]
  },
  {
    _id: 'gold-plan',
    name: 'Gold Plan',
    description: 'Best value for busy portrait & fashion photographers',
    monthlyPrice: 197,
    imagesPerMonth: 60,
    features: [
      'Up to 30 Natural, 25 High-End, 5 Magazine',
      'Commercial usage rights',
      'Priority chat support',
      'Mix & match across styles'
    ]
  },
  {
    _id: 'diamond-plan',
    name: 'Diamond Plan',
    description: 'Premium plan for brands, agencies, and studios',
    monthlyPrice: 397,
    imagesPerMonth: 150,
    features: [
      'Up to 75 Natural, 60 High-End, 15 Magazine',
      'Commercial usage rights',
      'Priority delivery',
      'Dedicated account manager',
      'Mix & match across styles'
    ]
  }
];

const retouchingStyles = [
  {
    name: 'Natural',
    description: 'Subtle enhancements for natural-looking results',
    basePrice: 15.00,
    turnaroundHours: 24
  },
  {
    name: 'High-End',
    description: 'Professional retouching for commercial use',
    basePrice: 25.00,
    turnaroundHours: 48
  },
  {
    name: 'Magazine',
    description: 'High-fashion magazine quality retouching',
    basePrice: 50.00,
    turnaroundHours: 72
  }
];

const sampleBlogs = [
  {
    title: 'The Art of Portrait Retouching: From RAW to Stunning',
    slug: 'art-portrait-retouching-raw-stunning',
    subheading: 'Master the techniques that transform ordinary portraits into extraordinary works of art',
    content: `<p>In the world of professional photography, the difference between a good photo and a great one often lies in the retouching process. At Elite Retoucher, we've spent years perfecting our craft, and today we're sharing the essential techniques that make our portraits stand out.</p>

<h2>The Foundation: Understanding Your Subject</h2>
<p>Before you even open your editing software, take time to understand your subject. Every face tells a story, and your job as a retoucher is to enhance that narrative without losing authenticity.</p>

<h2>Skin Retouching Techniques</h2>
<p>One of the most critical aspects of portrait retouching is skin work. We use a combination of frequency separation and manual healing to achieve flawless yet natural-looking skin. The key is knowing when to stop – over-retouching can make subjects look plastic.</p>

<h2>Color Grading and Enhancement</h2>
<p>Proper color grading can dramatically improve the mood and impact of your portraits. We focus on skin tone accuracy while adding subtle enhancements that make the image pop without being distracting.</p>

<p>Remember, great retouching is invisible. When done right, viewers should be moved by the subject's expression and story, not distracted by technical perfection.</p>`,
    tags: ['portrait', 'retouching', 'photography', 'techniques'],
    metaDescription: 'Learn professional portrait retouching techniques from the Elite Retoucher team. From RAW processing to final enhancements, master the art of transforming ordinary portraits into extraordinary images.',
    headerImage: 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=800&h=400&fit=crop',
    published: true
  },
  {
    title: 'Commercial Photography: Meeting Client Expectations',
    slug: 'commercial-photography-meeting-client-expectations',
    subheading: 'How to deliver consistent, high-quality results that keep clients coming back',
    content: `<p>Commercial photography requires a unique blend of technical skill, creative vision, and business acumen. In this comprehensive guide, we break down the key elements that separate successful commercial photographers from the rest.</p>

<h2>Understanding Client Briefs</h2>
<p>The foundation of any successful commercial project is a clear understanding of the client's vision. We spend significant time upfront ensuring we fully grasp their goals, target audience, and brand requirements.</p>

<h2>Technical Excellence</h2>
<p>While creativity is essential, technical proficiency is non-negotiable in commercial work. Consistent lighting, sharp focus, and proper exposure are table stakes. Our retouching process ensures every image meets the highest professional standards.</p>

<h2>Post-Production Workflow</h2>
<p>Efficient post-production is crucial for profitability. We use a streamlined workflow that includes color correction, retouching, and final delivery. This process ensures consistent quality across all deliverables.</p>

<h2>Client Communication</h2>
<p>Clear communication throughout the project lifecycle is essential. Regular updates, prompt responses, and transparent pricing build trust and lead to long-term partnerships.</p>`,
    tags: ['commercial', 'photography', 'client-work', 'workflow'],
    metaDescription: 'Master commercial photography with insights from Elite Retoucher. Learn how to meet client expectations, maintain technical excellence, and build lasting professional relationships.',
    headerImage: 'https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=800&h=400&fit=crop',
    published: true
  },
  {
    title: 'Fashion Retouching: Trends and Techniques for 2024',
    slug: 'fashion-retouching-trends-techniques-2024',
    subheading: 'Stay ahead of the curve with the latest fashion retouching trends and techniques',
    content: `<p>The fashion industry moves fast, and fashion retouching techniques evolve even faster. As we enter 2024, we're seeing exciting developments in both technology and artistic approaches. Here's what you need to know to stay competitive.</p>

<h2>AI-Assisted Retouching</h2>
<p>Artificial intelligence is revolutionizing fashion retouching. Tools like content-aware fill and smart object selection are becoming more sophisticated, allowing for faster workflows without sacrificing quality.</p>

<h2>Natural Beauty Standards</h2>
<p>The industry is moving toward more inclusive beauty standards. This means embracing diverse skin tones, body types, and features. Our retouching philosophy focuses on enhancement rather than alteration.</p>

<h2>Sustainable Retouching Practices</h2>
<p>With growing awareness of environmental issues, the fashion industry is embracing more sustainable practices. This includes digital workflows that reduce physical samples and more efficient post-production processes.</p>

<h2>The Future of Fashion Imaging</h2>
<p>Looking ahead, we anticipate continued integration of AR/VR technologies in fashion imaging. These tools will allow brands to create more immersive shopping experiences and personalized product visualization.</p>`,
    tags: ['fashion', 'trends', 'ai', '2024'],
    metaDescription: 'Discover the latest fashion retouching trends for 2024. From AI-assisted workflows to inclusive beauty standards, learn what\'s shaping the future of fashion photography.',
    headerImage: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=400&fit=crop',
    published: true
  },
  {
    title: 'Building a Successful Photography Business',
    slug: 'building-successful-photography-business',
    subheading: 'Essential strategies for turning your passion into a profitable career',
    content: `<p>Photography is more than just taking pictures – it's a business. Many talented photographers struggle with the business side of things. In this article, we share the strategies that have helped us build Elite Retoucher into a successful enterprise.</p>

<h2>Specialization vs. Generalization</h2>
<p>One of the most important decisions you'll make is choosing your niche. While it's tempting to offer everything, specialization allows you to become known for excellence in a particular area. We chose to specialize in portrait retouching, and this focus has been key to our success.</p>

<h2>Pricing Strategy</h2>
<p>Pricing your work appropriately is crucial for profitability. We use a value-based pricing model that considers the impact of our work on our clients' businesses. This approach allows us to charge premium rates while delivering exceptional value.</p>

<h2>Client Acquisition and Retention</h2>
<p>Building a sustainable business requires both acquiring new clients and retaining existing ones. We focus on providing exceptional service, consistent quality, and building genuine relationships. Word-of-mouth referrals remain our strongest source of new business.</p>

<h2>Scaling Your Business</h2>
<p>As your business grows, you'll need to consider how to scale operations. We've invested in training, process documentation, and technology to ensure consistent quality as we've grown our team.</p>`,
    tags: ['business', 'photography', 'pricing', 'growth'],
    metaDescription: 'Learn how to build a successful photography business. From specialization strategies to pricing models, discover the essential elements for turning your passion into a profitable career.',
    headerImage: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?w=800&h=400&fit=crop',
    published: true
  },
  {
    title: 'The Psychology of Visual Storytelling',
    slug: 'psychology-visual-storytelling',
    subheading: 'How understanding human psychology can make your images more compelling',
    content: `<p>Great photography isn't just about technical skill – it's about understanding how people perceive and respond to visual information. By applying principles from psychology, you can create images that resonate more deeply with viewers.</p>

<h2>The Power of Eye Contact</h2>
<p>Direct eye contact in portraits creates an immediate connection with the viewer. Our brains are wired to respond to eye contact, making it a powerful tool for engagement in commercial and personal photography alike.</p>

<h2>Color Psychology in Photography</h2>
<p>Different colors evoke different emotional responses. Understanding color psychology allows you to use color strategically to enhance the mood and message of your images. Warm colors tend to be more engaging, while cool colors can create calm or professional atmospheres.</p>

<h2>The Rule of Thirds and Visual Balance</h2>
<p>The rule of thirds isn't just a composition guideline – it's based on how our brains process visual information. Placing key elements along these lines creates images that feel naturally balanced and pleasing to the eye.</p>

<h2>Emotional Resonance</h2>
<p>The most memorable images are those that evoke emotion. Whether it's joy, nostalgia, aspiration, or empathy, connecting with viewers on an emotional level creates lasting impact and brand loyalty.</p>`,
    tags: ['psychology', 'storytelling', 'composition', 'emotion'],
    metaDescription: 'Explore the psychology behind visual storytelling. Learn how understanding human perception can make your photography more compelling and effective.',
    headerImage: 'https://images.unsplash.com/photo-1541963463532-d68292c34d19?w=800&h=400&fit=crop',
    published: true
  },
  {
    title: 'Product Photography: Showcasing Products Effectively',
    slug: 'product-photography-showcasing-products-effectively',
    subheading: 'Essential techniques for creating product images that drive sales',
    content: `<p>Product photography is both an art and a science. The goal isn't just to show what a product looks like, but to make potential customers want to own it. Here are the techniques we use to create compelling product images.</p>

<h2>Lighting Fundamentals</h2>
<p>Proper lighting is the foundation of great product photography. We use a combination of softboxes, reflectors, and flags to create even, flattering light that showcases products without harsh shadows or glare.</p>

<h2>Composition and Styling</h2>
<p>How you present a product can dramatically impact its appeal. We focus on clean, minimalist compositions that allow the product to be the star. Strategic use of props and backgrounds can enhance the product's story and perceived value.</p>

<h2>Technical Considerations</h2>
<p>Product photography requires meticulous attention to detail. Sharp focus, accurate color reproduction, and proper white balance are essential. We shoot in RAW format and use careful post-processing to ensure color accuracy across all marketing materials.</p>

<h2>Lifestyle Integration</h2>
<p>While studio shots are important, lifestyle photography can be even more effective for certain products. Showing products in real-world contexts helps customers visualize how they'll fit into their lives.</p>`,
    tags: ['product', 'photography', 'lighting', 'ecommerce'],
    metaDescription: 'Master product photography techniques that drive sales. Learn lighting, composition, and styling strategies for creating compelling product images.',
    headerImage: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=400&fit=crop',
    published: false // Draft post for testing
  }
];

const importData = async () => {
  try {
    // Clear existing data
    await SubscriptionPlan.deleteMany();
    await RetouchingStyle.deleteMany();
    await Blog.deleteMany();
    await Comment.deleteMany();
    await Like.deleteMany();

    // Insert subscription plans
    await SubscriptionPlan.insertMany(subscriptionPlans);
    console.log('✅ Subscription plans imported');

    // Insert retouching styles
    await RetouchingStyle.insertMany(retouchingStyles);
    console.log('✅ Retouching styles imported');

    // Create sample admin user
    const adminExists = await User.findOne({ email: 'admin@eliteretoucher.com' });
    let admin;
    if (!adminExists) {
      admin = await User.create({
        email: 'admin@eliteretoucher.com',
        password: 'admin123',
        fullName: 'Admin User',
        role: 'admin'
      });
      console.log('✅ Admin user created (admin@eliteretoucher.com / admin123)');
    } else {
      admin = adminExists;
    }

    // Create sample blog posts
    const blogsWithAuthor = sampleBlogs.map(blog => ({
      ...blog,
      author: admin._id
    }));

    await Blog.insertMany(blogsWithAuthor);
    console.log('✅ Sample blog posts imported');

    console.log('🎉 Data Import Success!');
    process.exit();
  } catch (error) {
    console.error('❌ Data Import Failed:', error);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await SubscriptionPlan.deleteMany();
    await RetouchingStyle.deleteMany();
    await Blog.deleteMany();
    await Comment.deleteMany();
    await Like.deleteMany();
    await User.deleteMany({ email: 'admin@eliteretoucher.com' });

    console.log('🗑️ Data Destroyed!');
    process.exit();
  } catch (error) {
    console.error('❌ Data Destroy Failed:', error);
    process.exit(1);
  }
};

// Run based on command line arguments
if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}
