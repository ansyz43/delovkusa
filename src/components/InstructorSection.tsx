import React from "react";
import { motion } from "framer-motion";
import InstructorCard from "./InstructorCard";

interface Instructor {
  id: string;
  name: string;
  specialty: string;
  bio: string;
  image: string;
  courses: number;
  experience: string;
}

interface InstructorSectionProps {
  title?: string;
  subtitle?: string;
  instructors?: Instructor[];
}

const InstructorSection = ({
  title = "Обо мне",
  subtitle = "Я помогу вам освоить кондитерское искусство и создавать настоящие шедевры",
  instructors = [
    {
      id: "1",
      name: "Ирина Гордеева",
      specialty: "Французская выпечка",
      bio: "Отмеченный наградами шеф-кондитер с более чем 15-летним опытом работы в ресторанах со звездами Мишлен. Специализируется на французских техниках выпечки и современной подаче десертов.",
      image:
        "/instructor.jpg",
      courses: 5,
      experience: "15+ years",
    },
  ],
}: InstructorSectionProps) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <section className="py-16 px-4 md:px-8 bg-gradient-to-b from-white to-pink-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <motion.h2
            className="text-3xl md:text-4xl font-bold mb-4 text-gray-800"
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {title}
          </motion.h2>
          <motion.p
            className="text-gray-600 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {subtitle}
          </motion.p>
        </div>

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 justify-items-center"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {instructors.map((instructor) => (
            <motion.div key={instructor.id} variants={itemVariants}>
              <InstructorCard
                id={instructor.id}
                name={instructor.name}
                specialty={instructor.specialty}
                bio={instructor.bio}
                image={instructor.image}
                courses={instructor.courses}
                experience={instructor.experience}
              />
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <p className="text-gray-600 italic mb-4">
            "Моя цель — передать вам все секреты кондитерского мастерства и
            помочь раскрыть ваш творческий потенциал."
          </p>
          <a
            href="#"
            className="text-pink-600 hover:text-pink-800 font-medium inline-flex items-center transition-colors duration-300"
          >
            Узнайте больше о моем подходе к обучению
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 ml-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default InstructorSection;
