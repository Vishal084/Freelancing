
import { Link } from 'react-router-dom'
import './ServiceCard.css'

const ServiceCard = ({ service }) => {
  return (
    <div className="service-card card">
      <div className="service-icon">{service.icon}</div>
      <h3>{service.name}</h3>
      <p>{service.description}</p>
      <div className="service-price">${service.price}</div>
      <Link to={`/order?service=${service.id}`} className="btn">Order Now</Link>
    </div>
  )
}

export default ServiceCard



// Purpose: Reusable card for service listing.
// Static data: None – data comes from Redux (serviceSlice → servicesData.js).
// Improvements: None needed.




// Props received from parent:
// {
//   service: {
//     id: "abc123",
//     name: "Website Development",
//     description: "Custom responsive websites...",
//     price: 999,
//     icon: "🌐"
//   }
// }