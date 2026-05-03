import Link from 'next/link';

export default function BlogPage() {
  const blogPosts = [
    {
      id: 1,
      title: "10 Tips for Safe Package Shipping",
      excerpt: "Learn how to properly package your items to ensure they arrive safely at their destination. Discover the best practices for choosing materials, securing boxes, and preparing for transit.",
      date: "May 15, 2023",
      image: "/blog1.jpg",
      slug: "10-tips-for-safe-package-shipping",
      author: "Jane Smith"
    },
    {
      id: 2,
      title: "Complete Guide to International Shipping",
      excerpt: "Master the complexities of international shipping including documentation, customs, duties, and best practices for global shipments.",
      date: "June 2, 2023",
      image: "/blog2.jpg",
      slug: "international-shipping-guide",
      author: "John Wilson"
    },
    {
      id: 3,
      title: "Eco-Friendly Shipping Solutions",
      excerpt: "Discover sustainable packaging materials and carbon-neutral shipping options that reduce your environmental impact while saving money.",
      date: "June 20, 2023",
      image: "/blog3.jpg",
      slug: "eco-friendly-shipping-solutions",
      author: "Sarah Green"
    },
    {
      id: 4,
      title: "The Importance of Tracking and Transparency in Shipping",
      excerpt: "Explore how real-time tracking builds customer trust, reduces disputes, and provides valuable insights into your shipping operations.",
      date: "July 10, 2023",
      image: "/blog4.jpg",
      slug: "tracking-and-transparency",
      author: "Mike Johnson"
    },
    {
      id: 5,
      title: "Managing Seasonal Shipping Challenges",
      excerpt: "Prepare for holiday rushes, weather delays, and capacity issues with practical strategies for maintaining service quality year-round.",
      date: "August 5, 2023",
      image: "/blog5.jpg",
      slug: "seasonal-shipping-challenges",
      author: "Emma Davis"
    },
    {
      id: 6,
      title: "Choosing the Right Shipping Method for Your Business",
      excerpt: "Compare shipping carriers and methods to find the best balance between cost, speed, and reliability for your business needs.",
      date: "August 25, 2023",
      image: "/blog6.jpg",
      slug: "choosing-right-shipping-method",
      author: "David Martinez"
    }
  ];

  return (
    <section className="section">
      <div className="container">
        <div className="section-title">
          <h1>Our Blog</h1>
          <p>Latest news, tips, and updates about shipping and logistics</p>
        </div>
        
        <div className="blog-grid">
          {blogPosts.map(post => (
            <article key={post.id} className="blog-card">
              <img src={post.image} alt={post.title} className="blog-image" />
              <div className="blog-content">
                <p className="blog-date">{post.date}</p>
                <h2 className="blog-title">{post.title}</h2>
                <p className="blog-excerpt">{post.excerpt}</p>
                <div className="blog-footer">
                  <span className="blog-author">By {post.author}</span>
                  <Link href={`/blog/${post.slug}`} className="blog-read-more">Read More →</Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}