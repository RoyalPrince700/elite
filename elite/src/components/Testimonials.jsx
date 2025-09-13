// "use client"; // Uncomment if using Next.js with React Server components, not needed in Vite
import React from 'react';

import avatar2 from "../assets/avatar_2.jpg";
import avatar1 from "../assets/avatar_1.jpg";
import avatar3 from "../assets/avatar_3.jpg";
import avatar4 from "../assets/avatar_4.jpg";
import avatar5 from "../assets/avatar_5.jpg";
import avatar6 from "../assets/avatar_6.jpg";
import avatar7 from "../assets/avatar_7.jpg";
import avatar8 from "../assets/avatar_8.jpg";
import avatar9 from "../assets/avatar_9.jpg";
import { twMerge } from "tailwind-merge";  // Tailwind merge for handling conflicting styles
import { motion } from "framer-motion";   // For animation

const testimonials = [
  {
    text: "As a fashion photographer, EliteRetoucher has transformed my workflow. The quality is consistently exceptional and the turnaround time is impressive.",
    imageSrc: avatar1,
    name: "Jamie Rivera",
    username: "@jamie_fashionphoto",
    role: "Fashion Photographer"
  },
  {
    text: "Our e-commerce business relies on EliteRetoucher for all our product images. The consistency and quality have helped boost our conversion rates significantly.",
    imageSrc: avatar2,
    name: "Josh Smith",
    username: "@jjsmithretail",
    role: "E-commerce Director"
  },
  {
    text: "The magazine retouching service is absolutely worth every penny. Our editorial team has never been happier with the final results.",
    imageSrc: avatar3,
    name: "Morgan Lee",
    username: "@morganleeeditor",
    role: "Magazine Editor"
  },
  {
    text: "I was amazed at how quickly they understood my brand's aesthetic. The retouching is always perfect and on-brand.",
    imageSrc: avatar4,
    name: "Casey Jordan",
    username: "@caseyjbrands",
    role: "Brand Manager"
  },
  {
    text: "Planning and executing photoshoots has never been easier knowing EliteRetoucher has my back in post-production. They never miss a deadline.",
    imageSrc: avatar5,
    name: "Taylor Kim",
    username: "@taylorkimphoto",
    role: "Wedding Photographer"
  },
  {
    text: "The customizability and attention to detail are top-notch. They always deliver exactly what I envision for my portraits.",
    imageSrc: avatar6,
    name: "Riley Chen",
    username: "@rileyportraits",
    role: "Portrait Photographer"
  },
  {
    text: "Adopting EliteRetoucher for our agency has streamlined our workflow and improved client satisfaction across the board.",
    imageSrc: avatar7,
    name: "Jordan Patel",
    username: "@jpatelsstudio",
    role: "Studio Owner"
  },
  {
    text: "With the Diamond plan, we can easily manage high-volume projects with consistent quality. The dedicated account manager makes all the difference.",
    imageSrc: avatar8,
    name: "Sam Dawson",
    username: "@dawsoncommercial",
    role: "Commercial Photographer"
  },
  {
    text: "The user-friendly portal and robust features support our diverse needs. The before/after comparison tool is particularly impressive.",
    imageSrc: avatar9,
    name: "Casey Harper",
    username: "@casey09photo",
    role: "Product Photographer"
  },
];

const firstColumn = testimonials.slice(0, 3);
const secondColumn = testimonials.slice(3, 6);
const thirdColumn = testimonials.slice(6, 9);

const TestimonialsColumn = ({ className, testimonials, duration }) => (
  <div className={className}>
    <motion.div
      animate={{
        translateY: "-50%",
      }}
      transition={{
        repeat: Infinity,
        duration: duration || 10,
        ease: "linear",
        repeatType: "loop",
      }}
      className="flex flex-col gap-6 pb-6"
    >
      {[...new Array(2)].fill(0).map((_, index) => (
        <React.Fragment key={index}>
          {testimonials.map(({ text, imageSrc, name, username, role }) => (
            <div key={name} className="card bg-gradient-to-b from-white to-gray-50 border border-gray-200 p-6 rounded-xl shadow-sm">
              <div className="text-gray-700 italic">"{text}"</div>
              <div className="flex items-center gap-3 mt-5">
                <img
                  src={imageSrc}
                  alt={name}
                  width={40}
                  height={40}
                  className="h-10 w-10 rounded-full object-cover border-2 border-primary-100"
                />
                <div className="flex flex-col">
                  <div className="font-medium tracking-tight leading-5 text-gray-900">{name}</div>
                  <div className="leading-5 tracking-tight text-primary-600 text-sm">{role}</div>
                  <div className="leading-4 tracking-tight text-gray-500 text-xs">{username}</div>
                </div>
              </div>
            </div>
          ))}
        </React.Fragment>
      ))}
    </motion.div>
  </div>
);

const Testimonials = () => {
  return (
    <section className="bg-gradient-to-b from-gray-50 to-white py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center rounded-full bg-primary-100 px-4 py-2 text-sm font-medium text-primary-700 mb-6">
            Testimonials
          </div>

          <h2 className="text-4xl font-bold text-gray-900 mb-4">What Our Clients Say</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            From professional photographers to creative agencies, our clients love the quality and consistency of our retouching services.
          </p>
        </div>

        <div className="flex justify-center gap-6 mt-10 max-h-[738px] overflow-hidden [mask-image:linear-gradient(to_bottom,transparent,black_25%,black_75%,transparent)]">
          <TestimonialsColumn testimonials={firstColumn} duration={15} />
          <TestimonialsColumn
            testimonials={secondColumn}
            className="hidden md:block"
            duration={19}
          />
          <TestimonialsColumn
            testimonials={thirdColumn}
            className="hidden lg:block"
            duration={17}
          />
        </div>
      </div>
    </section>
  );
};

export default Testimonials;