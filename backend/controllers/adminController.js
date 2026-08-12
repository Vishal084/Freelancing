const Order = require('../models/Order');
const Service = require('../models/Service');
const Project = require('../models/Project');
const User = require('../models/User');
const Testimonial = require('../models/TestimonialAdmin');
const FAQ = require('../models/FAQadmin');

const getDashboard = async (req, res) => {
  try {
    const [
      servicesCount,
      projectsCount,
      usersCount,
      pendingTestimonials,
      pendingFAQs,
      orderStats,
    ] = await Promise.all([
      Service.countDocuments(),
      Project.countDocuments(),
      User.countDocuments(),
      Testimonial.countDocuments({ status: 'pending' }),
      FAQ.countDocuments({ status: 'pending' }),
      Order.aggregate([
        {
          $match: { status: { $ne: 'cancelled' } }
        },
        {
          $group: {
            _id: null,
            totalRevenue: {
              $sum: {
                $cond: [{ $eq: ['$status', 'completed'] }, '$price', 0]
              }
            },
            ongoingProjects: {
              $sum: {
                $cond: [{ $eq: ['$status', 'in_progress'] }, 1, 0]
              }
            },
            completedProjects: {
              $sum: {
                $cond: [{ $eq: ['$status', 'completed'] }, 1, 0]
              }
            },
            upcomingProjects: {
              $sum: {
                $cond: [
                  {
                    $and: [
                      { $ne: ['$status', 'completed'] },
                      { $ne: ['$status', 'in_progress'] },
                      { $ne: ['$status', 'cancelled'] }
                    ]
                  },
                  1,
                  0
                ]
              }
            },
            totalOrders: { $sum: 1 }
          }
        }
      ]),
    ]);

    const stats = orderStats[0] || {
      totalRevenue: 0,
      ongoingProjects: 0,
      completedProjects: 0,
      upcomingProjects: 0,
      totalOrders: 0,
    };

    res.json({
      totalRevenue: stats.totalRevenue,
      ongoingProjects: stats.ongoingProjects,
      completedProjects: stats.completedProjects,
      upcomingProjects: stats.upcomingProjects,
      usersCount,
      pendingTestimonials,
      pendingFAQs,
      servicesCount,
      projectsCount,
      ordersCount: stats.totalOrders,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getDashboard };