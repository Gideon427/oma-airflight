export default function Careers() {
  const jobOpenings = [
    {
      title: "Delivery Driver",
      location: "Multiple Locations",
      type: "Full-time",
      description: "Join our team of professional drivers delivering packages across the city.",
      requirements: ["Valid driver's license", "Clean driving record", "Strong customer service skills"]
    },
    {
      title: "Warehouse Associate",
      location: "Distribution Center",
      type: "Full-time",
      description: "Work in our modern warehouse facility sorting and preparing packages for delivery.",
      requirements: ["Ability to lift 50+ lbs", "Attention to detail", "Team player"]
    },
    {
      title: "Customer Service Representative",
      location: "Call Center",
      type: "Full-time",
      description: "Help customers with tracking, quotes, and shipping inquiries.",
      requirements: ["Excellent communication skills", "Problem-solving ability", "Computer proficiency"]
    },
    {
      title: "Operations Manager",
      location: "Headquarters",
      type: "Full-time",
      description: "Oversee daily operations and manage logistics coordination.",
      requirements: ["5+ years logistics experience", "Leadership skills", "Project management experience"]
    },
    {
      title: "Software Developer",
      location: "Remote/Office",
      type: "Full-time",
      description: "Develop and maintain our shipping platform and mobile applications.",
      requirements: ["JavaScript/React experience", "API development", "Problem-solving skills"]
    },
    {
      title: "Marketing Specialist",
      location: "Marketing Department",
      type: "Full-time",
      description: "Create marketing campaigns and manage our online presence.",
      requirements: ["Digital marketing experience", "Content creation", "Analytics skills"]
    }
  ]

  const benefits = [
    "Competitive salary and bonuses",
    "Health, dental, and vision insurance",
    "Paid time off and holidays",
    "401(k) retirement plan",
    "Professional development opportunities",
    "Employee discounts on shipping",
    "Flexible work arrangements",
    "Career advancement opportunities"
  ]

  return (
    <div className="section">
      <div className="container">
        <div className="section-title">
          <h1>Join Our Team</h1>
          <p>Build your career in the fast-paced world of logistics and shipping</p>
        </div>

        <div className="careers-intro">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            <div className="careers-text">
              <h2>Why Work at SwiftShip?</h2>
              <p>We're a growing company committed to excellence in shipping and logistics. Our team members enjoy competitive compensation, comprehensive benefits, and opportunities for professional growth.</p>
              <p>We value diversity, innovation, and customer satisfaction. Join us in delivering exceptional service to our customers every day.</p>
            </div>
            <div className="careers-stats">
              <div className="stat-card">
                <div className="stat-number">500+</div>
                <div className="stat-label">Team Members</div>
              </div>
              <div className="stat-card">
                <div className="stat-number">50+</div>
                <div className="stat-label">Locations</div>
              </div>
              <div className="stat-card">
                <div className="stat-number">1M+</div>
                <div className="stat-label">Packages Delivered</div>
              </div>
              <div className="stat-card">
                <div className="stat-number">99.5%</div>
                <div className="stat-label">On-Time Delivery</div>
              </div>
            </div>
          </div>
        </div>

        <div className="job-openings">
          <h2>Current Openings</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {jobOpenings.map((job, index) => (
              <div key={index} className="job-card">
                <div className="job-header">
                  <h3>{job.title}</h3>
                  <div className="job-meta">
                    <span className="job-location">📍 {job.location}</span>
                    <span className="job-type">💼 {job.type}</span>
                  </div>
                </div>
                <p className="job-description">{job.description}</p>
                <div className="job-requirements">
                  <h4>Requirements:</h4>
                  <ul>
                    {job.requirements.map((req, idx) => (
                      <li key={idx}>✓ {req}</li>
                    ))}
                  </ul>
                </div>
                <button className="btn btn-primary">Apply Now</button>
              </div>
            ))}
          </div>
        </div>

        <div className="benefits-section">
          <h2>Benefits & Perks</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {benefits.map((benefit, index) => (
              <div key={index} className="benefit-item">
                ✓ {benefit}
              </div>
            ))}
          </div>
        </div>

        <div className="careers-cta">
          <h2>Ready to Join Us?</h2>
          <p>Don't see a position that matches your skills? Send us your resume for future opportunities.</p>
          <button className="btn btn-primary btn-lg">Submit Resume</button>
        </div>
      </div>
    </div>
  )
}