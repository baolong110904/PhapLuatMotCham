import React, { Children } from 'react'
import { motion } from 'framer-motion'
import {
  FileTextIcon,
  CreditCardIcon,
  FileSignatureIcon,
  UserCheckIcon,
  HomeIcon,
  HeartHandshakeIcon,
} from 'lucide-react'
export function Services() {
  const services = [
    {
      icon: <FileTextIcon size={48} className="text-primary-500" />,
      title: 'Sao y công chứng',
      description:
        'Hướng dẫn trực quan các bước sao y công chứng giấy tờ quan trọng.',
    },
    {
      icon: <CreditCardIcon size={48} className="text-primary-500" />,
      title: 'Cấp lại CCCD',
      description:
        'Quy trình đơn giản để làm lại Căn cước công dân khi bị mất hoặc hết hạn.',
    },
    {
      icon: <FileSignatureIcon size={48} className="text-primary-500" />,
      title: 'Giấy kết hôn',
      description:
        'Hướng dẫn cấp lại giấy đăng ký kết hôn với quy trình rõ ràng.',
    },
    {
      icon: <UserCheckIcon size={48} className="text-primary-500" />,
      title: 'Xác nhận cư trú',
      description:
        'Các bước xác nhận cư trú tại địa phương với thủ tục đơn giản.',
    },
    {
      icon: <HomeIcon size={48} className="text-primary-500" />,
      title: 'Giấy tờ nhà đất',
      description:
        'Hướng dẫn làm các thủ tục liên quan đến sổ đỏ và giấy tờ nhà đất.',
    },
    {
      icon: <HeartHandshakeIcon size={48} className="text-primary-500" />,
      title: 'Di chúc và thừa kế',
      description: 'Thông tin về cách lập di chúc hợp pháp và thủ tục thừa kế.',
    },
  ]
  const containerVariants = {
    hidden: {
      opacity: 0,
    },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  }
  const itemVariants = {
    hidden: {
      y: 20,
      opacity: 0,
    },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
  }
  return (
    <section id="services" className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Dịch Vụ Hỗ Trợ Pháp Lý
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Chúng tôi cung cấp hướng dẫn trực quan, dễ hiểu cho các thủ tục pháp
            lý thường gặp
          </p>
        </div>
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{
            once: true,
            amount: 0.2,
          }}
        >
          {services.map((service, index) => (
            <motion.div
              key={index}
              className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow"
              variants={itemVariants}
            >
              <div className="mb-6 flex justify-center">{service.icon}</div>
              <h3 className="text-2xl font-semibold text-gray-800 mb-4 text-center">
                {service.title}
              </h3>
              <p className="text-lg text-gray-600 text-center">
                {service.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
        <div className="text-center mt-12">
          <motion.a
            href="#how-it-works"
            className="inline-flex items-center px-6 py-3 bg-primary-500 text-white text-lg font-medium rounded-lg hover:bg-primary-600 transition-colors"
            whileHover={{
              scale: 1.05,
            }}
            whileTap={{
              scale: 0.95,
            }}
          >
            Khám phá cách thức hoạt động
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 ml-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </motion.a>
        </div>
      </div>
    </section>
  )
}
